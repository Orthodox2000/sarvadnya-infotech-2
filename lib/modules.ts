/**
 * CHANGE: 2026-11-02 — one canonical URL builder for every module.
 * WHY: module links used to be `#fragment` deep links into /modules (id-based routing).
 * Each module now has its own page at /modules/<id>, so nav, footer, search, Sara and the
 * module cards all build the href from here instead of repeating the string.
 */
export function moduleHref(id?: string | null): string {
  return `/modules/${encodeURIComponent(String(id || "").trim())}`;
}

/**
 * CHANGE: 2026-11-03 — one definition of "this URL is a real, embeddable YouTube video".
 *
 * WHY: five modules still carry `https://www.youtube.com/embed/dQw4w9WgXcQ` in the database.
 * That is a placeholder, not a product video. Embedding it (or linking it as "Watch Video")
 * shipped a Rickroll on a Tally partner site. Everything — the module page, the module card
 * and ModuleVideo — must ask this helper instead of testing `videoUrl` for truthiness.
 */
const YOUTUBE_VIDEO_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|shorts\/|live\/))([A-Za-z0-9_-]{11})/;

const PLACEHOLDER_VIDEO_IDS = new Set(["dQw4w9WgXcQ"]);

export function youTubeVideoId(url?: string | null): string | null {
  if (!url) return null;
  const match = String(url).match(YOUTUBE_VIDEO_RE);
  if (!match) return null;
  if (PLACEHOLDER_VIDEO_IDS.has(match[1])) return null;
  return match[1];
}

export function hasEmbeddableVideo(url?: string | null): boolean {
  return Boolean(youTubeVideoId(url));
}

export interface Module {

  _id?: string;
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  videoUrl: string;
  brochureUrl: string;
  image: string;
  features: string[];
  benefits: string[];
  pricing?: {
    label: string;
    price: string;
  }[];
  category: string;
  sequence?: number;
}

// Excel to Tally Import — kept commented out for later
// {
//   id: "excel-to-tally",
//   title: "Excel to Tally Import",
//   shortDescription: "Eliminate manual data entry. Bulk import thousands of vouchers and masters from Excel to Tally in seconds.",
//   fullDescription: "Stop wasting hours on manual data entry. Seamlessly migrate thousands of sales invoices, purchase vouchers, bank statements, and masters from any Excel sheet straight into TallyPrime. Enjoy lightning-fast, 100% error-free data imports with our intelligent mapping utility.",
//   videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//   brochureUrl: "/brochures/excel-import.pdf",
//   image: "/assets/images/excel-to-tally-new.jpg",
//   features: [
//     "Intelligent Custom Mapping",
//     "Pre-Import Error Validation",
//     "Supports All Tally Voucher Types",
//     "Multi-Company Import Capability"
//   ],
//   benefits: [
//     "Save 90% on manual entry time",
//     "Eliminate costly human errors",
//     "Execute rapid bulk data migration",
//     "Enjoy a simple, intuitive interface"
//   ],
//   category: "Utility Module"
// }
