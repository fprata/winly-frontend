import { GoogleAuth } from 'google-auth-library';

/**
 * Returns an Authorization header value for calling a Cloud Run service
 * that requires authentication.
 *
 * Reads GCP_SERVICE_ACCOUNT_JSON (service account key JSON string) and fetches
 * a GCP identity token for the target Cloud Run service URL.
 */
export async function getCloudRunAuthHeader(targetUrl: string): Promise<string | null> {
  const analyticsUrl = process.env.DOCUMENT_ANALYTICS_API_URL || '';
  // Skip auth for local dev pointing at localhost
  if (analyticsUrl.startsWith('http://localhost') || analyticsUrl.startsWith('http://127.')) {
    return null;
  }

  const credJson = process.env.GCP_SERVICE_ACCOUNT_JSON;
  if (!credJson) {
    console.error('[gcp-auth] GCP_SERVICE_ACCOUNT_JSON is not set — request will be unauthenticated');
    return null;
  }

  try {
    const credentials = JSON.parse(credJson);
    const auth = new GoogleAuth({ credentials, scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    // audience must be the base service URL (no path)
    const audience = new URL(targetUrl).origin;
    const client = await auth.getIdTokenClient(audience);
    const headers = await client.getRequestHeaders(audience) as unknown as Record<string, string>;
    return headers['Authorization'] ?? null;
  } catch (err) {
    console.error('[gcp-auth] Failed to get identity token:', err);
    return null;
  }
}
