// CHANGE: 2026-10-26 — SEO layer 1: one indexable page per Sara topic (/learn-sara/<topic>).
// WHAT: server-renders the topic's real answer plus its follow-up questions, generated from
// lib/sara-topics.ts. WHY: the same knowledge already existed, but only inside a noindex chat
// screen, so it could never rank. Nothing here is invented: the body text is exactly what
// Sara answers in chat, and every fact in it was audited (2026-10-26).
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import SaraGuideBody, { saraExcerpt } from "@/app/components/SaraGuideBody";
import { getAllSaraGuideSlugs, getSaraGuide, saraGuides } from "@/lib/sara-topics";
import { breadcrumbJsonLd, faqPageJsonLd, seoMetadata } from "@/lib/seo";

// Only the ten real topics exist. A hand-typed slug must 404, never render a near-miss page.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSaraGuideSlugs().map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const guide = getSaraGuide(topic);
  if (!guide) return {};

  const description = guide.topic.description || saraExcerpt(guide.topic.answer);
  return seoMetadata({
    title: guide.label,
    description,
    path: `/learn-sara/${guide.slug}`,
    keywords: [guide.label.toLowerCase(), ...(guide.topic.keywords ?? [])],
  });
}

// CHANGE: 2026-10-26 — the TSS guide is the natural doorway to the free expiry checker tool,
// so it carries the extra CTA. Keyed by slug (not by matching prose) so it cannot drift.
const RELATED_TOOL: Record<string, { href: string; label: string; blurb: string }> = {
  "tss-renewal-and-subscription": {
    href: "/tools/tss-expiry-checker",
    label: "Free TSS expiry checker",
    blurb:
      "Paste the coverage end date from F1 (Help) > Settings > License > Manage License and see the days left, plus exactly which features stop when TSS expires.",
  },
};

export default async function SaraGuidePage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const guide = getSaraGuide(topic);
  if (!guide) notFound();

  const { label, slug, topic: guideTopic } = guide;
  const followUps = guideTopic.followUp ?? [];
  const tool = RELATED_TOOL[slug];
  // The other guides, minus this one — real internal links, not a sitemap dump.
  const siblings = saraGuides.filter((item) => item.slug !== slug);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Learn Sara", path: "/learn-sara" },
    { name: label, path: `/learn-sara/${slug}` },
  ]);

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: label,
    description: guideTopic.description || saraExcerpt(guideTopic.answer),
    mainEntityOfPage: `https://sarvadnyainfotech.com/learn-sara/${slug}`,
    author: { "@type": "Organization", name: "Sarvadnya Infotech LLP" },
    publisher: {
      "@type": "Organization",
      name: "Sarvadnya Infotech LLP",
      logo: { "@type": "ImageObject", url: "https://sarvadnyainfotech.com/logo.png" },
    },
    inLanguage: "en-IN",
  };

  // FAQPage is only emitted when the guide actually shows its follow-up questions.
  const faq = followUps.length
    ? faqPageJsonLd(
        followUps.map((item) => ({
          q: item.label,
          a: item.answer
            .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$1")
            .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
            .replace(/\s+/g, " ")
            .trim(),
        }))
      )
    : null;

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      {faq ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} /> : null}

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          <Link href="/" className="hover:text-[#006569]">Home</Link>
          <span aria-hidden className="px-1.5">/</span>
          <Link href="/learn-sara" className="hover:text-[#006569]">Learn Sara</Link>
          <span aria-hidden className="px-1.5">/</span>
          <span className="text-[#006569]">{label}</span>
        </nav>

        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{label}</h1>
        <p className="mt-3 text-[13px] font-semibold text-slate-500">
          A practical TallyPrime guide from Sarvadnya Infotech LLP, Tally Certified Partner since 2008.
        </p>

        <article className="mt-7 rounded-3xl border border-[#E5F4F4] bg-[#FBFAF6] p-5 sm:p-7">
          <SaraGuideBody text={guideTopic.answer} />
        </article>

        {tool ? (
          <div className="mt-6 rounded-2xl border border-[#006569]/20 bg-[#E5F4F4] p-5">
            <h2 className="text-[15px] font-bold tracking-tight text-slate-900">{tool.label}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700">{tool.blurb}</p>
            <Link
              href={tool.href}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#006569] px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#045A57]"
            >
              Open the checker
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : null}

        {followUps.length ? (
          <section className="mt-10" aria-labelledby="common-questions">
            <h2 id="common-questions" className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Common questions
            </h2>
            <div className="mt-4 space-y-4">
              {followUps.map((item, index) => (
                <div key={`${slug}-follow-${index}`} className="rounded-2xl border border-[#E9F1FA] bg-white p-5">
                  <h3 className="text-[15px] font-bold tracking-tight text-slate-900">{item.label}</h3>
                  <div className="mt-3">
                    <SaraGuideBody text={item.answer} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10" aria-labelledby="keep-going">
          <h2 id="keep-going" className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Keep going
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#006569] p-5 text-white">
              <h3 className="text-[15px] font-bold">Ask Sara about {label.toLowerCase()}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/85">
                Have a follow-up about your own company? Sara answers in plain English and asks for the details
                she needs before giving a long answer.
              </p>
              <Link
                href="/learn-sara/chat"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#006569] transition-colors hover:bg-[#E5F4F4]"
              >
                Open the chat
              </Link>
            </div>
            <div className="rounded-2xl border border-[#E9F1FA] bg-[#FBFAF6] p-5">
              <h3 className="text-[15px] font-bold text-slate-900">Need it done for you?</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                Our team handles licensing, TSS renewal, cloud access, AMC and customisation for 1500+ MSMEs.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#006569] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#006569] transition-colors hover:bg-[#E5F4F4]"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="more-guides">
          <h2 id="more-guides" className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#006569]">
            More guides
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {siblings.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/learn-sara/${item.slug}`}
                  className="inline-flex rounded-full border border-[#E9F1FA] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-slate-700 transition-colors hover:border-[#B8DEDE] hover:text-[#006569]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tally-insights"
                className="inline-flex rounded-full border border-[#E9F1FA] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-slate-700 transition-colors hover:border-[#B8DEDE] hover:text-[#006569]"
              >
                Tally Insights knowledge hub
              </Link>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
