// CHANGE: 2026-10-26 — /learn-sara is now a SERVER-RENDERED, INDEXABLE hub (SEO layer 1).
// WHAT CHANGED: the chat screen that used to live here moved to /learn-sara/chat (noindex),
// and this page became a hub of ten guide pages under /learn-sara/<topic>. WHY: the chat
// screen was a noindex utility page, so none of the TallyPrime knowledge inside it could
// ever rank in Google - the traffic went to competitors' articles instead. The guides are
// generated from the same lib/sara-topics.ts answers Sara speaks in chat, so there is one
// source of truth and nothing to keep in sync by hand.
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../components/Footer";
import { saraExcerpt } from "@/app/components/SaraGuideBody";
import { saraGuides } from "@/lib/sara-topics";
import { breadcrumbJsonLd, seoMetadata } from "@/lib/seo";

// CHANGE: 2026-10-29 — action-first title + trimmed description for CTR (impressions without clicks).
export const metadata: Metadata = seoMetadata({
  title: "Learn TallyPrime Step by Step",
  description:
    "Free step-by-step TallyPrime guides on GST, inventory, banking, payroll, reports, TSS renewal and ERP 9 upgrades. No signup needed.",
  path: "/learn-sara",
  keywords: [
    "learn tally prime",
    "tallyprime guides",
    "tally tutorial",
    "learn sara",
    "tally gst guide",
    "tss renewal guide",
  ],
  // CHANGE: 2026-10-29 — guide hub: answer first, no repeated contact tail (see lib/seo.ts).
  contactSuffix: false,
});

export default function LearnSaraHubPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Learn Sara", path: "/learn-sara" },
  ]);

  // CHANGE: 2026-10-26 — the ItemList mirrors the visible cards below (label + real URL),
  // so the markup never claims a guide that a visitor cannot see on this page.
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TallyPrime guides",
    itemListElement: saraGuides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.label,
      url: `https://sarvadnyainfotech.com/learn-sara/${guide.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#006569]">Learn Sara</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          TallyPrime guides, topic by topic
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-600">
          These are the questions our customers ask most often, written out in full: GST and e-invoicing,
          inventory, bank reconciliation, payroll, reports, shortcuts, TSS renewal, ERP 9 upgrades, ready-made
          add-ons and TDL customisation. Every guide below is also loaded into Sara, our AI consultant, so you
          can read it here or ask her a follow-up in plain English.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saraGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/learn-sara/${guide.slug}`}
              className="group flex flex-col rounded-2xl border border-[#E5F4F4] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#B8DEDE] hover:shadow-[0_10px_30px_-18px_rgba(0,101,105,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006569]"
            >
              <h2 className="text-[15px] font-bold tracking-tight text-slate-900 group-hover:text-[#006569]">
                {guide.label}
              </h2>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-600">
                {guide.topic.description || saraExcerpt(guide.topic.answer)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#006569]">
                Read the guide
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* The two non-guide destinations on this hub: the chat itself, and the free tool. */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[#006569] p-6 text-white">
            <h2 className="text-lg font-bold tracking-tight">Ask Sara directly</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-white/85">
              Prefer a conversation? Sara walks you through the same topics step by step, and asks a question
              first when your situation needs one.
            </p>
            <Link
              href="/learn-sara/chat"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#006569] transition-colors hover:bg-[#E5F4F4]"
            >
              Open the chat
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="rounded-2xl border border-[#E9F1FA] bg-[#FBFAF6] p-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Free tool: TSS expiry checker</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              Paste the coverage end date from TallyPrime and see how many days are left, plus exactly which
              features stop when TSS expires. Nothing is stored and nothing is sent.
            </p>
            <Link
              href="/tools/tss-expiry-checker"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#006569] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#006569] transition-colors hover:bg-[#E5F4F4]"
            >
              Check your date
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        <p className="mt-10 text-[13px] leading-relaxed text-slate-600">
          Want the deeper, step-by-step product walkthroughs instead?{" "}
          <Link href="/tally-insights" className="font-bold text-[#006569] underline decoration-[#B8DEDE] underline-offset-2 hover:decoration-[#006569]">
            Visit the Tally Insights knowledge hub
          </Link>
          , or{" "}
          <Link href="/contact" className="font-bold text-[#006569] underline decoration-[#B8DEDE] underline-offset-2 hover:decoration-[#006569]">
            talk to our team
          </Link>{" "}
          about your setup.
        </p>
      </main>

      <Footer />
    </div>
  );
}
