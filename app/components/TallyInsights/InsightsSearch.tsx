// CHANGE: 2026-11-24 — Full-content search bar for the Tally Insights docs shell.
// WHY: the sidebar filter only matched guide titles. This bar queries every guide's text
// (shortcut rows, FAQs, key terms, worked examples and body copy) and suggests articles as
// the visitor types, so a specific detail can be found without scrolling through guides.
// Hydration-safe: no window/localStorage during render; the debounce lives in an effect.
'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

type Suggestion = {
  title: string;
  sectionTitle: string;
  href: string;
  snippet: string;
  match: string;
  score: number;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Bold the query terms inside a suggestion snippet without using dangerouslySetInnerHTML. */
function Highlight({ text, query }: { text: string; query: string }) {
  const terms = Array.from(
    new Set(
      (query || "")
        .toLowerCase()
        .split(/[^a-z0-9+#]+/)
        .filter((t) => t.length > 0),
    ),
  );
  if (!terms.length) return <>{text}</>;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return (
    <>
      {text.split(pattern).map((part, i) =>
        terms.includes(part.toLowerCase()) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

// CHANGE: 2026-11-26 — the search bar is now local to the current section or single guide.
// Global site search lives only in the navbar; this bar must never redirect to /search.
export default function InsightsSearch({
  scope,
}: {
  scope: { sectionId: string; lessonSlug?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sectionId = scope.sectionId;
  const lessonSlug = scope.lessonSlug;
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      setOpen(false);
      setExpanded(false);
      setActive(-1);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q, section: sectionId });
        if (lessonSlug) params.set("lesson", lessonSlug);
        const res = await fetch(`/api/insights/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data = (await res.json()) as { results?: Suggestion[] };
        if (cancelled) return;
        setResults(Array.isArray(data.results) ? data.results : []);
        setOpen(true);
        setActive(-1);
      } catch (err) {
        if (cancelled || (err instanceof DOMException && err.name === "AbortError")) return;
        console.error("Insights search error:", err);
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 140);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, sectionId, lessonSlug]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setExpanded(false);
    setActive(-1);
    setValue("");
    const [path, hash] = href.split("#");
    // Already on this guide: scroll straight to the matched shortcut / FAQ / heading.
    if (hash && path === pathname) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
      return;
    }
    router.push(href);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      setExpanded(false);
      setActive(-1);
      return;
    }
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
      return;
    }
    if (event.key === "Enter" && results.length && active >= 0) {
      event.preventDefault();
      go(results[active].href);
    }
  };

  const shown = expanded ? results : results.slice(0, 6);
  const hasQuery = value.trim().length >= 2;

  const renderSuggestion = (result: Suggestion, index: number) => (
    <li key={result.href} role="presentation" className="insights-search-item">
      <button
        type="button"
        id={`insights-search-option-${index}`}
        role="option"
        aria-selected={index === active}
        tabIndex={-1}
        className={`insights-search-option ${index === active ? "is-active" : ""}`}
        onMouseEnter={() => setActive(index)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => go(result.href)}
      >
        <span className="insights-search-option-top">
          <span className="insights-search-match">{result.match}</span>
          <span className="insights-search-section-label">{result.sectionTitle}</span>
        </span>
        <span className="insights-search-option-title">
          <Highlight text={result.title} query={value} />
        </span>
        <span className="insights-search-option-snippet">
          <Highlight text={result.snippet} query={value} />
        </span>
      </button>
    </li>
  );

  return (
    <div className="insights-search" ref={rootRef}>
      <form
        className="insights-search-form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (results.length) go(results[Math.max(active, 0)].href);
        }}
      >
        <svg
          className="insights-search-icon"
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
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setExpanded(false);
          }}
          onFocus={() => { if (results.length) setOpen(true); }}
          onKeyDown={onKeyDown}
          placeholder={lessonSlug ? "Search this guide: shortcuts, steps, FAQs..." : "Search guides in this section..."}
          aria-label={lessonSlug ? "Search this Tally Insights guide" : "Search guides in this section"}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={hasQuery && open}
          aria-controls={hasQuery && open && !expanded ? "insights-search-listbox" : undefined}
          aria-activedescendant={active >= 0 ? `insights-search-option-${active}` : undefined}
        />
        {value && (
          <button
            type="button"
            className="insights-search-clear"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              setOpen(false);
              setActive(-1);
              inputRef.current?.focus();
            }}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
        <button type="submit" className="insights-search-submit">
          Search
        </button>
      </form>

      <p className="sr-only" aria-live="polite">
        {loading ? "Searching" : hasQuery ? `${results.length} matches` : ""}
      </p>

      {hasQuery && open && (
        <div className="insights-search-popover">
          {expanded ? (
            <div className="insights-search-panel" aria-label="All matching guides">
              <div className="insights-search-panel-head">
                <strong>{results.length} matches for &ldquo;{value.trim()}&rdquo;</strong>
                <button type="button" onClick={() => setExpanded(false)}>
                  Show suggestions
                </button>
              </div>
              <ul className="insights-search-list" aria-label="Matching guides">
                {results.map(renderSuggestion)}
              </ul>
            </div>
          ) : (
            <div className="insights-search-dropdown">
              {results.length ? (
                <>
                  <ul
                    id="insights-search-listbox"
                    className="insights-search-list"
                    role="listbox"
                    aria-label="Suggested guides"
                  >
                    {shown.map(renderSuggestion)}
                  </ul>
                  <div className="insights-search-foot">
                    <span>{loading ? "Searching..." : `${results.length} matches`}</span>
                    {results.length > 6 && (
                      <button type="button" onClick={() => setExpanded(true)}>
                        View all {results.length}
                      </button>
                    )}
                  </div>
                </>
              ) : !loading ? (
                <div className="insights-search-empty">
                  <p>
                    No match in {lessonSlug ? "this guide" : "this section"} for
                    &ldquo;{value.trim()}&rdquo;.
                  </p>
                  <Link href="/ask-sara" onClick={() => setOpen(false)}>
                    Ask Sara instead &rarr;
                  </Link>
                </div>
              ) : (
                <div className="insights-search-empty">Searching guides...</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
