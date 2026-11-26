// CHANGE: 2026-11-24 — Full-content search over the whole Tally Insights curriculum.
// WHY: the docs sidebar only filtered guide TITLES, so a visitor looking for a specific
// shortcut, FAQ answer or menu path had to open every guide and scroll. This index is built
// once from the same LESSONS array that renders the pages, so a search can never point at a
// guide that does not exist. Server-only: the full bodies never reach the browser.
// NOTE: no DB, no LLM and no client import — the API route owns this module.

import { LESSONS, SECTIONS, type Lesson } from "./learn-tally-curriculum";
import { parseMarkdownBlocks } from "./markdown-blocks";

export type InsightsSearchResult = {
  title: string;
  sectionTitle: string;
  href: string;
  snippet: string;
  match: string;
  score: number;
};

type Passage = {
  /** Display text for the snippet. */
  text: string;
  /** Short label shown on a result ("Shortcut", "FAQ", ...). Also searched. */
  label: string;
  /** Ranking weight for this kind of content. */
  weight: number;
};

// CHANGE: 2026-11-26 — passages can carry the anchor rendered on the lesson page, so a
// result lands on the exact shortcut row / FAQ / heading instead of the top of the guide.
type AnchoredPassage = Passage & { anchor?: string };

type IndexEntry = {
  title: string;
  sectionTitle: string;
  baseHref: string;
  passages: AnchoredPassage[];
};

export type InsightsScope = { sectionId: string; lessonSlug?: string };

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are", "was",
  "with", "how", "what", "where", "do", "does", "can", "i", "my", "it", "from", "at",
]);

/** Turn one line of lesson markdown into readable plain text for a snippet. */
function cleanLine(raw: string): string {
  return raw
    .replace(/^\s*#{1,6}\s*/, "")
    .replace(/^\s*[-*+]\s+/, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\|/g, " · ")
    .replace(/\s+/g, " ")
    .trim();
}

function isSeparatorRow(raw: string): boolean {
  const cells = raw.trim().replace(/^\||\|$/g, "").split("|");
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c.trim()));
}

function bodyPassages(md: string): Passage[] {
  const out: Passage[] = [];
  for (const raw of (md || "").split("\n")) {
    const line = raw.trim();
    if (!line || isSeparatorRow(line)) continue;
    const text = cleanLine(line);
    if (text.length < 4) continue;
    const isHeading = /^#{1,6}\s/.test(line);
    out.push({
      text,
      label: isHeading ? "In this guide" : "Guide text",
      weight: isHeading ? 5 : 3,
    });
  }
  return out;
}

function lessonPassages(lesson: Lesson, sectionDescription: string): Passage[] {
  const passages: Passage[] = [
    { text: lesson.title, label: "Guide", weight: 12 },
    { text: lesson.intro, label: "Overview", weight: 5 },
    { text: (lesson.keywords || []).join(", "), label: "Keywords", weight: 7 },
  ];

  if (lesson.quickAnswer || lesson.seoDescription) {
    passages.push({
      text: lesson.quickAnswer || lesson.seoDescription || "",
      label: "Quick answer",
      weight: 4,
    });
  }
  if (sectionDescription) {
    passages.push({ text: sectionDescription, label: "Section", weight: 2 });
  }

  (lesson.definitions || []).forEach((d) => {
    passages.push({
      text: `${d.term}. ${d.definition}${d.example ? ` Example: ${d.example}` : ""}`,
      label: "Key term",
      weight: 5,
    });
  });

  (lesson.examples || []).forEach((ex) => {
    passages.push({
      text: `${ex.title}. ${ex.steps.join(". ")}${ex.notes?.length ? `. ${ex.notes.join(". ")}` : ""}`,
      label: "Worked example",
      weight: 4,
    });
  });

  // CHANGE: 2026-11-24 — every shortcut row becomes its own passage, so a query like
  // "ctrl shift end" or "narration shortcut" surfaces the exact row as the snippet.
  (lesson.shortcuts || []).forEach((sc) => {
    passages.push({
      text: `${sc.keys}. ${sc.action}${sc.notes ? `. ${sc.notes}` : ""}`,
      label: "Shortcut",
      weight: 9,
    });
  });

  (lesson.faqs || []).forEach((f) => {
    passages.push({ text: `${f.q} ${f.a}`, label: "FAQ", weight: 4 });
  });

  passages.push(...bodyPassages(lesson.bodyMd));
  return passages.filter((p) => p.text.length > 0);
}

const INDEX: IndexEntry[] = LESSONS.map((lesson) => {
  const section = SECTIONS.find((s) => s.id === lesson.sectionId);
  return {
    title: lesson.title,
    sectionTitle: lesson.sectionTitle || section?.title || "Tally Insights",
    baseHref: `/tally-insights/${lesson.sectionId}/${lesson.slug}`,
    passages: lessonPassages(lesson, section?.description || ""),
  };
});

function tokenize(query: string): string[] {
  const parts = (query || "")
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter(Boolean);
  const kept = parts.filter((t) => !STOPWORDS.has(t));
  return kept.length ? kept : parts;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function boundaryMatcher(token: string): RegExp {
  // Word-boundary matching, never a bare substring: "how r u" must not score a guide
  // merely because it contains "r" inside a word. '+' and '#' are real shortcut keys.
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(token)}($|[^a-z0-9])`, "i");
}

function snippet(text: string, limit = 190): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit / 2 ? cut.slice(0, lastSpace) : cut).trimEnd()}...`;
}

/** Rank passages for one or more guides. Shared by global and scope-limited search. */
function scoreEntries(query: string, entries: IndexEntry[], limit: number): InsightsSearchResult[] {
  const cleaned = (query || "").trim();
  if (cleaned.length < 2) return [];

  const tokens = tokenize(cleaned).slice(0, 8);
  if (!tokens.length) return [];
  const matchers = tokens.map(boundaryMatcher);
  const phrase = cleaned.toLowerCase();
  const results: InsightsSearchResult[] = [];

  for (const entry of entries) {
    let best: { passage: AnchoredPassage; score: number; fullMatch: boolean } | null = null;
    let matchingPassages = 0;

    for (const passage of entry.passages) {
      const haystack = `${passage.label} ${passage.text}`.toLowerCase();
      let matched = 0;
      for (let i = 0; i < tokens.length; i += 1) {
        if (matchers[i].test(haystack)) matched += 1;
      }
      if (!matched) continue;
      matchingPassages += 1;

      let score = passage.weight * matched;
      if (matched === tokens.length) score += 6;
      if (tokens.length > 1 && haystack.includes(phrase)) score += passage.weight * 2;
      if (!best || score > best.score) {
        best = { passage, score, fullMatch: matched === tokens.length };
      }
    }

    if (!best) continue;
    // A single passage containing every term is the strongest possible answer, so it is
    // never filtered. Otherwise require a second supporting passage for longer queries:
    // one common word in a long body must not bury a guide that answers the whole query.
    if (tokens.length > 2 && matchingPassages < 2 && !best.fullMatch) continue;

    results.push({
      title: entry.title,
      sectionTitle: entry.sectionTitle,
      // CHANGE: 2026-11-26 — exact-match deep link when the matched passage has a rendered id.
      href: `${entry.baseHref}${best.passage.anchor ? `#${best.passage.anchor}` : ""}`,
      snippet: snippet(best.passage.text),
      match: best.passage.label,
      score: best.score + Math.min(matchingPassages, 5) * 0.5,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, Math.max(1, limit));
}

/** Search every guide title, intro, keyword, FAQ, definition, shortcut row and body line. */
export function searchInsights(query: string, limit = 8): InsightsSearchResult[] {
  return scoreEntries(query, INDEX, limit);
}

// CHANGE: 2026-11-26 — the in-guide search bar is local: on a lesson it searches only that
// guide; on a section index it searches only that section's guides. Global search stays in
// the navbar. Anchors mirror the ids rendered by MarkdownBody and the lesson page blocks.
function anchoredPassages(lesson: Lesson): AnchoredPassage[] {
  const out: AnchoredPassage[] = [
    { text: lesson.title, label: "Guide", weight: 12 },
    { text: lesson.intro, label: "Overview", weight: 5, anchor: "guide-intro" },
    { text: (lesson.keywords || []).join(", "), label: "Keywords", weight: 7 },
  ];

  if (lesson.quickAnswer || lesson.seoDescription) {
    out.push({
      text: lesson.quickAnswer || lesson.seoDescription || "",
      label: "Quick answer",
      weight: 6,
      anchor: "quick-answer",
    });
  }

  (lesson.definitions || []).forEach((d, i) => {
    out.push({
      text: `${d.term}. ${d.definition}${d.example ? ` Example: ${d.example}` : ""}`,
      label: "Key term",
      weight: 5,
      anchor: `term-${i + 1}`,
    });
  });

  (lesson.examples || []).forEach((ex, i) => {
    out.push({
      text: `${ex.title}. ${ex.steps.join(". ")}${ex.notes?.length ? `. ${ex.notes.join(". ")}` : ""}`,
      label: "Worked example",
      weight: 4,
      anchor: `example-${i + 1}`,
    });
  });

  // Highest weight of all: a "print" query must surface the print shortcut row itself.
  (lesson.shortcuts || []).forEach((sc, i) => {
    out.push({
      text: `${sc.keys}. ${sc.action}${sc.notes ? `. ${sc.notes}` : ""}`,
      label: "Shortcut",
      weight: 11,
      anchor: `shortcut-${i + 1}`,
    });
  });

  (lesson.faqs || []).forEach((f, i) => {
    out.push({ text: `${f.q} ${f.a}`, label: "FAQ", weight: 4, anchor: `faq-${i + 1}` });
  });

  parseMarkdownBlocks(lesson.bodyMd || "").forEach((block, index) => {
    const text =
      block.type === "list"
        ? block.items.join(". ")
        : block.type === "table"
          ? `${block.headers.join(". ")}. ${block.rows.map((row) => row.join(". ")).join(". ")}`
          : block.text;
    out.push({
      text,
      label: block.type === "heading" ? "In this guide" : "Guide text",
      weight: block.type === "heading" ? 6 : 3,
      anchor: `body-${index}`,
    });
  });

  return out.filter((p) => p.text.length > 0);
}

export function searchInsightsScoped(
  query: string,
  scope: InsightsScope,
  limit = 8,
): InsightsSearchResult[] {
  const section = SECTIONS.find((s) => s.id === scope.sectionId);
  const lessons = LESSONS.filter(
    (l) => l.sectionId === scope.sectionId && (!scope.lessonSlug || l.slug === scope.lessonSlug),
  );
  const entries: IndexEntry[] = lessons.map((lesson) => ({
    title: lesson.title,
    sectionTitle: lesson.sectionTitle || section?.title || "Tally Insights",
    baseHref: `/tally-insights/${lesson.sectionId}/${lesson.slug}`,
    passages: anchoredPassages(lesson),
  }));
  return scoreEntries(query, entries, limit);
}
