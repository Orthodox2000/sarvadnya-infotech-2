// CHANGE: 2026-10-22 — shared figure block for the Tally Insights lessons.
// WHY: the owner supplied the official TallyPrime 7.2 artwork (`public/tally 7.2.png`) and
// asked for it to be incorporated where we talk about 7.2, with a proper fit and correct
// alignment on every screen. The file had a space in its name (not URL safe) and was 4.7 MB,
// so the original is preserved as a gitignored master (`brand-assets/tallyprime-7.2-master.png`,
// the same pattern as `brand-assets/logo-master.png`) and a 1024x1371 WebP derivative
// (168 KB) is what actually ships.
//
// One component, used by BOTH surfaces (server lesson page + client hub), so the figure is
// sized and aligned identically in the standalone lesson and in the hub preview.
// No "use client" directive on purpose, same as MarkdownBody: it is a plain server-compatible
// React component and simply joins the client bundle when the hub imports it.

import Image from "next/image";

type LessonFigureProps = {
  src: string;
  alt: string;
  caption: string;
  /** Intrinsic width of the shipped asset, in pixels (keeps the aspect ratio and avoids CLS). */
  width: number;
  /** Intrinsic height of the shipped asset, in pixels. */
  height: number;
  className?: string;
};

export default function LessonFigure({
  src,
  alt,
  caption,
  width,
  height,
  className
}: LessonFigureProps) {
  return (
    <figure className={`my-8 flex flex-col items-center ${className || ""}`}>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        title="Open the full-size image"
        className="group block w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006569] focus-visible:ring-offset-2"
      >
        {/* CHANGE: 2026-10-22 — next/image, not a raw <img>.
            WHY: the house convention (AGENTS "Image Optimization") is next/image with a
            `sizes` hint. The artwork is a portrait asset shown at most 400 px wide, so the
            optimizer serves a much smaller derivative than the 168 KB source - which matters
            on the phones this page is mostly read on. The intrinsic width/height are still
            passed so the browser reserves the box and there is no layout shift. */}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          // CHANGE: 2026-10-22 — the `sizes` breakpoints mirror the CSS caps exactly
          // (max-w-[320px] / sm:max-w-[360px] at 640px / md:max-w-[400px] at 768px),
          // otherwise the browser could pick a 320w candidate for a 360px slot.
          sizes="(max-width: 639px) 320px, (max-width: 767px) 360px, 400px"
          loading="lazy"
          className="block h-auto w-full"
        />
      </a>
      <figcaption className="mt-3 max-w-md text-center text-xs font-medium leading-relaxed text-slate-500">
        {caption}
      </figcaption>
    </figure>
  );
}
