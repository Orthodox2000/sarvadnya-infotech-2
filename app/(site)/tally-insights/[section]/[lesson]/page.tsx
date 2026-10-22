import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "../../../../components/Footer";
import {
  getLessonBySlug,
  getLessonsBySection,
  getSectionById
} from "@/lib/learn-tally-curriculum";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";
import Script from "next/script";

export async function generateStaticParams() {
  const { LESSONS } = await import("@/lib/learn-tally-curriculum");
  return LESSONS.map((l) => ({
    section: l.sectionId,
    lesson: l.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ section: string; lesson: string }>;
}) {
  const { section, lesson } = await params;
  const { getLessonBySlug } = await import("@/lib/learn-tally-curriculum");
  const l = getLessonBySlug(lesson);
  if (!l) return {};
  const title = l.seoTitle || `${l.title} | Tally Insights`;
  const description = l.seoDescription || l.intro;
  const keywords = l.keywords || [
    "tally insights",
    "tally prime guide",
    "learn tally prime"
  ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://sarvadnyainfotech.com/tally-insights/${l.sectionId}/${l.slug}`
    }
  };
}

function LeadMagnetForm({ leadMagnet }: { leadMagnet: any }) {
  return (
    <div className="bg-[#F5F4ED]/40 rounded-3xl border border-[#E5F4F4] p-6 md:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-[#006569]/10 rounded-2xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[#006569]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
            {leadMagnet.title}
          </h3>
          <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
            {leadMagnet.description}
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-500 font-medium">
        Lead capture is minimal and business-focused. Fill details below to
        download the resource.
      </p>
    </div>
  );
}

function ModulePromoCard({ promo }: { promo: any }) {
  return (
    <div className="bg-[#006569] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur">
            {promo.badge || "Our Solution"}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-3">
          {promo.title}
        </h3>
        <p className="text-sm text-white/90 font-medium leading-relaxed mb-6">
          {promo.body}
        </p>
        {promo.productUrl && (
          <Link
            href={promo.productUrl}
            className="inline-flex items-center justify-center bg-white text-[#006569] px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.15em] hover:bg-[#E5F4F4] hover:scale-105 transition-all duration-200 transform active:scale-95 shadow-lg"
          >
            {promo.productUrl.includes('/contact') ? 'Contact Us' : 'Learn More'}
          </Link>
        )}
      </div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
    </div>
  );
}

export default async function LessonPage({
  params
}: {
  params: Promise<{ section: string; lesson: string }>;
}) {
  const { lesson: lessonSlug } = await params;
  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) return notFound();

  const section = getSectionById(lesson.sectionId);
  const lessonsInSection = getLessonsBySection(lesson.sectionId);
  const currentIndex = lessonsInSection.findIndex((l) => l.slug === lesson.slug);
  const prev = currentIndex > 0 ? lessonsInSection[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < lessonsInSection.length - 1
      ? lessonsInSection[currentIndex + 1]
      : null;

  const jsonLd: any[] = [];
  jsonLd.push(
    articleJsonLd({
      headline: lesson.seoTitle || lesson.title,
      description: lesson.seoDescription || lesson.intro,
      slug: `/tally-insights/${lesson.sectionId}/${lesson.slug}`,
      datePublished: "2026-10-19",
      dateModified: "2026-10-19",
      author: "Sarvadnya Infotech LLP"
    })
  );
  jsonLd.push(
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Tally Insights", path: "/tally-insights" },
      section
        ? { name: section.title, path: `/tally-insights#${section.id}` }
        : { name: lesson.sectionTitle, path: "/tally-insights" },
      { name: lesson.title, path: `/tally-insights/${lesson.sectionId}/${lesson.slug}` }
    ])
  );
  if (lesson.faqs && lesson.faqs.length > 0) {
    jsonLd.push(faqPageJsonLd(lesson.faqs));
  }

  return (
    <div className="min-h-screen bg-white">
      <Script
        id="tally-insights-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <nav className="mb-8 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-[#006569]">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/tally-insights" className="hover:text-[#006569]">
            Tally Insights
          </Link>{" "}
          / {lesson.sectionTitle} /{" "}
          <span className="text-slate-700">{lesson.title}</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4ED] border border-[#E5F4F4] mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#006569]">
              {lesson.sectionTitle}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {lesson.title}
          </h1>
          <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
            {lesson.intro}
          </p>
          {lesson.slug === 'tally-erp9-vs-tally-prime' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/erp9-vs-prime.svg"
                alt="Tally ERP 9 vs Tally Prime comparison"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'latest-version-of-tally-prime' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/latest-tally-prime.svg"
                alt="Latest version of Tally Prime"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'tally-prime-shortcuts-complete-list' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-shortcuts.svg"
                alt="Tally Prime shortcut keys complete list"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'how-to-create-company-in-tally' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-company.svg"
                alt="How to create company in Tally Prime step by step"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'masters-ledgers-groups' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-masters.svg"
                alt="Masters ledgers groups in Tally Prime"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'vouchers-types-contra' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-vouchers.svg"
                alt="Types of vouchers in Tally Prime"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'how-to-record-bank-reconciliation-in-tally' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-bank-reco.svg"
                alt="Bank reconciliation in Tally Prime"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'cost-centre-in-tally' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-cost-centre.svg"
                alt="Cost centre in Tally Prime"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'tally-inventory-bom-godowns' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-inventory.svg"
                alt="Tally Prime inventory BOM godowns"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'tally-payroll-hrms' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-payroll.svg"
                alt="Tally Prime payroll and HRMS"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'tally-reports-analysis' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-reports.svg"
                alt="Tally Prime reports analysis"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'tally-integration-excel-xml-odbc' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-integration.svg"
                alt="Tally integration Excel XML API ODBC"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'tally-career-prep' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-career.svg"
                alt="Tally career preparation interview MCQ"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          {lesson.slug === 'tss-licensing-upgrades-cloud' && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src="/images/insights/tally-tss-cloud.svg"
                alt="TSS licensing upgrades Tally Cloud"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
        </header>

        <article className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:font-medium prose-li:font-medium prose-a:text-[#006569] prose-table:w-full prose-table:overflow-x-auto prose-pre:rounded-xl">
          <div className="whitespace-pre-wrap leading-relaxed">{lesson.bodyMd}</div>

          {lesson.definitions && lesson.definitions.length > 0 && (
            <div className="not-prose mt-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                Key Terms
              </h2>
              <div className="grid gap-4">
                {lesson.definitions.map((d, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-slate-100 bg-white"
                  >
                    <h3 className="font-bold text-slate-900">{d.term}</h3>
                    <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
                      {d.definition}
                    </p>
                    {d.example && (
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Example: {d.example}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {lesson.examples && lesson.examples.length > 0 && (
            <div className="not-prose mt-10">
              <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight">
                Step-by-Step Examples
              </h2>
              <div className="grid gap-6">
                {lesson.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-3xl border border-slate-100 bg-white"
                  >
                    <h3 className="font-bold text-slate-900 mb-4">
                      {ex.title}
                    </h3>
                    <ol className="space-y-3 text-sm text-slate-700 font-medium list-decimal list-inside">
                      {ex.steps.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ol>
                    {ex.notes && ex.notes.length > 0 && (
                      <ul className="mt-4 space-y-2 text-xs text-slate-500 list-disc list-inside">
                        {ex.notes.map((n, idx) => (
                          <li key={idx}>{n}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {lesson.shortcuts && lesson.shortcuts.length > 0 && (
            <div className="not-prose mt-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                Quick Shortcut Reference
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-[#F5F4ED]/30">
                      <th className="text-left py-3 px-4 font-bold text-slate-700">
                        Keys
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-slate-700">
                        Action
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-slate-700">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lesson.shortcuts.map((sc, i) => (
                      <tr key={i} className="border-t border-slate-100 hover:bg-[#F5F4ED]/20 transition-colors duration-150">
                        <td className="py-2.5 px-4 font-mono text-[#006569] font-semibold whitespace-nowrap">
                          {sc.keys}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 font-medium">
                          {sc.action}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 font-medium">
                          {sc.notes || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {lesson.faqs && lesson.faqs.length > 0 && (
            <div className="not-prose mt-12">
              <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight">
                FAQs
              </h2>
              <div className="grid gap-4">
                {lesson.faqs.map((f, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-slate-100 bg-white"
                  >
                    <h3 className="font-bold text-slate-900">{f.q}</h3>
                    <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="not-prose mt-12 space-y-6">
            {lesson.leadMagnet && <LeadMagnetForm leadMagnet={lesson.leadMagnet} />}
            {lesson.modulePromo && <ModulePromoCard promo={lesson.modulePromo} />}
          </div>
        </article>

        <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
          {prev ? (
            <Link
              href={`/tally-insights/${prev.sectionId}/${prev.slug}`}
              className="flex-1 p-4 rounded-2xl border border-slate-100 hover:border-[#006569]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Previous
              </p>
              <p className="font-bold text-slate-900 group-hover:text-[#006569]">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/tally-insights/${next.sectionId}/${next.slug}`}
              className="flex-1 p-4 rounded-2xl border border-slate-100 hover:border-[#006569]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-right"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Next
              </p>
              <p className="font-bold text-slate-900 group-hover:text-[#006569]">
                {next.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/tally-insights"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-[0.15em] hover:border-[#006569] hover:text-[#006569] hover:shadow-md transition-all duration-200"
          >
            Back to Tally Insights
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
