// CHANGE: 2026-11-24 — Instant, in-memory search across every Tally Insights guide.
// WHY: the global /api/search does not index the curriculum and needs DB + LLM calls. Guide
// search is pure static data, so it answers in one function call with no database read.
import { NextResponse } from "next/server";
import { PUBLIC_API_CACHE } from "@/lib/api-cache";
import { searchInsights } from "@/lib/insights-search";

export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("q") || "";
  const query = raw.trim().slice(0, 120);
  const results = searchInsights(query, 8);
  return NextResponse.json(
    { query, results },
    { headers: { "Cache-Control": PUBLIC_API_CACHE } },
  );
}
