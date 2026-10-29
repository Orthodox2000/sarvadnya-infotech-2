// CHANGE: 2026-10-26 — SEO layer 2 hub. /tools is the parent of the free TSS expiry checker,
// so the checker's breadcrumb (Home / Tools / TSS Expiry Checker) resolves to a real page
// instead of a 404. WHY it exists at all: a breadcrumb that points at a missing URL is a broken
// internal link, and Google treats that as a crawl defect on a brand-new page.
//
// Deliberately lists ONLY tools that actually ship. When a second tool goes live, add a card
// here rather than advertising something the visitor cannot use.
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../components/Footer";
import { breadcrumbJsonLd, seoMetadata } from "@/lib/seo";

// CHANGE: 2026-10-29 — action-first title naming the actual tool (the hub only has one so far) and a
// description that leads with the free/no-signup promise for CTR.
export const metadata: Metadata = seoMetadata({
  title: "Free TSS Expiry Checker for Tally",
  description:
    "Free Tally tools by Sarvadnya Infotech. Start with the TSS expiry checker and see the days left on your licence. No signup, nothing stored.",
  path: "/tools",
  keywords: ["free tally tools", "tss expiry checker", "tallyprime tools", "tally utilities"],
  // CHANGE: 2026-10-29 — free-tool page: the promise is the answer (see lib/seo.ts `contactSuffix`).
  contactSuffix: false,
});

const TOOLS = [
  {
    href: "/tools/tss-expiry-checker",
    title: "TSS expiry checker",
    blurb:
      "Enter the coverage end date that TallyPrime shows in F1 (Help) > Settings > License > Manage License and see how many days are left, or how long ago it lapsed.",
    note: "No sign-up, no storage, no data sent.",
  },
];

export default function ToolsHubPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#006569]">Tools</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Free Tally tools</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          Small, focused utilities that answer one question without a sign-up. They run in your browser, they store
          nothing, and every fact shown alongside them is already published in our guides.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col rounded-2xl border border-[#E5F4F4] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#B8DEDE] hover:shadow-[0_10px_30px_-18px_rgba(0,101,105,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006569]"
            >
              <h2 className="text-[15px] font-bold tracking-tight text-slate-900 group-hover:text-[#006569]">
                {tool.title}
              </h2>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-600">{tool.blurb}</p>
              <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                {tool.note}
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#006569]">
                Open the tool
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-[13px] leading-relaxed text-slate-600">
          Need the background first? Read the{" "}
          <Link
            href="/learn-sara/tss-renewal-and-subscription"
            className="font-bold text-[#006569] underline decoration-[#B8DEDE] underline-offset-2 hover:decoration-[#006569]"
          >
            TSS renewal guide
          </Link>
          , the{" "}
          <Link
            href="/tally-insights"
            className="font-bold text-[#006569] underline decoration-[#B8DEDE] underline-offset-2 hover:decoration-[#006569]"
          >
            Tally Insights hub
          </Link>
          , or{" "}
          <Link
            href="/services/tss"
            className="font-bold text-[#006569] underline decoration-[#B8DEDE] underline-offset-2 hover:decoration-[#006569]"
          >
            have our team renew TSS for you
          </Link>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}
