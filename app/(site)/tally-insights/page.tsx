// CHANGE: 2026-10-23 - The hub is now a SERVER component.
// WHY: it used to be a single client page that shipped the entire curriculum (every lesson's
// bodyMd) to the browser and rendered one lesson in place, so only /tally-insights was
// indexable. Each lesson now has its own URL (/tally-insights/<section>/<lesson>) and each
// section has its own index (/tally-insights/<section>). The hub renders section cards with
// real <Link>s to both, and only the compact nav model reaches the client island, so the
// page is crawlable AND the JS payload no longer contains any lesson body.
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../components/Footer";
import TallyInsightsNav from "@/app/components/TallyInsights/TallyInsightsNav";
import {
  getInsightsNavModel,
  getLessonsBySection,
  SECTIONS,
} from "@/lib/learn-tally-curriculum";
import { breadcrumbJsonLd, seoMetadata } from "@/lib/seo";

// CHANGE: 2026-10-23 - Hub metadata moved here from the route layout.
// WHY: the layout metadata applied to the whole /tally-insights subtree, so every future
// section/lesson page would inherit the hub's canonical. Metadata is now owned per page.
export const metadata: Metadata = seoMetadata({
  title: "TallyPrime & ERP 9 Knowledge Hub",
  description:
    "TallyPrime and Tally ERP 9 guides on company setup, vouchers, GST, reconciliation, payroll, reports and TSS.",
  path: "/tally-insights",
  keywords: [
    "tally insights",
    "tally prime guide",
    "learn tally prime",
    "tally erp 9 guide",
    "tallyprime tutorials",
    "tally knowledge hub",
  ],
});

export default function TallyInsightsPage() {
  const nav = getInsightsNavModel();
  const sections = SECTIONS.slice()
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      ...section,
      lessons: getLessonsBySection(section.id),
    }));

  const lessonCount = sections.reduce((total, s) => total + s.lessons.length, 0);

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tally Insights", path: "/tally-insights" },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4ED] border border-[#E5F4F4] mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#006569]">
              Tally Insights
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Tally Prime &amp; ERP 9 <span className="text-[#006569]">Knowledge Hub</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium max-w-3xl">
            Practical, business-focused guides to help you sell, implement and scale Tally
            solutions. {sections.length} topics, {lessonCount} in-depth guides, all written by
            our Tally Certified team.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="lg:w-[240px] xl:w-[260px] 2xl:w-[280px] flex-shrink-0">
            <TallyInsightsNav nav={nav} />
          </aside>

          <section className="flex-1 min-w-0" aria-label="Tally Insights topics">
            <div className="grid gap-5 sm:grid-cols-2">
              {sections.map((section) => (
                <article
                  key={section.id}
                  className="border border-slate-200 rounded-lg p-5 sm:p-6 bg-white shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      <Link
                        href={`/tally-insights/${section.id}`}
                        className="hover:text-[#006569] transition-colors"
                      >
                        {section.title}
                      </Link>
                    </h2>
                    <span className="mt-0.5 text-[10px] font-bold text-slate-400 tabular-nums whitespace-nowrap">
                      {section.lessons.length} guide{section.lessons.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {section.description}
                  </p>
                  {section.lessons.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {section.lessons.map((lesson) => (
                        <li key={lesson.slug}>
                          <Link
                            href={`/tally-insights/${section.id}/${lesson.slug}`}
                            className="group inline-flex items-start gap-1.5 text-[13px] font-semibold text-slate-700 hover:text-[#006569] transition-colors"
                          >
                            <span className="mt-[3px] text-[#006569] opacity-60 group-hover:opacity-100 transition-opacity">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </span>
                            <span className="leading-snug">{lesson.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4">
                    <Link
                      href={`/tally-insights/${section.id}`}
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#006569] hover:gap-2 transition-all duration-200"
                    >
                      Open topic
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-lg border border-[#E5F4F4] bg-[#F5F4ED]/40 p-5 sm:p-6">
              <h2 className="text-base font-black text-slate-900 tracking-tight mb-2">
                Need a Tally specialist?
              </h2>
              <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
                Our certified team handles TallyPrime licences, TSS renewals, Tally on Cloud,
                AMC and custom TDL work for businesses across Mumbai and Navi Mumbai.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#006569] text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.15em] hover:bg-[#045A57] transition-colors duration-200"
              >
                Talk to our team
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
