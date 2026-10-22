// CHANGE: 2026-10-22 — shared markdown block parser for the Tally Insights lesson bodies.
// WHY: the lesson markdown was being rendered two different ways. The server lesson page
// printed table rows as raw `| ... |` text and then appended the parsed tables at the very
// BOTTOM of the article (out of order), while the client hub rendered the entire body as one
// raw `whitespace-pre-wrap` blob, so a markdown table showed up as literal pipes.
// ONE parser, used by both surfaces, so a markdown table becomes a real <table> element in
// exactly the place the author wrote it.
//
// Pure module (no React, no "use client") so it can be imported from the server lesson page
// and from the client hub alike. Zero dependencies, ASCII only.

export type MdBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

const HEADING_RE = /^(#{1,4})\s+(.*)$/;
const UNORDERED_RE = /^\s*[-*+]\s+(.*)$/;
const ORDERED_RE = /^\s*\d+[.)]\s+(.*)$/;
const DELIMITER_CELL_RE = /^:?-{2,}:?$/;

/** Split a markdown table row into trimmed cells, preserving empty cells. */
function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

/** True when a row is the `| :-- | :-- |` alignment separator of a markdown table. */
function isDelimiterRow(cells: string[]): boolean {
  if (cells.length === 0) return false;
  return cells.every((c) => DELIMITER_CELL_RE.test(c.replace(/\s/g, '')));
}

function isTableRow(line: string): boolean {
  const t = line.trim();
  return t.length > 1 && t.startsWith('|') && t.endsWith('|');
}

/**
 * Parse a markdown-ish body into an ordered list of renderable blocks.
 * Supported: ATX headings (# .. ####), paragraphs, ordered/unordered lists and
 * pipe tables with an optional alignment row.
 */
export function parseMarkdownBlocks(md: string): MdBlock[] {
  const lines = (md || '').replace(/\r\n/g, '\n').split('\n');
  const blocks: MdBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    // Blank line -> paragraph spacing (handled by CSS margins).
    if (!line) {
      i += 1;
      continue;
    }

    // ---- Table ---------------------------------------------------------
    if (isTableRow(raw)) {
      const tableLines: string[] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i += 1;
      }
      const parsedRows = tableLines.map(splitRow);
      let headers: string[] = [];
      let bodyRows: string[][] = [];
      if (parsedRows.length >= 2 && isDelimiterRow(parsedRows[1])) {
        headers = parsedRows[0];
        bodyRows = parsedRows.slice(2);
      } else {
        headers = parsedRows[0] || [];
        bodyRows = parsedRows.slice(1);
      }
      blocks.push({
        type: 'table',
        headers,
        rows: bodyRows.filter((r) => r.length > 0)
      });
      continue;
    }

    // ---- Heading -------------------------------------------------------
    const heading = HEADING_RE.exec(line);
    if (heading) {
      blocks.push({
        type: 'heading',
        level: heading[1].length,
        text: heading[2].trim()
      });
      i += 1;
      continue;
    }

    // ---- List ----------------------------------------------------------
    const unordered = UNORDERED_RE.exec(raw);
    const ordered = ORDERED_RE.exec(raw);
    if (unordered || ordered) {
      const isOrdered = Boolean(ordered);
      const items: string[] = [];
      while (i < lines.length) {
        const m = isOrdered ? ORDERED_RE.exec(lines[i]) : UNORDERED_RE.exec(lines[i]);
        if (m) {
          items.push(m[1].trim());
          i += 1;
          continue;
        }
        break;
      }
      blocks.push({ type: 'list', ordered: isOrdered, items });
      continue;
    }

    // ---- Paragraph (join wrapped lines, markdown style) -----------------
    const para: string[] = [];
    while (i < lines.length) {
      const l = lines[i].trim();
      if (!l) break;
      if (HEADING_RE.test(l) || UNORDERED_RE.test(l) || ORDERED_RE.test(l) || isTableRow(lines[i])) break;
      para.push(l);
      i += 1;
    }
    if (para.length) {
      blocks.push({ type: 'paragraph', text: para.join(' ') });
    }
  }

  return blocks;
}
