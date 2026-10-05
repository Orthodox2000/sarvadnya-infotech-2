import Footer from "../../components/Footer";
import { CareersClient } from "./careers-client";

// CHANGE: 2026-10-05 — the full-bleed hero band ("Build the Future of Business Intelligence") was
// removed on owner request. The compact eyebrow + h1 now live inside <CareersClient />, directly
// above the openings/auth two-column row, so the page has one section instead of three stacked
// ones. SEO metadata is unaffected — it is exported from the colocated server layout.
export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <CareersClient />
      <Footer />
    </div>
  );
}