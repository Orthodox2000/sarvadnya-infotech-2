export async function fetchWithCache(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
  return res.json();
}

export function prefetchData(_url: string) {
  // Caching disabled — no-op
}

export function clearClientCache(_pattern?: string) {
  // Caching disabled — no-op
}
