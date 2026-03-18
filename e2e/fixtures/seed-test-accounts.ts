/**
 * Script to create test accounts in Supabase for E2E testing.
 *
 * Usage:
 *   npx tsx e2e/fixtures/seed-test-accounts.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (admin key — never the anon key)
 *
 * The script is idempotent — it skips accounts that already exist.
 */

import { createClient } from '@supabase/supabase-js';
import { ALL_TEST_ACCOUNTS, type TestAccount } from './test-accounts';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedAccount(account: TestAccount) {
  const tag = `[${account.industry}]`;

  // 1. Create auth user (or skip if exists)
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
    });

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log(`${tag} Auth user already exists — skipping auth creation.`);
    } else {
      console.error(`${tag} Auth error:`, authError.message);
      return;
    }
  } else {
    console.log(`${tag} Auth user created: ${authData.user.id}`);
  }

  // 2. Upsert client profile
  const { error: profileError } = await supabase.from('clients').upsert(
    {
      email: account.email,
      name: account.companyName,
      services: account.services,
      tech_stack: account.techStack,
      cpv_codes: account.cpvCodes,
      major_competitors: account.majorCompetitors,
      min_budget: account.minBudget,
      max_budget: account.maxBudget,
      tier: account.tier,
      ...(account.vatId ? { vat_id: account.vatId } : {}),
    },
    { onConflict: 'email' }
  );

  if (profileError) {
    console.error(`${tag} Profile upsert error:`, profileError.message);
  } else {
    console.log(`${tag} Profile upserted for ${account.companyName}`);
  }
}

async function main() {
  console.log(`Seeding ${ALL_TEST_ACCOUNTS.length} test accounts...\n`);

  for (const account of ALL_TEST_ACCOUNTS) {
    await seedAccount(account);
    console.log('');
  }

  console.log('Done.');
}

main().catch(console.error);
