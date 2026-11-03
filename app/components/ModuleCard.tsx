'use client';

import { Module, hasEmbeddableVideo, moduleHref } from '@/lib/modules';
import Image from 'next/image';
import Link from 'next/link';

interface ModuleCardProps {
  module: Module;
  onEnquire: (module: Module) => void;
}

// CHANGE: 2026-11-03 — flat teal card to match /modules/[slug].
// WHY: the listing used a gradient overlay, a blurred glow and a hover zoom while the detail
// pages are flat. The owner asked for one consistent, non-animated theme. "Watch Video" is now
// only rendered when the module actually has an embeddable video (the DB placeholder is
// rejected by hasEmbeddableVideo), and it links to the in-page #video section instead of
// opening a dead YouTube URL in a new tab.
export default function ModuleCard({ module, onEnquire }: ModuleCardProps) {
  const id = module.id || module._id || '';
  const hasVideo = hasEmbeddableVideo(module.videoUrl);

  return (
    <div
      id={module.id}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#C5E3E3] bg-white shadow-sm transition-colors hover:border-[#006569] scroll-mt-40"
    >
      {/* Image Container */}
      <div className="relative h-40 w-full overflow-hidden bg-[#D4EAEA]">
        <Image
          src={module.image}
          alt={module.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-full border border-[#033B38] bg-[#E5F4F4] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#033B38]">
            {module.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-black text-slate-900 transition-colors group-hover:text-[#006569]">
          {module.title}
        </h3>
        <p className="mb-5 line-clamp-3 text-[13px] font-medium leading-relaxed text-slate-600">
          {module.shortDescription}
        </p>

        {/* Action Links */}
        <div className={`mb-3 grid gap-2 ${hasVideo ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {hasVideo && (
            <Link
              href={`${moduleHref(id)}#video`}
              className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[#C5E3E3] bg-[#E5F4F4] text-[10px] font-bold text-[#033B38] transition-colors hover:bg-[#D4EAEA]"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Video
            </Link>
          )}
          <a
            href={module.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            // CHANGE: 2026-10-31 — the brochure is now a real PDF. `download` makes the
            // button save the document instead of opening an image in a tab, and the
            // label names the file for screen readers.
            download
            aria-label={`Download ${module.title} brochure (PDF)`}
            className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[#C5E3E3] bg-[#E5F4F4] text-[10px] font-bold text-[#033B38] transition-colors hover:bg-[#D4EAEA]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Brochure
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* CHANGE: 2026-11-02 — "More Details" now opens the module's own page instead of a modal. */}
          <Link
            href={moduleHref(id)}
            className="flex-1 rounded-xl border border-[#006569] bg-[#006569] py-2.5 text-center text-[11px] font-bold text-white transition-colors hover:bg-white hover:text-[#006569]"
          >
            More Details
          </Link>
          <button
            onClick={() => onEnquire(module)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C5E3E3] text-[#006569] transition-colors hover:bg-[#E5F4F4]"
            title="Enquire Now"
            aria-label={`Enquire about ${module.title}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
