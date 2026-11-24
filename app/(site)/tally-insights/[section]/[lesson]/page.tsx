// CHANGE: 2026-10-23 - Hardened lesson route: dynamicParams=false, section match guard,
// unified metadata via seoMetadata, added internal sidebar, correct section breadcrumb.
// CHANGE: 2026-11-24 — rebuilt for the W3-style docs shell. Every per-lesson image, lead
// form and large promo card is removed: those were the missing-asset and layout-noise source.
// The page now renders text, tables, FAQs and one quiet contact link.
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  INSIGHTS_ENTRY_PATH,
  getLessonBySlug,
  getLessonsBySection,
  getSectionById,
} from "@/lib/learn-tally-curriculum";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd, seoMetadata } from "@/lib/seo";
import MarkdownBody from "@/app/components/TallyInsights/MarkdownBody";

// CHANGE: 2026-11-24 — static curriculum, rarely changes; 6h ISR to reduce CPU.
export const revalidate = 21600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const { getAllLessonSlugs } = await import("@/lib/learn-tally-curriculum");
  return getAllLessonSlugs().map(({ section, slug }) => ({
    section,
    lesson: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; lesson: string }>;
}) {
  const { section, lesson } = await params;
  const l = getLessonBySlug(lesson);
  // CHANGE: 2026-10-23 - reject a mismatched section here too, so a hand-crafted URL such as
  // /tally-insights/gst-compliance/how-to-lock-data-in-tallyprime never serves the lesson's
  // metadata (duplicate-content signal) even before the page body calls notFound().
  if (!l || l.sectionId !== section) return {};
  // The helper appends the brand; older values carried a legacy "| Tally Insights" tail that
  // produced a double-branded title. The strip is harmless for the current clean titles.
  const title = (l.seoTitle || l.title).replace(/\s*\|\s*Tally Insights\s*$/i, "");
  const description = l.seoDescription || l.intro;
  const keywords = l.keywords || ["tally insights", "tally prime guide", "learn tally prime"];
  return seoMetadata({
    title,
    description,
    path: `/tally-insights/${l.sectionId}/${l.slug}`,
    keywords,
    // CHANGE: 2026-10-29 — answer-first reference page (see lib/seo.ts `contactSuffix`).
    contactSuffix: false,
  });
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ section: string; lesson: string }>;
}) {
  const { section: routeSection, lesson: lessonSlug } = await params;
  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) return notFound();
  // CHANGE: 2026-10-23 - reject mismatched section to prevent duplicate URLs.
  if (routeSection !== lesson.sectionId) return notFound();

  const section = getSectionById(lesson.sectionId);
  const lessonsInSection = getLessonsBySection(lesson.sectionId);
  const currentIndex = lessonsInSection.findIndex((l) => l.slug === lesson.slug);
  const prev = currentIndex > 0 ? lessonsInSection[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < lessonsInSection.length - 1
      ? lessonsInSection[currentIndex + 1]
      : null;

  const headline = (lesson.seoTitle || lesson.title).replace(
    /\s*\|\s*Tally Insights\s*$/i,
    "",
  );
  const jsonLd: any[] = [];
  jsonLd.push(
    articleJsonLd({
      headline,
      description: lesson.seoDescription || lesson.intro,
      // CHANGE: 2026-10-27 — pass the FULL path as `path`, not as `slug`. `slug` is
      // /news-scoped, so a path-like slug produced malformed `/news//tally-insights/...`
      // URLs that Search Console reported as failed indexing.
      path: `/tally-insights/${lesson.sectionId}/${lesson.slug}`,
      datePublished: "2026-10-19",
      // CHANGE: 2026-11-24 — the copy and layout changed today; keep the structured-data
      // modification date in step with the page actually served.
      dateModified: "2026-11-24",
      author: "Sarvadnya Infotech LLP",
    }),
  );
  jsonLd.push(
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Tally Insights", path: INSIGHTS_ENTRY_PATH },
      section
        ? { name: section.title, path: `/tally-insights/${section.id}` }
        : { name: lesson.sectionTitle, path: INSIGHTS_ENTRY_PATH },
      {
        name: lesson.title,
        path: `/tally-insights/${lesson.sectionId}/${lesson.slug}`,
      },
    ]),
  );
  if (lesson.faqs && lesson.faqs.length > 0) {
    jsonLd.push(faqPageJsonLd(lesson.faqs));
  }

  const quickAnswer =
    lesson.quickAnswer || lesson.seoDescription || lesson.intro;

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
        <Link href={`/tally-insights/${lesson.sectionId}`}>{lesson.sectionTitle}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{lesson.title}</span>
      </nav>

      <header className="overview_header docs-page-header">
        <p className="docs-kicker">{lesson.sectionTitle}</p>
        <h1>{lesson.title}</h1>
        <p className="docs-lede">{lesson.intro}</p>
        <div className="docs-quick-answer">
          <h2>Quick answer</h2>
          <p>{quickAnswer}</p>
        </div>
      </header>

      <article className="tut_overview docs-article">
        <MarkdownBody md={lesson.bodyMd} />

        {lesson.definitions && lesson.definitions.length > 0 && (
          <section className="docs-block" aria-labelledby="docs-terms-heading">
            <h2 id="docs-terms-heading">Key terms</h2>
            <div className="docs-term-list">
              {lesson.definitions.map((d, i) => (
                <div key={i} className="docs-term">
                  <h3>{d.term}</h3>
                  <p>{d.definition}</p>
                  {d.example && <p className="docs-term-example">Example: {d.example}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {lesson.examples && lesson.examples.length > 0 && (
          <section className="docs-block" aria-labelledby="docs-examples-heading">
            <h2 id="docs-examples-heading">Worked examples</h2>
            <div className="docs-example-list">
              {lesson.examples.map((ex, i) => (
                <div key={i} className="docs-example">
                  <h3>{ex.title}</h3>
                  <ol>
                    {ex.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                  {ex.notes && ex.notes.length > 0 && (
                    <ul className="docs-example-notes">
                      {ex.notes.map((n, idx) => (
                        <li key={idx}>{n}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {lesson.shortcuts && lesson.shortcuts.length > 0 && (
          <section className="docs-block" aria-labelledby="docs-shortcuts-heading">
            <h2 id="docs-shortcuts-heading">Quick shortcut reference</h2>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th scope="col">Keys</th>
                    <th scope="col">Action</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.shortcuts.map((sc, i) => (
                    <tr key={i}>
                      <td className="docs-key" data-label="Keys">{sc.keys}</td>
                      <td data-label="Action">{sc.action}</td>
                      <td data-label="Notes">{sc.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {lesson.faqs && lesson.faqs.length > 0 && (
          <section id="faq" className="docs-block" aria-labelledby="docs-faq-heading">
            <h2 id="docs-faq-heading">Frequently asked questions</h2>
            {lesson.faqIntro && <p className="docs-section-intro">{lesson.faqIntro}</p>}
            <div className="docs-faq-list">
              {lesson.faqs.map((f, i) => (
                <div key={i} id={`faq-${i + 1}`} className="docs-faq-item">
                  <h3>
                    <a href={`#faq-${i + 1}`}>{f.q}</a>
                  </h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {lesson.relatedLinks && lesson.relatedLinks.length > 0 && (
          <section className="docs-block" aria-labelledby="docs-related-heading">
            <h2 id="docs-related-heading">Related guides</h2>
            <ul className="docs-related-list">
              {lesson.relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* CHANGE: 2026-11-24 — the curated modulePromo data existed since 2026-10 but was never
          rendered. Surface it as a text-only card (no image/form) so every guide carries its
          own product/service message without disturbing the clean docs layout. */}
      {lesson.modulePromo && (
        <aside className="docs-promo" aria-label={lesson.modulePromo.title}>
          <div className="docs-promo-head">
            {lesson.modulePromo.badge && (
              <span className="docs-promo-badge">{lesson.modulePromo.badge}</span>
            )}
            <h2 className="docs-promo-title">{lesson.modulePromo.title}</h2>
          </div>
          <p className="docs-promo-body">{lesson.modulePromo.body}</p>
          {lesson.modulePromo.productUrl && (
            <Link href={lesson.modulePromo.productUrl} className="docs-cta-link">
              Learn more
            </Link>
          )}
        </aside>
      )}

      <aside className="docs-cta" aria-label="Talk to a Tally specialist">
        <p className="docs-cta-title">Why not just search this on Google?</p>
        <p>
          A search result tells you the menu path. It cannot tell you whether <em>your</em>{" "}
          ledger structure, TSS status or version will behave the same way. We are a Tally
          Certified Partner since 2008, based in CBD Belapur, Navi Mumbai, and we support
          1500+ businesses with TallyPrime, cloud, TSS renewal, TDL customization and training.
          A short conversation with our team gets you an answer checked against your actual
          setup instead of a generic forum reply.
        </p>
        <div className="docs-cta-actions">
          <Link href="/contact" className="docs-cta-link">
            Talk to our team
          </Link>
          <Link href="/services" className="docs-cta-link docs-cta-link-secondary">
            See our services
          </Link>
        </div>
      </aside>

      <nav className="docs-pager" aria-label="Previous and next guides">
        {prev ? (
          <Link
            href={`/tally-insights/${prev.sectionId}/${prev.slug}`}
            className="docs-pager-link"
          >
            <span>Previous</span>
            <strong>{prev.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/tally-insights/${next.sectionId}/${next.slug}`}
            className="docs-pager-link is-next"
          >
            <span>Next</span>
            <strong>{next.title}</strong>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}
