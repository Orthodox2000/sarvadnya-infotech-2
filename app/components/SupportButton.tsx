'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import QuickSupportModal from './QuickSupportModal';

// CHANGE: 2026-10-12 — owner: the homepage Ask Sara tab gets too few clicks; add a SUBTLE
// desktop-only "peek + short speech bubble" promo. Homepage only, hover-capable desktop only,
// reduced-motion respected, max 3 cycles, dismissible per session (sessionStorage, no cookie).
const PROMO_INITIAL_DELAY_MS = 2500;
const PROMO_VISIBLE_MS = 5000;
const PROMO_GAP_MS = 18000;
const PROMO_MAX_CYCLES = 3;
const PROMO_DISMISS_KEY = 'sara_promo_dismissed';
const PROMO_BUBBLE_TEXT = 'Need help? Get instant AI suggestions';

export default function SupportButton({ initialSettings }: { initialSettings?: any }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState(initialSettings?.whatsapp_phone || initialSettings?.support_phone || "9821309060");

  // CHANGE: 2026-10-12 — Ask Sara homepage promo state (see constants above).
  const [promoActive, setPromoActive] = useState(false);   // eligible: homepage + hover desktop + motion ok
  const [promoVisible, setPromoVisible] = useState(false); // currently peeking with the bubble shown
  const [engaged, setEngaged] = useState(false);           // pointer is over the tab
  const [pageHidden, setPageHidden] = useState(false);     // tab hidden -> pause the loop
  const [promoDismissed, setPromoDismissed] = useState(false);

  useEffect(() => {
    if (initialSettings) return;
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.whatsapp_phone) {
          setWhatsappPhone(data.whatsapp_phone);
        } else if (data.support_phone) {
          setWhatsappPhone(data.support_phone);
        }
      } catch (err) {
        console.error('Failed to fetch whatsapp phone:', err);
      }
    };
    fetchSettings();
  }, [initialSettings]);

  // CHANGE: 2026-10-12 — eligibility for the promo (homepage + hover-capable desktop + motion
  // allowed + not already dismissed this session). Read on the client only, in an effect, so the
  // server-rendered markup never contains the bubble (no hydration mismatch).
  useEffect(() => {
    if (!isHomePage) { setPromoActive(false); return; }
    let ok = false;
    let isDismissed = false;
    try {
      ok = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      isDismissed = sessionStorage.getItem(PROMO_DISMISS_KEY) === '1';
    } catch {}
    setPromoDismissed(isDismissed);
    setPromoActive(ok && !isDismissed);
  }, [isHomePage]);

  // CHANGE: 2026-10-12 — pause the promo while the tab is in the background (Page Visibility).
  useEffect(() => {
    const onVis = () => setPageHidden(document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // CHANGE: 2026-10-12 — the promo loop: peek + bubble for ~5 s, retract, repeat every ~18 s,
  // max 3 cycles then stop permanently. Hovering the tab reveals it immediately (never ducks
  // away from an intending user); a hidden tab pauses it.
  useEffect(() => {
    if (!promoActive || promoDismissed || isOpen) { setPromoVisible(false); return; }
    if (engaged) { setPromoVisible(true); return; }
    if (pageHidden) { setPromoVisible(false); return; }

    let cancelled = false;
    let cycle = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };
    const showOnce = () => {
      if (cancelled || cycle >= PROMO_MAX_CYCLES) return;
      cycle += 1;
      setPromoVisible(true);
      later(() => {
        if (cancelled) return;
        setPromoVisible(false);
        later(showOnce, PROMO_GAP_MS);
      }, PROMO_VISIBLE_MS);
    };
    later(showOnce, PROMO_INITIAL_DELAY_MS);
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [promoActive, promoDismissed, isOpen, engaged, pageHidden]);

  // CHANGE: 2026-10-12 — stop promoting for the session (the ✕, the bubble, or once Sara opens).
  const stopPromo = () => {
    try { sessionStorage.setItem(PROMO_DISMISS_KEY, '1'); } catch {}
    setPromoDismissed(true);
    setPromoVisible(false);
  };

  const whatsappNumber = whatsappPhone.replace(/\D/g, '').length === 10 
    ? '91' + whatsappPhone.replace(/\D/g, '') 
    : whatsappPhone.replace(/\D/g, '');

  useEffect(() => {
    const checkOpen = () => {
      if (window.location.hash === '#ask-sara' || window.location.search.includes('ask-sara=true')) {
        setIsOpen(true);
        const cleanUrl = window.location.href
          .replace(/[?&]ask-sara=true/, '')
          .replace(/#ask-sara/, '');
        if (cleanUrl !== window.location.href) {
          window.history.replaceState(null, '', cleanUrl);
        }
      }
    };
    checkOpen();
    const interval = setInterval(checkOpen, 400);
    window.addEventListener('hashchange', checkOpen);
    window.addEventListener('popstate', checkOpen);
    return () => {
      clearInterval(interval);
      window.removeEventListener('hashchange', checkOpen);
      window.removeEventListener('popstate', checkOpen);
    };
  }, [pathname]);

  return (
    <>
      <div className={`fixed bottom-[10%] z-[3000] flex flex-col items-end gap-[8px]`}
        style={{ right: '0', left: 'auto' }}>
        {/* Ask Sara (+ 2026-10-12 homepage promo: peek + short bubble) */}
        <div
          className={`relative flex items-center transition-transform duration-700 ease-out ${promoVisible ? '-translate-x-[14px]' : 'translate-x-0'}`}
          onMouseEnter={() => setEngaged(true)}
          onMouseLeave={() => { setEngaged(false); setPromoVisible(false); }}
        >
          {/* Bubble — hidden from layout until the promo shows. Text and ✕ are SIBLING buttons
              (no nesting), and the whole thing is skipped by tab order while hidden. */}
          <div
            className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${promoVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={!promoVisible}
          >
            <div className="relative flex items-center gap-1.5 bg-white text-[#006569] border border-[#006569]/15 shadow-lg rounded-xl pl-3 pr-1.5 py-2 max-w-[240px]">
              <button
                type="button"
                tabIndex={promoVisible ? 0 : -1}
                onClick={() => { stopPromo(); setIsOpen(true); }}
                className="text-left text-[11px] font-semibold leading-tight"
              >
                {PROMO_BUBBLE_TEXT}
              </button>
              <button
                type="button"
                tabIndex={promoVisible ? 0 : -1}
                onClick={stopPromo}
                aria-label="Dismiss Ask Sara suggestion"
                className="shrink-0 grid place-items-center w-5 h-5 rounded-full text-[#006569]/60 hover:text-[#006569] hover:bg-[#E5F4F4]"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* tail pointing right at the tab */}
              <span aria-hidden className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-t border-r border-[#006569]/15 rotate-45" />
            </div>
          </div>

          <button
            onClick={() => { stopPromo(); setIsOpen(true); }}
            aria-label="Ask AI"
            className="flex flex-col items-center gap-1.5 bg-[#006569] text-white hover:bg-white hover:text-[#25D366] hover:border-[#25D366]/30 border border-white/20 w-[42px] py-2.5 group shadow-md rounded-l-[8px] transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-bold text-[10px] tracking-tight leading-tight text-center [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180">Ask Sara</span>
          </button>
        </div>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 text-white bg-[#25D366] hover:text-[#25D366] hover:bg-white hover:border-[#25D366] border border-[#25D366]/30 w-10.5 py-2.5 group shadow-md rounded-l-[8px] transition-colors duration-300"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="font-bold text-[10px] tracking-tight leading-tight text-center [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180">WhatsApp</span>
        </a>
      </div>

      <QuickSupportModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
