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
// CHANGE: 2026-11-02 — owner: "just ensure people only see bare minimum". The card copy, the
// heading, the deeplink and both layout variants are GONE; what remains is Google's own button
// and nothing else, pinned top-right below the site chrome so it is the first thing a reader
// sees without a block of text.
//
// WHY IT IS STILL A BUTTON AND NOT AN AUTOMATIC OPT-IN (do not "fix" this):
//   1. There is no server-side API. Google exposes `preferredSource.addPreferredSource()` only to
//      the browser, and its own documentation states the end-user flow is unchanged — Google
//      still asks the reader to confirm. Nothing can be added "in the backend".
//   2. Browsers require a real user gesture, so the flow cannot be triggered on page load.
//   3. Rendering a lookalike "Continue as <name>" Google account screen to hide what is being
//      consented to would be deceptive and would put the domain's eligibility at risk.
//
// Eligibility is domain-level only (https://sarvadnyainfotech.com is eligible; a subdirectory
// would not be), and the site must also be included in Search generative AI features in Search
// Console. That is a Search Console setting, not something this component can assert.
//
// CSP: news.google.com is allowed in script-src/connect-src/img-src and the Google hosts the
// opt-in flow may use are in frame-src (see next.config.js).

type PreferredSourceProps = {
  /** Google's own button theme. Every surface on this site is light. */
  theme?: "light" | "dark";
  className?: string;
};

export default function PreferredSource({
  theme = "light",
  className = "",
}: PreferredSourceProps) {
  return (
    <>
      {/*
        Fixed, below the site chrome. MEASURED: NewsFeed h-[20px] + Navbar h-10 (40 px, lg:h-16 =
        64 px) + Productbar h-7 (28 px) = 88 px on phones and 112 px on desktop, so the previous
        76 px / 100 px offsets sat UNDER the product bar and were never visible. 92 px / 118 px
        clear the chrome with a 4–6 px breathing gap. z-[60] keeps it above page content but below
        the header (z-2000) and the Ask Sara button (z-3000).
      */}
      <div
        className={`fixed right-3 top-[92px] z-[60] origin-top-right scale-90 sm:scale-100 lg:top-[118px] lg:right-4 ${className}`}
      >
        {/* The Google library replaces this node with its localized, Google-styled button. */}
        {/* No data-lang on purpose: Google then uses the reader's browser language. */}
        <div {...{ "google-add-preferred-source-btn": "" }} data-theme={theme} />
      </div>
      <Script
        id="google-preferred-source-lib"
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="afterInteractive"
      />
    </>
  );
}
