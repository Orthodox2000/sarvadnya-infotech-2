// CHANGE: 2026-10-23 - Section index page (server-rendered, indexable).
// CHANGE: 2026-11-24 — moved into the shared W3-style docs shell; the page now renders only
// its own header, breadcrumb and clean guide list. No local nav, footer or hero assets.
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  INSIGHTS_ENTRY_PATH,
  getLessonsBySection,
  getSectionById,
  SECTIONS,
} from "@/lib/learn-tally-curriculum";
import { breadcrumbJsonLd, seoMetadata } from "@/lib/seo";

// CHANGE: 2026-11-24 — static curriculum, rarely changes; 6h ISR to reduce CPU.
export const revalidate = 21600;
export const dynamicParams = false;

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const sec = getSectionById(section);
  if (!sec) return {};
  const title = sec.seoTitle || `${sec.title} | Tally Insights`;
  const description = sec.seoDescription || sec.description;
  const keywords = sec.keywords || [];
  return seoMetadata({
    title,
    description,
    path: `/tally-insights/${sec.id}`,
    keywords,
    // CHANGE: 2026-10-29 — answer-first reference page (see lib/seo.ts `contactSuffix`).
    contactSuffix: false,
  });
}

export default async function TallyInsightsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const sec = getSectionById(section);
  if (!sec) return notFound();

  const lessons = getLessonsBySection(section);
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tally Insights", path: INSIGHTS_ENTRY_PATH },
    { name: sec.title, path: `/tally-insights/${sec.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="docs-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href={INSIGHTS_ENTRY_PATH}>Tally Insights</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{sec.title}</span>
      </nav>

      <header className="overview_header docs-page-header">
        <p className="docs-kicker">Tally Insights</p>
        <h1>{sec.title}</h1>
        <p className="docs-lede">{sec.description}</p>
      </header>

      <section className="tut_overview" aria-label={`${sec.title} guides`}>
        <div className="docs-section-meta">
          {lessons.length} guide{lessons.length === 1 ? "" : "s"} in this section
        </div>
        <div className="docs-guide-list">
          {lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/tally-insights/${sec.id}/${lesson.slug}`}
              className="docs-guide-card"
            >
              <h2>{lesson.title}</h2>
              <p>{lesson.intro}</p>
            </Link>
          ))}
        </div>
        {/* CHANGE: 2026-11-24 — one grounded "why us over a search result" strip per section. */}
        <aside className="docs-section-help" aria-label="Help applying these guides">
          <div>
            <h2>Got the steps. Need it working in your Tally?</h2>
            <p>
              These guides show how TallyPrime works. As a Tally Certified Partner since 2008
              serving 1500+ businesses, we configure it for your data, version and compliance —
              from setup and TSS renewal to TDL customization, cloud hosting and training. Skip
              the trial-and-error of generic search results.
            </p>
          </div>
          <div className="docs-cta-actions">
            <Link href="/contact" className="docs-cta-link">
              Ask our team
            </Link>
            <Link href="/services" className="docs-cta-link docs-cta-link-secondary">
              Our services
            </Link>
          </div>
        </aside>
        <div className="docs-back-row">
          <Link href={INSIGHTS_ENTRY_PATH} className="docs-back-link">
            &larr; Start from the first section
          </Link>
        </div>
      </section>
    </>
  );
}
