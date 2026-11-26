// CHANGE: 2026-11-24 — Instant, in-memory search across every Tally Insights guide.
// WHY: the global /api/search does not index the curriculum and needs DB + LLM calls. Guide
// search is pure static data, so it answers in one function call with no database read.
// CHANGE: 2026-11-26 — with ?section= (and optional ?lesson=) the result set is limited to
// that section or single guide, and each hit carries the anchor of the exact matched line.
import { NextResponse } from "next/server";
import { PUBLIC_API_CACHE } from "@/lib/api-cache";
import { searchInsights, searchInsightsScoped } from "@/lib/insights-search";

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const raw = params.get("q") || "";
  const query = raw.trim().slice(0, 120);
  const sectionId = (params.get("section") || "").trim();
  const lessonSlug = (params.get("lesson") || "").trim();
  const results = sectionId
    ? searchInsightsScoped(query, { sectionId, lessonSlug: lessonSlug || undefined }, 8)
    : searchInsights(query, 8);
  return NextResponse.json(
    { query, results },
    { headers: { "Cache-Control": PUBLIC_API_CACHE } },
  );
}
