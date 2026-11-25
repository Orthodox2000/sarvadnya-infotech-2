'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';

const SESSION_COOKIE = 'svd_vid';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
// CHANGE: 2026-11-25 — Fluid CPU: buffer paths and send one beacon per window instead of
// one POST per path (the old 10 s throttle still sent a separate request for every path).
const BATCH_FLUSH_MS = 30_000;
const MAX_BUFFERED_PATHS = 30;
const MAX_SECTION_VIEWS = 20;
const SESSION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function makeSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getOrCreateSessionId(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]+)`));
  if (match && SESSION_ID_RE.test(match[1])) return match[1];
  const id = makeSessionId();
  document.cookie = `${SESSION_COOKIE}=${id}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  return id;
}

interface VisitorContextValue {
  sessionId: string | null;
  trackSection: (id: string) => void;
}

const VisitorContext = createContext<VisitorContextValue>({
  sessionId: null,
  trackSection: () => {},
});

export const useVisitor = () => useContext(VisitorContext);

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const pathBuf = useRef<Array<{ path: string; at: number }>>([]);
  const flushTimerRef = useRef<number | null>(null);
  const sectionBuf = useRef<string[]>([]);

  // CHANGE: 2026-11-25 — one POST now carries every path buffered in the flush window.
  // The server increments visitCount/pageViews by the batch size and pushes each path with
  // its client timestamp, so ledger totals stay identical while /api/identify calls fall.
  const flush = useCallback(() => {
    if (!sessionId) return;
    if (flushTimerRef.current !== null) {
      window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    const paths = pathBuf.current;
    if (paths.length === 0) return; // leave section views buffered for the next path beacon
    const sectionViews = sectionBuf.current;
    pathBuf.current = [];
    sectionBuf.current = [];

    // CHANGE: 2026-08-18 — Parse UTM params from URL for campaign tracking.
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || undefined;
    const utmMedium = params.get('utm_medium') || undefined;
    const utmCampaign = params.get('utm_campaign') || undefined;
    const utmTerm = params.get('utm_term') || undefined;
    const utmContent = params.get('utm_content') || undefined;

    const body = JSON.stringify({
      sessionId,
      path: paths[0].path, // backward-compatible single-path field for older readers
      paths,
      referrer: document.referrer.slice(0, 500),
      title: document.title.slice(0, 200),
      language: navigator.language || '',
      screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
      sectionViews: sectionViews.slice(0, MAX_SECTION_VIEWS),
      ...(utmSource ? { utmSource } : {}),
      ...(utmMedium ? { utmMedium } : {}),
      ...(utmCampaign ? { utmCampaign } : {}),
      ...(utmTerm ? { utmTerm } : {}),
      ...(utmContent ? { utmContent } : {}),
    });

    fetch('/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [sessionId]);

  const send = useCallback(
    (path: string) => {
      // CHANGE: 2026-11-25 — hidden tabs are no longer discarded or parked as one pending
      // path; every path enters the same buffer and is flushed on pagehide/visibilitychange
      // with keepalive. Background-tab visits survive without needing an extra POST.
      if (!sessionId) return;
      pathBuf.current.push({ path, at: Date.now() });
      if (pathBuf.current.length >= MAX_BUFFERED_PATHS) {
        flush();
        return;
      }
      if (flushTimerRef.current === null) {
        flushTimerRef.current = window.setTimeout(() => {
          flushTimerRef.current = null;
          flush();
        }, BATCH_FLUSH_MS);
      }
    },
    [sessionId, flush]
  );

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // Page-level paths are buffered on mount + every path change.
  useEffect(() => {
    if (sessionId) send(pathname);
  }, [pathname, sessionId, send]);

  // CHANGE: 2026-11-25 — flush buffered paths when the tab is hidden or unloaded.
  // keepalive lets the final beacon out as the page closes; the timer above covers
  // normal in-session navigation.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, [flush]);

  const trackSection = useCallback((id: string) => {
    if (!id || sectionBuf.current.includes(id)) return;
    if (sectionBuf.current.length >= MAX_SECTION_VIEWS) return;
    sectionBuf.current.push(id);
  }, []);

  // Global IntersectionObserver for any `[data-track]` element already in the
  // DOM (covers plain markup). <TrackSection> also self-observes so sections
  // mounted later (modals, tabs) are still captured; trackSection dedupes.
  useEffect(() => {
    if (!sessionId || !('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-track]'));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.track;
            if (id) trackSection(id);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sessionId, trackSection, pathname]);

  return (
    <VisitorContext.Provider value={{ sessionId, trackSection }}>
      {children}
    </VisitorContext.Provider>
  );
}
