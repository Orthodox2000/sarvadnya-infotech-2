import { seoMetadata } from "@/lib/seo";
import { TEAM_HERO_POSTER_PATH } from "@/lib/team-media";

// CHANGE: 2026-08-27 — Next.js forbids metadata exports from Client Components,
// so per-route metadata lives in this colocated server layout.
// CHANGE: 2026-08-27 — SEO metadata for AI/search indexing.
// CHANGE: 2026-10-29 — action-first title + tightened description for CTR (impressions without clicks).
// CHANGE: 2026-11-12 — the page now features the Diwali 2026 celebration video in the hero.
// The share image is that video's poster frame (1280x720, generated from the owner's
// "team thumbnail.png" and committed as public/videos/team-diwali-2026-poster.webp), so a
// shared /team link previews the video rather than generic site artwork. The video file itself
// stays blocked in robots.ts — same policy as the other hero videos — so it cannot surface as a
// standalone "video isn't on a watch page" result; only the page is indexed.
export const metadata = seoMetadata({
  title: "Meet Your Tally Support Team",
  description: "The people behind Sarvadnya Infotech — a team that simplifies business technology and builds lasting relationships.",
  path: "/team",
  keywords: [
    "sarvadnya infotech team",
    "tally consultants",
    "tally experts",
    "tally support team",
    "sarvadnya infotech diwali celebration",
    "sarvadnya infotech team video",
  ],
  image: TEAM_HERO_POSTER_PATH,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
