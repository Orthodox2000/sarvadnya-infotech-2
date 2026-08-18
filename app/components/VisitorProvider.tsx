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
const THROTTLE_MS = 10_000;
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
  const lastSendRef = useRef(0);
  const pendingPathRef = useRef<string | null>(null);
  const sectionBuf = useRef<string[]>([]);

  const send = useCallback(
    (path: string) => {
      if (!sessionId || document.visibilityState !== 'visible') return;

      const sectionViews = sectionBuf.current;
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
        path,
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

      const now = Date.now();
      if (now - lastSendRef.current >= THROTTLE_MS) {
        lastSendRef.current = now;
        fetch('/api/identify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {});
      } else {
        pendingPathRef.current = path;
        window.setTimeout(() => {
          const p = pendingPathRef.current;
          pendingPathRef.current = null;
          if (p) send(p);
        }, THROTTLE_MS);
      }
    },
    [sessionId]
  );

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // Page-level beacon on mount + every path change (throttled).
  useEffect(() => {
    if (sessionId) send(pathname);
  }, [pathname, sessionId, send]);

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
