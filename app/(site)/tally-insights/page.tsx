'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import { SECTIONS, LESSONS, getLessonsBySection } from "@/lib/learn-tally-curriculum";

export default function TallyInsightsPage() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0]?.id || "");
  const [activeLessonSlug, setActiveLessonSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return LESSONS;
    return LESSONS.filter((l) => {
      const haystack = [
        l.title,
        l.intro,
        l.bodyMd,
        l.keywords?.join(" "),
        l.sectionTitle
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const lessonsForActive = useMemo(() => {
    if (query.trim()) {
      const sectionSet = new Set(filtered.map((l) => l.sectionId));
      if (sectionSet.size === 1) {
        const onlySection = Array.from(sectionSet)[0];
        setActiveSection(onlySection);
      }
      return filtered;
    }
    return getLessonsBySection(activeSection);
  }, [query, activeSection, filtered]);

  const activeLesson = useMemo(() => {
    if (activeLessonSlug) {
      return LESSONS.find((l) => l.slug === activeLessonSlug) || null;
    }
    return lessonsForActive[0] || null;
  }, [activeLessonSlug, lessonsForActive]);

  const lessonsBySection = useMemo(() => {
    const map = new Map<string, typeof LESSONS>();
    SECTIONS.forEach((s) => map.set(s.id, getLessonsBySection(s.id)));
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F4ED] border border-[#E5F4F4] mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#006569]">
              Tally Insights
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Tally Prime & ERP 9 <span className="text-[#006569]">Knowledge Hub</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium max-w-3xl">
            Practical, business-focused guides to help you sell, implement and scale Tally solutions.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-[240px] xl:w-[260px] 2xl:w-[280px] flex-shrink-0">
            <div className="lg:sticky lg:top-20 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-2.5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-[#F5F4ED]/30">
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveLessonSlug(null);
                    }}
                    placeholder="Search guides..."
                    className="w-full pl-7 pr-2 py-1.5 rounded-md border border-slate-300 text-[11px] focus:outline-none focus:border-[#006569] focus:ring-1 focus:ring-[#006569]/20 transition-all duration-200"
                  />
                  <svg
                    className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3-3" />
                  </svg>
                </div>
              </div>
              <div className="text-[11px] leading-tight">
                {query.trim() ? (
                  <div className="py-0.5">
                    {lessonsForActive.length === 0 ? (
                      <div className="px-2.5 py-3 text-[10px] text-slate-500">No results</div>
                    ) : (
                      lessonsForActive.map((lesson) => (
                        <button
                          key={lesson.slug}
                          onClick={() => {
                            setActiveLessonSlug(lesson.slug);
                            setActiveSection(lesson.sectionId);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 hover:bg-[#e7f3f3] rounded-md transition-all duration-150 ${
                            activeLesson?.slug === lesson.slug
                              ? "bg-[#e7f3f3] text-[#006569] font-medium shadow-sm"
                              : "text-slate-700 hover:translate-x-0.5"
                          }`}
                        >
                          <div className="truncate">{lesson.title}</div>
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  SECTIONS.map((section) => {
                    const sectionLessons = lessonsBySection.get(section.id) || [];
                    return (
                      <div key={section.id} className="border-b border-slate-100 last:border-b-0">
                        <button
                          onClick={() => {
                            setActiveSection(section.id);
                            setActiveLessonSlug(sectionLessons[0]?.slug || null);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 font-semibold flex items-start gap-1 ${
                            activeSection === section.id ? "text-slate-900 bg-slate-50" : "text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          <svg
                            className={`w-2.5 h-2.5 mt-0.5 flex-shrink-0 transition-transform ${activeSection === section.id ? "rotate-90" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                          </svg>
                          <span className="leading-snug">{section.title}</span>
                        </button>
                        {activeSection === section.id && (
                          <div className="pb-0.5">
                            {sectionLessons.map((lesson) => (
                              <button
                                key={lesson.slug}
                                onClick={() => setActiveLessonSlug(lesson.slug)}
                                className={`w-full text-left pl-5 pr-2.5 py-1 hover:bg-[#e7f3f3] ${
                                  activeLesson?.slug === lesson.slug
                                    ? "bg-[#e7f3f3] text-[#006569] font-medium"
                                    : "text-slate-600"
                                }`}
                              >
                                <div className="leading-snug">{lesson.title}</div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <section className="flex-1 min-w-0">
            {activeLesson ? (
              <article className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]">
                <div className="p-4 sm:p-5 md:p-8 border-b border-slate-100 bg-gradient-to-b from-[#F5F4ED]/40 to-white">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white border border-[#E5F4F4] mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#006569]">
                      {activeLesson.sectionTitle}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                    {activeLesson.title}
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                    {activeLesson.intro}
                  </p>
                </div>
                <div className="p-4 sm:p-5 md:p-8">
                  <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:font-medium prose-li:font-medium prose-a:text-[#006569] prose-p:leading-relaxed prose-table:w-full prose-table:border-collapse prose-th:bg-slate-50 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-[10px] prose-th:uppercase prose-th:tracking-wider prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-slate-200 prose-td:text-sm">
                    <div className="whitespace-pre-wrap leading-relaxed">{activeLesson.bodyMd}</div>
                  </div>

                  {activeLesson.faqs && activeLesson.faqs.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">FAQs</h3>
                      <div className="grid gap-4">
                        {activeLesson.faqs.map((f, i) => (
                          <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40">
                            <h4 className="font-bold text-slate-900">{f.q}</h4>
                            <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">{f.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-12 grid md:grid-cols-2 gap-4">
                    {activeLesson.modulePromo && (
                      <div className="bg-[#006569] rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        <div className="relative z-10">
                          <span className="px-2.5 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {activeLesson.modulePromo.badge || "Sales Focus"}
                          </span>
                          <h4 className="text-lg font-bold mt-4 mb-2">{activeLesson.modulePromo.title}</h4>
                          <p className="text-sm text-white/90 mb-5">{activeLesson.modulePromo.body}</p>
                          {activeLesson.modulePromo.productUrl && (
                            <Link
                              href={activeLesson.modulePromo.productUrl}
                              className="inline-flex items-center justify-center bg-white text-[#006569] px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                            >
                              Learn More
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                      <span className="px-2.5 py-1 bg-[#F5F4ED] text-[#006569] rounded-full text-[9px] font-black uppercase tracking-widest">
                        Talk to Sales
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-4 mb-2">Need help implementing this?</h4>
                      <p className="text-sm text-slate-600 mb-5">
                        Get expert guidance from Sarvadnya Infotech - Tally Certified Partner. Book a quick consultation.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href="/contact?service=Tally%20Implementation"
                          className="inline-flex items-center justify-center bg-[#006569] text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                        >
                          Get Quote
                        </Link>
                        <Link
                          href="/modules"
                          className="inline-flex items-center justify-center border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                        >
                          View Modules
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href="/tally-insights"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest"
                    >
                      Back to All Guides
                    </Link>
                    <Link
                      href="/learn-sara"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#006569] text-white text-[10px] font-black uppercase tracking-widest"
                    >
                      Ask Sara for Advice
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div className="border border-slate-200 rounded-2xl p-10 text-center">
                <p className="text-slate-500">Select a guide from the sidebar to view content.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
