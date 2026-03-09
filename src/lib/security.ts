/**
 * Security utility functions used across API routes and auth callbacks.
 */

/**
 * Prevents open-redirect attacks via the `next` query parameter.
 * Only allows safe relative paths (starting with '/' but not '//').
 */
export function safePath(next: string | null): string {
  if (!next) return '/';
  // Must start with '/' and not with '//' (protocol-relative) or contain a scheme
  if (/^\/(?!\/)/.test(next)) return next;
  return '/';
}

const SSRF_BLOCKLIST =
  /^https?:\/\/(localhost|127\.|0\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|metadata\.google\.internal|fd[0-9a-f]{2}:)/i;

/**
 * Guards against SSRF by rejecting URLs that point to internal/private networks,
 * localhost, GCP metadata endpoint, or non-HTTP(S) schemes.
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    return !SSRF_BLOCKLIST.test(url);
  } catch {
    return false;
  }
}
