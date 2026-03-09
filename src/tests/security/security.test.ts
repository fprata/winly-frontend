import { describe, it, expect } from 'vitest';
import { safePath, isSafeUrl } from '@/lib/security';

// ─── safePath ────────────────────────────────────────────────────────────────

describe('safePath', () => {
  it('returns "/" for null input', () => {
    expect(safePath(null)).toBe('/');
  });

  it('returns "/" for empty string', () => {
    expect(safePath('')).toBe('/');
  });

  it('allows simple relative paths', () => {
    expect(safePath('/dashboard')).toBe('/dashboard');
    expect(safePath('/en/dashboard')).toBe('/en/dashboard');
    expect(safePath('/auth/callback')).toBe('/auth/callback');
  });

  it('allows paths with query strings', () => {
    expect(safePath('/dashboard?tab=matches')).toBe('/dashboard?tab=matches');
  });

  it('blocks protocol-relative URLs (open redirect via //)', () => {
    expect(safePath('//evil.com')).toBe('/');
    expect(safePath('//evil.com/path')).toBe('/');
  });

  it('blocks absolute http URLs', () => {
    expect(safePath('http://evil.com')).toBe('/');
    expect(safePath('https://evil.com/steal')).toBe('/');
  });

  it('blocks javascript: scheme', () => {
    expect(safePath('javascript:alert(1)')).toBe('/');
  });

  it('blocks data: URIs', () => {
    expect(safePath('data:text/html,<script>alert(1)</script>')).toBe('/');
  });

  it('blocks paths that start with a scheme', () => {
    expect(safePath('ftp://evil.com')).toBe('/');
  });
});

// ─── isSafeUrl ───────────────────────────────────────────────────────────────

describe('isSafeUrl', () => {
  // --- legitimate public URLs ---
  it('allows public https URLs', () => {
    expect(isSafeUrl('https://example.com/doc.pdf')).toBe(true);
    expect(isSafeUrl('https://base.gov.pt/download/doc.zip')).toBe(true);
    expect(isSafeUrl('https://ted.europa.eu/notice/12345')).toBe(true);
  });

  it('allows public http URLs', () => {
    expect(isSafeUrl('http://example.com/file.pdf')).toBe(true);
  });

  // --- localhost / loopback ---
  it('blocks localhost', () => {
    expect(isSafeUrl('http://localhost:8000/api')).toBe(false);
    expect(isSafeUrl('https://localhost/admin')).toBe(false);
  });

  it('blocks 127.x.x.x loopback', () => {
    expect(isSafeUrl('http://127.0.0.1:8080')).toBe(false);
    expect(isSafeUrl('http://127.1.1.1')).toBe(false);
  });

  it('blocks 0.x.x.x', () => {
    expect(isSafeUrl('http://0.0.0.0')).toBe(false);
  });

  // --- RFC-1918 private ranges ---
  it('blocks 10.x.x.x private network', () => {
    expect(isSafeUrl('http://10.0.0.1')).toBe(false);
    expect(isSafeUrl('http://10.255.255.255/internal')).toBe(false);
  });

  it('blocks 172.16-31.x.x private network', () => {
    expect(isSafeUrl('http://172.16.0.1')).toBe(false);
    expect(isSafeUrl('http://172.31.255.255')).toBe(false);
  });

  it('allows 172.15.x.x (not in private range)', () => {
    expect(isSafeUrl('http://172.15.0.1')).toBe(true);
  });

  it('allows 172.32.x.x (not in private range)', () => {
    expect(isSafeUrl('http://172.32.0.1')).toBe(true);
  });

  it('blocks 192.168.x.x private network', () => {
    expect(isSafeUrl('http://192.168.1.1')).toBe(false);
    expect(isSafeUrl('http://192.168.100.200/api')).toBe(false);
  });

  // --- link-local / cloud metadata ---
  it('blocks 169.254.x.x link-local (APIPA / AWS metadata)', () => {
    expect(isSafeUrl('http://169.254.169.254/latest/meta-data/')).toBe(false);
  });

  it('blocks GCP metadata endpoint', () => {
    expect(isSafeUrl('http://metadata.google.internal/computeMetadata/v1/')).toBe(false);
  });

  // --- non-HTTP schemes ---
  it('blocks file:// scheme', () => {
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
  });

  it('blocks ftp:// scheme', () => {
    expect(isSafeUrl('ftp://example.com/file')).toBe(false);
  });

  it('blocks javascript: pseudo-scheme', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
  });

  it('blocks gopher:// scheme', () => {
    expect(isSafeUrl('gopher://evil.com')).toBe(false);
  });

  // --- malformed / edge cases ---
  it('rejects malformed URLs', () => {
    expect(isSafeUrl('not-a-url')).toBe(false);
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl('://no-scheme')).toBe(false);
  });
});
