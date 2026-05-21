/**
 * Client-side API fetcher with built-in caching and request deduplication.
 * Prevents redundant HTTP calls and improves app responsiveness.
 */

const cache: Record<string, { data: any, timestamp: number } | undefined> = {};
const pendingRequests: Record<string, Promise<any> | undefined> = {};

// Cache duration in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

export async function fetchWithCache(url: string) {
  const now = Date.now();
  
  // 1. Check if we have a valid cached entry
  if (cache[url] && (now - cache[url].timestamp < CACHE_TTL)) {
    return cache[url].data;
  }

  // 2. If a request for this URL is already in flight, return that promise
  if (pendingRequests[url]) {
    return pendingRequests[url];
  }

  // 3. Initiate new fetch
  pendingRequests[url] = fetch(url)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
      const data = await res.json();
      
      if (data && !data.error) {
        cache[url] = {
          data,
          timestamp: Date.now()
        };
      }
      return data;
    })
    .catch((err) => {
      console.error(`API Error [${url}]:`, err);
      throw err;
    })
    .finally(() => {
      // Clean up pending request
      delete pendingRequests[url];
    });

  return pendingRequests[url];
}

/**
 * Prefetches data in the background without blocking execution.
 */
export function prefetchData(url: string) {
  const now = Date.now();
  if (cache[url] && (now - cache[url].timestamp < CACHE_TTL)) return;
  if (pendingRequests[url]) return;

  // Background fetch
  fetchWithCache(url).catch(() => {});
}

/**
 * Clears the client cache for specific tags or URLs
 */
export function clearClientCache(pattern?: string) {
  if (!pattern) {
    Object.keys(cache).forEach(key => delete cache[key]);
  } else {
    Object.keys(cache).forEach(key => {
      if (key.includes(pattern)) delete cache[key];
    });
  }
}
