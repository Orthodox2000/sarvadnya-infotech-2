// CHANGE: 2026-10-23 - Section index page (server-rendered, indexable).
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "../../../components/Footer";
import TallyInsightsNav from "@/app/components/TallyInsights/TallyInsightsNav";
import { getInsightsNavModel, getLessonsBySection, getSectionById, SECTIONS } from "@/lib/learn-tally-curriculum";
import { breadcrumbJsonLd, seoMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.id }));
}

export async function generateMetadata({
  params
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
  params
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const sec = getSectionById(section);
  if (!sec) return notFound();

  const lessons = getLessonsBySection(section);
  const nav = getInsightsNavModel();
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Tally Insights", path: "/tally-insights" },
    { name: sec.title, path: `/tally-insights/${sec.id}` }
  ]);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4ED] border border-[#E5F4F4] mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#006569]">
              Tally Insights
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
            {sec.title}
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium max-w-3xl">
            {sec.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="lg:w-[240px] xl:w-[260px] 2xl:w-[280px] flex-shrink-0">
            <TallyInsightsNav nav={nav} activeSectionId={sec.id} />
          </aside>

          <section className="flex-1 min-w-0">
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/tally-insights/${sec.id}/${lesson.slug}`}
                  className="group border border-slate-200 rounded-lg p-5 sm:p-6 bg-white shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight group-hover:text-[#006569] transition-colors">
                        {lesson.title}
                      </h2>
                      <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
                        {lesson.intro}
                      </p>
                    </div>
                    <span className="mt-1 text-[#006569] opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/tally-insights"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest hover:border-[#006569] hover:text-[#006569] transition-colors duration-200"
              >
                Back to All Guides
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
