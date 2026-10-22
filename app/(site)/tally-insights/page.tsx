'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import MarkdownBody from "@/app/components/TallyInsights/MarkdownBody";
import { SECTIONS, LESSONS, getLessonsBySection, type Lesson } from "@/lib/learn-tally-curriculum";

// CHANGE: 2026-10-22 — length of the fade-out before the next lesson is swapped in.
// It must match the `.insights-content-out` keyframe in app/globals.css, otherwise the
// panel would snap back to visible for a frame between the exit and the swap.
const CONTENT_EXIT_MS = 170;

export default function TallyInsightsPage() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0]?.id || "");
  // CHANGE: 2026-10-22 — `openSection` is now SEPARATE from `activeSection`. Before, a
  // section was both "the section being shown" and "the section being expanded", so the
  // sub-list could only ever open (never close) and the collapse was an instant cut.
  const [openSection, setOpenSection] = useState<string | null>(SECTIONS[0]?.id || null);
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
      // CHANGE: 2026-10-22 — the old version called setActiveSection() from inside this
      // useMemo (a state update during render of another component's memo). The flat
      // search result list does not need an active section, so the call was dropped.
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

  // CHANGE: 2026-10-22 — content entry/exit. `displayLesson` is what is actually painted;
  // `activeLesson` is the target. On a change the current lesson fades out, then the new
  // one is swapped in and fades up (the `key` on the article replays the entry animation).
  const [displayLesson, setDisplayLesson] = useState<Lesson | null>(activeLesson);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (activeLesson?.slug === displayLesson?.slug) return;
    setIsLeaving(true);
    const timer = window.setTimeout(() => {
      setDisplayLesson(activeLesson);
      setIsLeaving(false);
    }, CONTENT_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [activeLesson, displayLesson]);

  const lessonsBySection = useMemo(() => {
    const map = new Map<string, typeof LESSONS>();
    SECTIONS.forEach((s) => map.set(s.id, getLessonsBySection(s.id)));
    return map;
  }, []);

  const resultCount = query.trim() ? filtered.length : LESSONS.length;

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

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="lg:w-[240px] xl:w-[260px] 2xl:w-[280px] flex-shrink-0">
            <div className="lg:sticky lg:top-20 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-[#F5F4ED]/30">
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
              <div className="px-3 py-2 border-b border-slate-100 bg-white flex items-center justify-between gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {query.trim() ? "Search results" : "All sections"}
                </span>
                <span className="text-[9px] font-bold text-slate-400 tabular-nums">
                  {resultCount} guide{resultCount === 1 ? "" : "s"}
                </span>
              </div>
              <div className="text-[11px] leading-tight">
                {query.trim() ? (
                  <div className="py-1">
                    {lessonsForActive.length === 0 ? (
                      <div className="px-3 py-4 text-[10px] text-slate-500">
                        No guides match "{query.trim()}".
                      </div>
                    ) : (
                      lessonsForActive.map((lesson) => (
                        <button
                          key={lesson.slug}
                          onClick={() => {
                            setActiveLessonSlug(lesson.slug);
                            setActiveSection(lesson.sectionId);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 ease-out ${
                            activeLesson?.slug === lesson.slug
                              ? "bg-[#e7f3f3] text-[#006569] font-medium shadow-sm"
                              : "text-slate-700 hover:bg-[#e7f3f3] hover:translate-x-0.5"
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
                    const isOpen = openSection === section.id;
                    const isActive = activeSection === section.id;
                    return (
                      <div key={section.id} className="border-b border-slate-100 last:border-b-0">
                        <button
                          onClick={() => {
                            const wasOpen = openSection === section.id;
                            // Toggle: clicking an open section closes it (smoothly), and
                            // clicking a closed one opens it and shows its first lesson.
                            setOpenSection(wasOpen ? null : section.id);
                            if (!wasOpen) {
                              setActiveSection(section.id);
                              setActiveLessonSlug(sectionLessons[0]?.slug || null);
                            }
                          }}
                          aria-expanded={isOpen}
                          className={`w-full text-left px-3 py-2 font-semibold flex items-start gap-1.5 transition-colors duration-200 ${
                            isActive ? "text-slate-900 bg-slate-50" : "text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          <svg
                            className={`w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-[#006569] transition-transform duration-300 ease-out ${
                              isOpen ? "rotate-90" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                          </svg>
                          <span className="leading-snug flex-1">{section.title}</span>
                          <span className="mt-px text-[9px] font-bold text-slate-300 tabular-nums">
                            {sectionLessons.length}
                          </span>
                        </button>
                        {/* CHANGE: 2026-10-22 — smooth open/close.
                            WHY: the sub-list used to be conditionally rendered, so it popped
                            in and vanished instantly (the owner: "sidebar opening and closing
                            animation doesn't feel smooth"). Animating grid-template-rows from
                            0fr to 1fr gives a real height transition in BOTH directions, and
                            the inner opacity fades the text in slightly after the panel has
                            started to open. `inert` on the collapsed panel keeps the hidden
                            lesson buttons out of the tab order. */}
                        <div
                          className={`insights-sidebar-section grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div
                              inert={isOpen ? undefined : true}
                              className={`pb-1 transition-opacity duration-200 ease-out ${
                                isOpen ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              {sectionLessons.map((lesson) => (
                                <button
                                  key={lesson.slug}
                                  onClick={() => setActiveLessonSlug(lesson.slug)}
                                  className={`w-full text-left pl-6 pr-3 py-1.5 rounded-md transition-all duration-200 ease-out ${
                                    activeLesson?.slug === lesson.slug
                                      ? "bg-[#e7f3f3] text-[#006569] font-medium"
                                      : "text-slate-600 hover:bg-[#e7f3f3] hover:translate-x-0.5"
                                  }`}
                                >
                                  <div className="leading-snug">{lesson.title}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <section className="flex-1 min-w-0">
            {displayLesson ? (
              <article
                key={displayLesson.slug}
                className={`border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white transition-shadow duration-300 hover:shadow-lg hover:-translate-y-[2px] ${
                  isLeaving ? "insights-content-out" : "insights-content-in"
                }`}
              >
                <div className="p-5 sm:p-7 md:p-10 border-b border-slate-100 bg-gradient-to-b from-[#F5F4ED]/40 to-white">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white border border-[#E5F4F4] mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#006569]">
                      {displayLesson.sectionTitle}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                    {displayLesson.title}
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                    {displayLesson.intro}
                  </p>
                </div>
                <div className="p-5 sm:p-7 md:p-10">
                  {/* CHANGE: 2026-10-22 — the body is rendered by the shared MarkdownBody
                      component (same one the server lesson page uses), so markdown tables in
                      a guide show as real tables here too instead of raw `| ... |` pipes. */}
                  <MarkdownBody md={displayLesson.bodyMd} />

                  {displayLesson.faqs && displayLesson.faqs.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">FAQs</h3>
                      <div className="grid gap-4">
                        {displayLesson.faqs.map((f, i) => (
                          <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40">
                            <h4 className="font-bold text-slate-900">{f.q}</h4>
                            <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">{f.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-12 grid md:grid-cols-2 gap-4">
                    {displayLesson.modulePromo && (
                      <div className="bg-[#006569] rounded-2xl p-6 text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        <div className="relative z-10">
                          <span className="px-2.5 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {displayLesson.modulePromo.badge || "Sales Focus"}
                          </span>
                          <h4 className="text-lg font-bold mt-4 mb-2">{displayLesson.modulePromo.title}</h4>
                          <p className="text-sm text-white/90 mb-5">{displayLesson.modulePromo.body}</p>
                          {displayLesson.modulePromo.productUrl && (
                            <Link
                              href={displayLesson.modulePromo.productUrl}
                              className="inline-flex items-center justify-center bg-white text-[#006569] px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#E5F4F4] transition-colors duration-200"
                            >
                              {displayLesson.modulePromo.productUrl.includes("/contact") ? "Contact Us" : "Learn More"}
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
                          className="inline-flex items-center justify-center bg-[#006569] text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#045A57] transition-colors duration-200"
                        >
                          Get Quote
                        </Link>
                        <Link
                          href="/modules"
                          className="inline-flex items-center justify-center border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-[#006569] hover:text-[#006569] transition-colors duration-200"
                        >
                          View Modules
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href="/tally-insights"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest hover:border-[#006569] hover:text-[#006569] transition-colors duration-200"
                    >
                      Back to All Guides
                    </Link>
                    <Link
                      href="/learn-sara"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#006569] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#045A57] transition-colors duration-200"
                    >
                      Ask Sara for Advice
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div className="insights-content-in border border-slate-200 rounded-2xl p-10 text-center">
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
