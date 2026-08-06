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

function renderInline(segment: string, accent: string, onNavigate?: () => void) {
  const lines = segment.split('\n');

  return lines.map((line, li) => {
    const parts = line.split(/(\[\[.*?\|.*?\]\]|`[^`]+`|\*\*[\s\S]+?\*\*)/g);

    const nodes = parts.map((part, pi) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const [label, url] = part.slice(2, -2).split('|');
        if (!url) return <React.Fragment key={pi}>{part}</React.Fragment>;
        return (
          <Link
            key={pi}
            href={url}
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-white font-bold transition-all my-1 mx-0.5 shadow-sm hover:opacity-90 active:scale-95 align-middle"
            style={{ backgroundColor: accent }}
          >
            <span className="text-[0.7em] uppercase tracking-wider">{label}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
