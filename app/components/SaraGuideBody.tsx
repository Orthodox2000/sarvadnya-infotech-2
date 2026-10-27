import Link from "next/link";
import type { ReactNode } from "react";

// CHANGE: 2026-10-26 — server-only renderer for the indexable Sara guide pages
// (/learn-sara/<topic>). WHAT: turns the lightweight markdown Sara speaks in chat
// ([[Label|/url]] buttons, **bold**, `code`, "- " and "1. " lists) into real HTML.
// WHY: the chat uses the client-side `SaraText`, but a guide page must render on the
// server so Google sees the whole answer, and it must not ship a client bundle just to
// display static text. Same source (lib/sara-topics.ts), two renderers, no second copy
// of the prose. Deliberately has NO "use client" — keep it that way.

const INLINE_RE = /(\[\[.*?\|.*?\]\]|`[^`]+`|\*\*[\s\S]+?\*\*)/g;

const LINK_CLASS =
  "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#006569] text-white font-bold text-[12px] uppercase tracking-wider transition-all hover:bg-[#045A57] active:scale-95 my-0.5 mr-1 align-middle";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE_RE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (!part) return null;

    if (part.startsWith("[[") && part.endsWith("]]")) {
      const [label, href] = part.slice(2, -2).split("|");
      if (!href) return <span key={key}>{part}</span>;
      // Internal links use next/link so a guide CTA is a client-side navigation;
      // an external URL (none today) degrades to a plain anchor.
      if (href.startsWith("/")) {
        return (
          <Link key={key} href={href} className={LINK_CLASS}>
            {label}
          </Link>
        );
      }
      return (
        <a key={key} href={href} rel="noopener noreferrer" target="_blank" className={LINK_CLASS}>
          {label}
        </a>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code key={key} className="px-1.5 py-0.5 rounded bg-[#F0EDE3] text-[#033B38] text-[0.9em] font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

// CHANGE: 2026-10-26 — plain-text projection of an answer, used for the meta description
// and the hub card teaser. Strips the same markdown the renderer understands, so a
// description can never leak "[[" or "**" into a search result.
export function saraPlainText(md: string): string {
  return md
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/^\s*(\d+[.)]|[-*])\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

// CHANGE: 2026-10-26 — first paragraph of an answer as a teaser. Used as a fallback
// when a topic has no hand-written `description`, so a new topic can never render blank.
export function saraExcerpt(md: string, maxLen = 130): string {
  const first = md.split(/\n{2,}/)[0] || "";
  const plain = saraPlainText(first);
  if (plain.length <= maxLen) return plain;
  const cut = plain.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[,;:\-]$/, "");
  return `${trimmed}...`;
}

function isList(lines: string[]) {
  return lines.length > 0 && lines.every((line) => /^\s*[-*]\s+/.test(line));
}

function isOrderedList(lines: string[]) {
  return lines.length > 0 && lines.every((line) => /^\s*\d+[.)]\s+/.test(line));
}

export default function SaraGuideBody({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).filter((block) => block.trim().length > 0);

  return (
    <div className="space-y-4 text-[14px] md:text-[15px] leading-relaxed text-slate-700">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((line) => line.trim().length > 0);
        const key = `block-${blockIndex}`;

        if (isList(lines)) {
          return (
            <ul key={key} className="space-y-2 list-none pl-0">
              {lines.map((line, i) => (
                <li key={`${key}-li-${i}`} className="flex gap-2.5">
                  <span aria-hidden className="mt-[9px] h-1.5 w-1.5 rounded-full bg-[#006569] shrink-0" />
                  <span>{renderInline(line.replace(/^\s*[-*]\s+/, ""), `${key}-li-${i}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (isOrderedList(lines)) {
          return (
            <ol key={key} className="space-y-2 list-none pl-0 counter-reset-none">
              {lines.map((line, i) => (
                <li key={`${key}-li-${i}`} className="flex gap-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#E5F4F4] text-[#006569] text-[11px] font-extrabold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{renderInline(line.replace(/^\s*\d+[.)]\s+/, ""), `${key}-li-${i}`)}</span>
                </li>
              ))}
            </ol>
          );
        }

        // A paragraph block may hold several short lines (for example two CTA buttons on
        // their own lines) — join them so the buttons sit side by side instead of stacking
        // as separate paragraphs.
        return (
          <p key={key} className="leading-relaxed">
            {renderInline(lines.join(" "), key)}
          </p>
        );
      })}
    </div>
  );
}
