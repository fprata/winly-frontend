import { GoogleAuth } from 'google-auth-library';

/**
 * Returns an Authorization header value for calling a Cloud Run service
 * that requires authentication.
 *
 * In production (Vercel): reads GOOGLE_APPLICATION_CREDENTIALS_JSON env var
 * (a service account JSON string) and fetches an identity token for the target URL.
 *
 * Locally: if the env var is absent, falls back to Application Default Credentials
 * (i.e. `gcloud auth application-default login`).
 */
export async function getCloudRunAuthHeader(targetUrl: string): Promise<string | null> {
  const analyticsUrl = process.env.DOCUMENT_ANALYTICS_API_URL || '';
  // Skip auth for local dev pointing at localhost
  if (analyticsUrl.startsWith('http://localhost') || analyticsUrl.startsWith('http://127.')) {
    return null;
  }

  try {
    let auth: GoogleAuth;
    const credJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (credJson) {
      const credentials = JSON.parse(credJson);
      auth = new GoogleAuth({ credentials });
    } else {
      // Local dev: use ADC (gcloud auth application-default login)
      auth = new GoogleAuth();
    }
    const client = await auth.getIdTokenClient(targetUrl);
    const headers = await client.getRequestHeaders(targetUrl) as unknown as Record<string, string>;
    return headers['Authorization'] ?? null;
  } catch (err) {
    console.error('[gcp-auth] Failed to get identity token:', err);
    return null;
  }
}
