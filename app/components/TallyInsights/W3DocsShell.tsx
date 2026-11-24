// CHANGE: 2026-11-24 — Shared W3-style documentation shell for /tally-insights/**.
// WHY: section and lesson pages were each rendering their own sidebar, footer and width
// wrapper, so spacing drifted between them. One server shell owns the page frame; only the
// nav island is a client component. No W3.CSS is downloaded and no W3Schools artwork,
// branding or CTA is used — these are local class names with Sarvadnya styling.
// CHANGE: 2026-11-24 (one-screen flex fix) — the shell used to nest a second `.w3-row`
// inside `<main>`, so the article was a grandchild of the flex container. There is now exactly
// one flex row with two in-flow children (nav + main). Nothing is fixed, absolute or overlaid.
import type { ReactNode } from "react";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import TallyInsightsNav from "@/app/components/TallyInsights/TallyInsightsNav";
import { getInsightsNavModel } from "@/lib/learn-tally-curriculum";

export default function W3DocsShell({ children }: { children: ReactNode }) {
  const nav = getInsightsNavModel();

  return (
    <>
      <div className="contentcontainer">
        <a className="docs-skip-link" href="#tally-docs-main">
          Skip to guide
        </a>
        <div className="belowtopnavcontainer w3-row">
          <TallyInsightsNav nav={nav} />
          <main
            id="tally-docs-main"
            className="w3-main ws-light-grey w3-col l10 m12 docs-main-col"
          >
            {children}
          </main>
        </div>
        <div className="docs-home-link-wrap">
          <Link href="/" className="docs-home-link">
            &larr; Back to Sarvadnya Infotech
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
