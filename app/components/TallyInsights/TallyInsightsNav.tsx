// CHANGE: 2026-10-23 — Shared client nav for Tally Insights (minimal bundle).
// CHANGE: 2026-11-24 — Rebuilt for the W3-style docs shell: compact sidebar, selected
// section/lesson, collapsible sections with one-line descriptions and an in-panel collapse
// toggle. The full curriculum body still never reaches the browser.
// CHANGE: 2026-11-24 (layout fix) — the sidebar used to be a fixed off-canvas drawer with a
// backdrop, i.e. it hovered over the content. It is now one in-flow flex item beside the
// content; the toggle expands/collapses it in place. No overlay, no overlap.
// CHANGE: 2026-11-24 (hydration fix) — this is ALWAYS the same single <aside> tree. No
// viewport/typeof-window branch may swap it for a mobile <button>: that element-shape mismatch
// is what produced "server rendered <aside> / client rendered <button>" and a regenerated tree.
// The viewport is read in an effect only, and CSS (not JS) owns the initial expanded state.
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type NavModel = Array<{
  id: string;
  title: string;
  description?: string;
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
  // `null` = let CSS own the default (expanded at lg+, collapsed below it). Only a real click
  // writes an override, so the prerendered HTML and the first client render are identical.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);

  // The shell owns the nav, so derive the selected items from the route. Explicit props are
  // still accepted for any future embed, but /tally-insights/** is fully handled here.
  // IMPORTANT: route values are never used to INITIALISE state — that would make SSG and
  // hydration disagree. They are applied in the effect below, after hydration.
  const pathParts = pathname.split("/").filter(Boolean);
  const pathSection = pathParts[0] === "tally-insights" ? pathParts[1] || null : null;
  const pathLesson = pathParts[0] === "tally-insights" ? pathParts[2] || null : null;
  const currentSectionId = activeSectionId || pathSection;
  const currentLessonSlug = activeLessonSlug || pathLesson;

  const [openSection, setOpenSection] = useState<string | null>(
    activeSectionId || nav[0]?.id || null,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setIsDesktop(mq.matches);
      setManualExpanded(null);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (currentSectionId) setOpenSection(currentSectionId);
  }, [currentSectionId]);

  useEffect(() => {
    setManualExpanded(null);
  }, [pathname]);

  // `null` adds no modifier class: CSS keeps the panel expanded at lg+ and collapsed below it,
  // with no JS-driven first-paint change. The viewport is read only in the effect above, so the
  // first client render matches the server HTML exactly. A click adds is-open/is-collapsed.
  const visuallyOpen = manualExpanded ?? isDesktop ?? true;
  const sidebarClass = [
    "w3-sidebar",
    "w3-collapse",
    manualExpanded === true ? "is-open" : "",
    manualExpanded === false ? "is-collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const searchItems = useMemo(() => {
    const items: Array<{
      slug: string;
      sectionId: string;
      sectionTitle: string;
      title: string;
      href: string;
    }> = [];
    nav.forEach((s) => {
      s.lessons.forEach((l) => {
        items.push({
          slug: l.slug,
          sectionId: s.id,
          sectionTitle: s.title,
          title: l.title,
          href: `/tally-insights/${s.id}/${l.slug}`,
        });
      });
    });
    return items;
  }, [nav]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return searchItems.filter(
      (i) => i.title.toLowerCase().includes(q) || i.sectionTitle.toLowerCase().includes(q),
    );
  }, [query, searchItems]);

  const resultCount = query.trim() ? filtered.length : searchItems.length;

  // One in-flow flex item: the toggle lives inside the sidebar, so the flex container has only
  // two children (sidebar + main). Expanding/collapsing never overlays the article.
  return (
    <aside
      id="tally-insights-sidebar"
      className={sidebarClass}
      aria-label="Tally Insights guide navigation"
    >
      <div className="leftmenuinner">
        <div className="docs-sidebar-head">
          <button
            type="button"
            className="docs-sidebar-toggle"
            aria-controls="tally-insights-nav-list"
            aria-expanded={visuallyOpen}
            aria-label={visuallyOpen ? "Collapse guide navigation" : "Expand guide navigation"}
            onClick={() => setManualExpanded(!visuallyOpen)}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="docs-sidebar-toggle-label">Guides</span>
            <span className="docs-toggle-count">{resultCount}</span>
          </button>
          <div className="docs-sidebar-title">Tally Insights</div>
          <div className="docs-sidebar-subtitle">
            {query.trim() ? "Search results" : `${resultCount} guides`}
          </div>
          <label className="docs-search">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides..."
              aria-label="Search Tally Insights guides"
            />
          </label>
        </div>

        <div id="tally-insights-nav-list" className="docs-sidebar-scroll insights-sidebar-scroll">
          {query.trim() ? (
            <div className="docs-nav-results">
              {filtered.length === 0 ? (
                <div className="docs-nav-empty">No guides match &ldquo;{query.trim()}&rdquo;.</div>
              ) : (
                filtered.map((i) => (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={`docs-nav-result ${pathname === i.href ? "is-active" : ""}`}
                    aria-current={pathname === i.href ? "page" : undefined}
                  >
                    <span className="docs-nav-result-title">{i.title}</span>
                    <span className="docs-nav-result-section">{i.sectionTitle}</span>
                  </Link>
                ))
              )}
            </div>
          ) : (
            nav.map((section) => {
              const sectionOpen = openSection === section.id;
              const isActive = currentSectionId === section.id;
              return (
                <div
                  key={section.id}
                  className={`docs-nav-section ${sectionOpen ? "is-open" : ""} ${isActive ? "is-active" : ""}`}
                >
                  <div className="docs-nav-section-row">
                    <Link
                      href={`/tally-insights/${section.id}`}
                      className="docs-nav-section-link"
                      aria-current={isActive && !currentLessonSlug ? "page" : undefined}
                    >
                      <span className="docs-nav-section-title">
                        {section.title}
                        <span className="docs-nav-section-count">{section.lessons.length}</span>
                      </span>
                      {section.description && (
                        <span className="docs-nav-section-desc">{section.description}</span>
                      )}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setOpenSection(sectionOpen ? null : section.id)}
                      aria-expanded={sectionOpen}
                      aria-label={`${sectionOpen ? "Collapse" : "Expand"} ${section.title}`}
                      className="docs-nav-toggle"
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                  {sectionOpen && (
                    <div className="docs-nav-lessons">
                      {section.lessons.map((lesson) => {
                        const href = `/tally-insights/${section.id}/${lesson.slug}`;
                        const isLessonActive = currentLessonSlug === lesson.slug;
                        return (
                          <Link
                            key={lesson.slug}
                            href={href}
                            className={`docs-nav-lesson ${isLessonActive ? "is-active" : ""}`}
                            aria-current={isLessonActive ? "page" : undefined}
                          >
                            {lesson.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
