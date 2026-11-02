import Script from "next/script";

// CHANGE: 2026-11-02 — Google "preferred source" opt-in.
// WHY: Google Search lets a reader mark a publisher as a preferred source, after which that
// publisher's content is more likely to appear in Top Stories, AI Mode and AI Overviews with a
// "preferred" badge. The opt-in lives on the reader's Google account, so the only thing the site
// can do is offer the official button (Search Central: "Help your readers find your site through
// preferred sources in Google Search").
//
// IMPLEMENTATION: the STANDARD declarative form Google recommends. `publisher.js` looks for any
// element carrying the `google-add-preferred-source-btn` attribute, renders its own localized
// Google-styled button into it, and handles the whole flow (including returning the reader to
// this page). The library ships a MutationObserver (verified in the served bundle), so a button
// mounted by a client-side App Router navigation is picked up as well — no re-init needed.
//
// Eligibility is domain-level only (https://sarvadnyainfotech.com is eligible; a subdirectory
// would not be), and the site must also be included in Search generative AI features in Search
// Console. That is a Search Console setting, not something this component can assert.
//
// CSP: news.google.com is allowed in script-src/connect-src/img-src and the Google hosts the
// opt-in flow may use are in frame-src (see next.config.js).
const PREFERRED_SOURCE_PREFERENCES_URL =
  "https://www.google.com/preferences/source?q=sarvadnyainfotech.com";

type PreferredSourceProps = {
  /** Google's own button theme. Every surface on this site is light. */
  theme?: "light" | "dark";
  /** `card` draws the house card chrome; `inline` drops it for use inside an existing panel. */
  variant?: "card" | "inline";
  className?: string;
};

export default function PreferredSource({
  theme = "light",
  variant = "card",
  className = "",
}: PreferredSourceProps) {
  const body = (
    <>
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#006569]">
        Google preferred source
      </p>
      <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
        Add <span className="font-bold text-slate-800">Sarvadnya Infotech</span> as a preferred
        source in Google Search. Once you choose us, our TallyPrime, TSS and Tally Insights
        content is more likely to appear for you in Top Stories, AI Mode and AI Overviews with a
        preferred badge.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* The Google library replaces this node with its localized, Google-styled button. */}
        {/* No data-lang on purpose: Google then uses the reader's browser language. */}
        <div {...{ "google-add-preferred-source-btn": "" }} data-theme={theme} />
        {/*
          Fallback for a browser/extension that blocks the Google script: the same flow as a
          plain deeplink (Search Central's deeplink implementation). Kept visually secondary so
          it never competes with the official button.
        */}
        <a
          href={PREFERRED_SOURCE_PREFERENCES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#0f5f63] underline-offset-2 hover:text-[#006569] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2 rounded"
        >
          Or open Google source preferences
        </a>
      </div>
      <Script
        id="google-preferred-source-lib"
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="afterInteractive"
      />
    </>
  );

  if (variant === "inline") {
    return <div className={className}>{body}</div>;
  }

  return (
    <aside
      aria-label="Add Sarvadnya Infotech as a preferred source in Google Search"
      className={`rounded-2xl border border-[#D4EAEA] bg-[#F5F4ED]/60 p-5 sm:p-6 ${className}`}
    >
      {body}
    </aside>
  );
}
