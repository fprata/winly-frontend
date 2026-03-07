/**
 * Dev-only auth bypass. Set BYPASS_AUTH=true in .env.local to use.
 * Never enable in production — the env var has no NEXT_PUBLIC_ prefix so it
 * is never exposed to the browser or bundled into client code.
 */

export const BYPASS_AUTH = process.env.BYPASS_AUTH === 'true';

export const DEV_USER = {
  id: 'dev-user-00000000-0000-0000-0000-000000000000',
  email: 'francisco.prata@gmail.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as const;

export const DEV_PROFILE = {
  id: 'dev-user-00000000-0000-0000-0000-000000000000',
  name: 'Francisco Prata',
  email: 'francisco.prata@gmail.com',
  services: 'Software Development',
  tech_stack: 'React, TypeScript, Node.js',
  min_budget: 10000,
  max_budget: 500000,
  tier: 'Enterprise',
} as const;

/** Drop-in for supabase.auth.getUser() in server components. */
export async function getServerUser(supabase: any) {
  if (BYPASS_AUTH) return { user: DEV_USER, error: null };
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user ?? null, error };
}

/** Drop-in for the clients table lookup in server components. */
export async function getServerProfile(supabase: any, email: string) {
  return supabase.from('clients').select('*').eq('email', email).single();
}

/**
 * In bypass mode, returns a service-role client that skips RLS so server
 * components can access all data (intel tables, tender_matches, etc.).
 * In production, returns the regular session-based client.
 */
export async function getDataClient(sessionClient: any) {
  if (BYPASS_AUTH) {
    const { createAdminClient } = await import('./supabase/server');
    return createAdminClient();
  }
  return sessionClient;
}
