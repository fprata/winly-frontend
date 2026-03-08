import { JWT } from 'google-auth-library';

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
    // audience must be the base service URL (no path)
    const audience = new URL(targetUrl).origin;
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      additionalClaims: { target_audience: audience },
    });
    const idToken = await client.fetchIdToken(audience);
    return `Bearer ${idToken}`;
  } catch (err) {
    console.error('[gcp-auth] Failed to get identity token:', err);
    return null;
  }
}
