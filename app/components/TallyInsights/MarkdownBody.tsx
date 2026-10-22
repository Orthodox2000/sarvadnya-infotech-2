// CHANGE: 2026-10-22 — shared renderer for Tally Insights markdown bodies.
// WHY: the server lesson page and the client hub rendered the same lesson body differently
// (one appended tables at the bottom of the article, the other printed raw `| ... |` pipes).
// Both now render through this component, so a markdown table is a real, server-rendered
// <table> in the position the author wrote it.
//
// No "use client" directive on purpose: this component is a plain server-compatible React
// component, so it can be imported by the server lesson page AND by the client hub (where it
// simply joins the client bundle).

import Link from "next/link";
import type { ReactNode } from "react";
import { parseMarkdownBlocks, type MdBlock } from "@/lib/markdown-blocks";

const INLINE_TOKEN =
  /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\n]+\*)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const parts = String(text || "").split(INLINE_TOKEN);

  parts.forEach((part, index) => {
    if (!part) return;
    const key = `${keyPrefix}-${index}`;

    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={key} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
      return;
    }

    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-[#E5F4F4] text-[#006569] font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      );
      return;
    }

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const href = link[2];
      const internal = href.startsWith("/") || href.startsWith("#");
      nodes.push(
        internal ? (
          <Link
            key={key}
            href={href}
            className="text-[#006569] font-semibold hover:underline underline-offset-2 transition-colors"
          >
            {link[1]}
          </Link>
        ) : (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#006569] font-semibold hover:underline underline-offset-2 transition-colors"
          >
            {link[1]}
          </a>
        )
      );
      return;
    }

    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      nodes.push(
        <em key={key} className="italic">
          {part.slice(1, -1)}
        </em>
      );
      return;
    }

    nodes.push(<span key={key}>{part}</span>);
  });

  return nodes;
}

/**
 * Strip the inline markdown markers from a header so it can be used as a plain-text label
 * (the mobile card layout renders it through `content: attr(data-label)`, and a raw
 * `**Tally ERP 9**` would show the asterisks to the reader).
 */
function plainLabel(text: string): string {
  return String(text || "")
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/[*`]/g, "")
    .trim();
}

function TableBlock({ block, index }: { block: Extract<MdBlock, { type: "table" }>; index: number }) {
  if (!block.headers.length && !block.rows.length) return null;

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      {/* CHANGE: 2026-10-22 — the table carries the `insights-table` class and every cell
          carries its column header in `data-label`.
          WHY: the owner asked for the tables to become cards on a phone. Below the md
          breakpoint the stylesheet in app/globals.css turns every ROW into its own card:
          the first cell becomes the card title (the feature / row key) and each remaining
          cell becomes a "label: value" line, so a comparison table shows BOTH values - and
          therefore the difference between them - with no horizontal scrolling.
          ONE DOM serves both layouts; the desktop table and the mobile cards are the same
          elements, restyled by CSS. */}
      <table className="insights-table w-full text-sm border-collapse">
        {block.headers.length > 0 && (
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-[#F5F4ED]/40">
              {block.headers.map((h, hi) => (
                <th
                  key={hi}
                  scope="col"
                  className="text-left py-3 px-4 font-bold text-slate-700 whitespace-nowrap align-bottom"
                >
                  {renderInline(h, `t${index}-h${hi}`)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {block.rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-t border-slate-100 hover:bg-[#F5F4ED]/25 transition-colors duration-150"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  data-label={plainLabel(block.headers[ci] || "")}
                  className="py-3 px-4 align-top text-slate-600 font-medium leading-relaxed"
                >
                  {renderInline(cell, `t${index}-r${ri}-c${ci}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MarkdownBody({
  md,
  className
}: {
  md: string;
  className?: string;
}) {
  const blocks = parseMarkdownBlocks(md);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const sizes = [
            "text-2xl md:text-3xl font-black text-slate-900 tracking-tight",
            "text-xl md:text-2xl font-black text-slate-900 tracking-tight",
            "text-lg md:text-xl font-bold text-slate-900 tracking-tight",
            "text-base md:text-lg font-bold text-slate-900 tracking-tight"
          ];
          return (
            <h2
              key={index}
              className={`${sizes[Math.min(block.level, 4) - 1]} mt-8 mb-4 first:mt-0`}
            >
              {renderInline(block.text, `h${index}`)}
            </h2>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={index}
              className={`my-4 pl-5 space-y-1.5 text-slate-700 font-medium leading-relaxed ${
                block.ordered ? "list-decimal" : "list-disc"
              } marker:text-[#006569] marker:font-black`}
            >
              {block.items.map((item, ii) => (
                <li key={ii}>{renderInline(item, `l${index}-${ii}`)}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "table") {
          return <TableBlock key={index} block={block} index={index} />;
        }

        return (
          <p
            key={index}
            className="my-4 text-slate-700 font-medium leading-relaxed first:mt-0 last:mb-0"
          >
            {renderInline(block.text, `p${index}`)}
          </p>
        );
      })}
    </div>
  );
}
