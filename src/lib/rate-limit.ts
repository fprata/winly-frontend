/**
 * Simple in-process rate limiter — suitable for single-instance deployments and low-traffic MVP.
 *
 * For distributed / high-traffic production use, replace with Upstash Redis:
 *   npm i @upstash/ratelimit @upstash/redis
 *   https://github.com/upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune stale entries every 10 minutes so the Map doesn't grow unbounded
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 10 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  /** How many requests remain in the current window */
  remaining: number;
  /** Unix timestamp (ms) when the window resets */
  resetAt: number;
}

/**
 * Check whether a given key (e.g. user ID or IP) is within the rate limit.
 *
 * @param key       Unique identifier (userId, IP address, …)
 * @param limit     Max requests allowed per window
 * @param windowMs  Window duration in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request in this window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  return {
    allowed: entry.count <= limit,
    remaining,
    resetAt: entry.resetAt,
  };
}
