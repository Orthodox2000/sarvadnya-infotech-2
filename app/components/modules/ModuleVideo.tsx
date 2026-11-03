"use client";

import { useState } from "react";
import Image from "next/image";
import { youTubeVideoId } from "@/lib/modules";

/**
 * CHANGE: 2026-11-02 — the module page "showcase video" block.
 * WHY: the brochure video should play on the page, not send the visitor to YouTube.
 * The iframe is only injected after the visitor presses play (privacy + no third-party
 * request on first paint); the poster comes from img.youtube.com, already allowed in
 * next.config.js. The matching CSP frame-src entry lives beside that config.
 *
 * CHANGE: 2026-11-03 — there is no outbound fallback any more. Five modules still carry a
 * placeholder URL in the database; `youTubeVideoId()` rejects it, and the page does not
 * render this section at all. Rendering a "watch on YouTube" link for a missing video was a
 * dead link on a real customer site. The caller must gate on `hasEmbeddableVideo()`.
 */
export default function ModuleVideo({
  videoUrl,
  title,
}: {
  videoUrl: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = youTubeVideoId(videoUrl);

  if (!id) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#033B38] bg-[#033B38] shadow-[0_8px_0_0_#033B38]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={`${title} — video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Play the ${title} video`}
        >
          <Image
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-[#033B38]/45 transition-colors group-hover:bg-[#033B38]/30" />
          {/* CHANGE: 2026-11-03 — no hover zoom; the module pages are deliberately flat. */}
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#006569] text-white shadow-lg">
            <svg className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#033B38]">
            Watch the module in action
          </span>
        </button>
      )}
    </div>
  );
}
