'use client';

import React from 'react';
import Link from 'next/link';

interface SaraTextProps {
  text: string;
  accent?: string;
  onNavigate?: () => void;
  plain?: boolean;
}

const CODE_BLOCK_RE = /^```[\s\S]*```$/;

// CHANGE: 2026-10-30 — a [[...]] tag whose label is a KEYBOARD SHORTCUT must
// never become a link (a key has no page). The guard strips the invented URL
// server-side; this is the rendering half, so an old stored reply or a guide
// body still shows a proper key badge instead of raw markup. Kept local on
// purpose: this is a client component and must not import the server guard's
// topic table.
const KEY_TOKEN_RE =
  /^(?:ctrl|control|alt|shift|cmd|command|win|windows|meta|fn|esc|escape|enter|return|tab|space|spacebar|backspace|delete|del|insert|ins|home|end|pgup|pgdn|pageup|pagedown|up|down|left|right|arrowup|arrowdown|arrowleft|arrowright|prtsc|printscreen|f(?:[1-9]|1[0-2])|[a-z]|\d|[,./;'[\]\\`=-])$/i;

function isShortcutLabel(label: string): boolean {
  const raw = label.trim();
  if (!raw || raw.length > 40 || /[>|]/.test(raw)) return false;
  const tokens = raw.split('+').map((t) => t.trim());
  if (tokens.some((t) => !t || !KEY_TOKEN_RE.test(t))) return false;
  if (tokens.length === 1) {
    const only = tokens[0].toLowerCase();
    return (
      only.length === 1 ||
      /^\d$/.test(only) ||
      /^f(?:[1-9]|1[0-2])$/.test(only) ||
      /^(?:ctrl|alt|shift|esc|escape|enter|return|tab|space|backspace|delete|del|insert|home|end|pgup|pgdn|pageup|pagedown|prtsc|printscreen|cmd|win|meta|fn)$/.test(only)
    );
  }
  return true;
}

function KeyboardKey({ label, accent }: { label: string; accent: string }) {
  return (
    <kbd
      className="mx-0.5 inline-block rounded-md border border-slate-300 border-b-2 bg-slate-50 px-1.5 py-0.5 font-mono text-[0.8em] font-semibold leading-none text-slate-800 shadow-[inset_0_-1px_0_rgba(15,23,42,0.08)] align-baseline"
      style={{ color: accent }}
    >
      {label}
    </kbd>
  );
}


function renderInline(segment: string, accent: string, onNavigate?: () => void) {
  const lines = segment.split('\n');

  return lines.map((line, li) => {
    const parts = line.split(/(\[\[.*?\|.*?\]\]|`[^`]+`|\*\*[\s\S]+?\*\*|\*[^*\s][^*]*\*)/g);

    const nodes = parts.map((part, pi) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const [label, url] = part.slice(2, -2).split('|');
        // CHANGE: 2026-10-30 — a shortcut is never a link, whether or not the
        // model attached a (fabricated) URL to it. Draw a key badge instead.
        if (isShortcutLabel(label)) {
          return <KeyboardKey key={pi} label={label.trim()} accent={accent} />;
        }
        // A pipe-less tag is raw markup, not a destination: show the words only.
        if (!url) return <React.Fragment key={pi}>{label}</React.Fragment>;
        return (
          <Link
            key={pi}
            href={url}
            onClick={onNavigate}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold transition-all my-0.5 mx-0.5 hover:underline align-baseline"
            style={{ color: accent }}
          >
            <span>{label}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
        return (
          <code key={pi} className="mx-0.5 px-1 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[0.85em]">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pi} className="font-black" style={{ color: accent }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2 && part[1] !== ' ') {
        return (
          <strong key={pi} className="font-black" style={{ color: accent }}>
            {part.slice(1, -1)}
          </strong>
        );
      }
      return <React.Fragment key={pi}>{part}</React.Fragment>;
    });

    return (
      <React.Fragment key={li}>
        {nodes}
        {li < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function SaraText({ text, accent = '#006569', onNavigate, plain = false }: SaraTextProps) {
  if (plain) {
    const plainLines = text.split('\n');
    return (
      <React.Fragment>
        {plainLines.map((line, li) => (
          <React.Fragment key={li}>
            {line}
            {li < plainLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }

  const segments = text.split(/(```[\s\S]*?```)/g);

  return (
    <React.Fragment>
      {segments.map((seg, i) => {
        if (CODE_BLOCK_RE.test(seg)) {
          const inner = seg.slice(3, -3);
          const firstNl = inner.indexOf('\n');
          const code = firstNl === -1 ? inner.trim() : inner.slice(firstNl + 1).replace(/\n+$/, '');
          return (
            <pre
              key={i}
              className="my-2 rounded-xl bg-slate-900 text-teal-200 p-3 overflow-x-auto text-[0.85em] leading-relaxed font-mono whitespace-pre border border-white/5"
            >
              {code}
            </pre>
          );
        }
        return <React.Fragment key={i}>{renderInline(seg, accent, onNavigate)}</React.Fragment>;
      })}
    </React.Fragment>
  );
}
