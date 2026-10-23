// CHANGE: 2026-10-23 - Shared client nav for Tally Insights (minimal bundle).
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type NavModel = Array<{
  id: string;
  title: string;
  lessons: Array<{ slug: string; title: string }>;
}>;

type Props = {
  nav: NavModel;
  activeSectionId?: string | null;
  activeLessonSlug?: string | null;
};

export default function TallyInsightsNav({
  nav,
  activeSectionId = null,
  activeLessonSlug = null,
}: Props) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(activeSectionId || nav[0]?.id || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // CHANGE: 2026-10-23 - `null` until the media query has actually been measured.
  // WHY: initialising to false marked the panel `inert` in the prerendered HTML, so on a
  // DESKTOP with JS disabled (or before hydration) the whole lesson list was unclickable
  // even though it is permanently visible at lg+. We only assert `inert` once we KNOW the
  // viewport is below lg AND the panel is collapsed - the genuinely hidden case.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (activeSectionId) {
      setOpenSection(activeSectionId);
    }
  }, [activeSectionId]);

  const sidebarHidden = isDesktop === false && !sidebarOpen;

  const searchItems = useMemo(() => {
    const items: Array<{ slug: string; sectionId: string; sectionTitle: string; title: string; href: string }> = [];
    nav.forEach((s) => {
      s.lessons.forEach((l) => {
        items.push({
          slug: l.slug,
          sectionId: s.id,
          sectionTitle: s.title,
          title: l.title,
          href: `/tally-insights/${s.id}/${l.slug}`
        });
      });
    });
    return items;
  }, [nav]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return searchItems.filter((i) => i.title.toLowerCase().includes(q) || i.sectionTitle.toLowerCase().includes(q));
  }, [query, searchItems]);

  const resultCount = query.trim() ? filtered.length : searchItems.length;

  return (
    <div className="lg:sticky lg:top-20 lg:flex lg:flex-col lg:max-h-[calc(100vh-6rem)] border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-[#F5F4ED]/30 lg:shrink-0">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSidebarOpen(true);
            }}
            placeholder="Search guides..."
            className="w-full pl-7 pr-2 py-1.5 rounded-md border border-slate-300 text-[11px] focus:outline-none focus:border-[#006569] focus:ring-1 focus:ring-[#006569]/20 transition-all duration-200"
          />
          <svg className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        </div>
      </div>
      <div className="px-3 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-expanded={sidebarOpen}
          aria-controls="tally-insights-sidebar-list"
          className="insights-sidebar-toggle w-full justify-between"
        >
          <span>{query.trim() ? "Search results" : "All sections"}</span>
          <span className="flex items-center gap-2">
            <span className="tabular-nums">{resultCount} guide{resultCount === 1 ? "" : "s"}</span>
            <svg className={`w-3 h-3 transition-transform duration-300 ease-out ${sidebarOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
      </div>
      <div className="hidden lg:flex px-3 py-2 border-b border-slate-100 bg-white items-center justify-between gap-2 lg:shrink-0">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{query.trim() ? "Search results" : "All sections"}</span>
        <span className="text-[9px] font-bold text-slate-400 tabular-nums">{resultCount} guide{resultCount === 1 ? "" : "s"}</span>
      </div>
      {/* CHANGE: 2026-10-23 - on lg+ the list is its own scroll container, so it scrolls
          under the wheel while the page stays put. WHY: previously the sidebar was only
          `sticky`, so you had to scroll the whole article to its bottom before the sidebar
          list could be read/scrolled. flex-auto (not flex-1) keeps the panel at its natural
          height when the list is short — flex-basis:0 would collapse an auto-height column. */}
      <div id="tally-insights-sidebar-list" className={`insights-sidebar-panel insights-sidebar-scroll ${sidebarOpen ? "is-open" : ""}`}>
        <div className="insights-sidebar-panel-inner">
          <div className="text-[11px] leading-tight insights-sidebar-panel-body" inert={sidebarHidden ? true : undefined}>
            {query.trim() ? (
              <div className="py-1">
                {filtered.length === 0 ? (
                  <div className="px-3 py-4 text-[10px] text-slate-500">No guides match "{query.trim()}".</div>
                ) : (
                  filtered.map((i) => (
                    <Link
                      key={i.slug}
                      href={i.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ease-out ${pathname === i.href ? "bg-[#e7f3f3] text-[#006569] font-medium shadow-sm" : "text-slate-700 hover:bg-[#e7f3f3] hover:translate-x-0.5"}`}
                    >
                      <div className="truncate">{i.title}</div>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              nav.map((section) => {
                const isOpen = openSection === section.id;
                const isActive = activeSectionId === section.id;
                return (
                  <div key={section.id} className="border-b border-slate-100 last:border-b-0">
                    <div className="flex items-start">
                      <Link
                        href={`/tally-insights/${section.id}`}
                        className={`flex-1 text-left px-3 py-2 font-semibold flex items-start gap-1.5 transition-colors duration-200 ${isActive ? "text-slate-900 bg-slate-50" : "text-slate-800 hover:bg-slate-50"}`}
                      >
                        <span className="leading-snug flex-1">{section.title}</span>
                        <span className="mt-px text-[9px] font-bold text-slate-300 tabular-nums">{section.lessons.length}</span>
                      </Link>
                      <button
                        onClick={() => {
                          const wasOpen = openSection === section.id;
                          setOpenSection(wasOpen ? null : section.id);
                        }}
                        aria-expanded={isOpen}
                        className="px-2 py-2 text-slate-400 hover:text-[#006569] transition-colors"
                      >
                        <svg className={`w-2.5 h-2.5 transition-transform duration-300 ease-out ${isOpen ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                    <div className={`insights-sidebar-section grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <div inert={isOpen ? undefined : true} className={`pb-1 transition-opacity duration-200 ease-out ${isOpen ? "opacity-100" : "opacity-0"}`}>
                          {section.lessons.map((lesson) => {
                            const href = `/tally-insights/${section.id}/${lesson.slug}`;
                            const isLessonActive = activeLessonSlug === lesson.slug;
                            return (
                              <Link
                                key={lesson.slug}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={`w-full text-left pl-6 pr-3 py-1.5 rounded-md transition-all duration-200 ease-out block ${isLessonActive ? "bg-[#e7f3f3] text-[#006569] font-medium" : "text-slate-600 hover:bg-[#e7f3f3] hover:translate-x-0.5"}`}
                              >
                                <div className="leading-snug">{lesson.title}</div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
