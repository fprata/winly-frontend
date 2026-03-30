/**
 * Seed francisco.prata@winly.me as a test user for full E2E pipeline testing.
 *
 * Usage:
 *   npx tsx e2e/fixtures/seed-e2e-test-user.ts
 *
 * This creates:
 *   1. Auth user in Supabase
 *   2. Client profile with CPV codes that match existing tenders
 *   3. Notification preferences (digest enabled)
 *
 * After running this, trigger the backend pipeline:
 *   1. python src/scripts/ingest_clients_to_bq.py    (sync user to BigQuery)
 *   2. python src/workers/transform/main.py           (dbt: generate matches)
 *   3. python src/scripts/sync_all_direct.py           (sync matches to Supabase)
 *   4. curl /api/cron/notify-matches                   (send email notification)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USER = {
  email: 'francisco.prata@winly.me',
  password: 'WinlyTest2026!',
  profile: {
    name: 'Winly Labs Lda.',
    services:
      'Software development, cloud infrastructure, data engineering, AI/ML solutions, procurement analytics platform development, cybersecurity consulting.',
    tech_stack: 'Python, TypeScript, Next.js, React, BigQuery, dbt, Terraform, GCP, Supabase',
    cpv_codes: '72, 48, 79',  // IT services, software packages, business services
    major_competitors: ['Novabase', 'Axians', 'Deloitte'],
    min_budget: 25_000,
    max_budget: 2_000_000,
    vat_id: '517000000',
    tier: 'Enterprise',
  },
};

async function main() {
  console.log('=== Seeding E2E Test User ===\n');

  // 1. Create auth user
  console.log('1. Creating auth user...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: TEST_USER.email,
    password: TEST_USER.password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log('   Auth user already exists — skipping.');
    } else {
      console.error('   Auth error:', authError.message);
      return;
    }
  } else {
    console.log(`   Created: ${authData.user.id}`);
  }

  // 2. Upsert client profile
  console.log('2. Upserting client profile...');
  const { error: profileError } = await supabase.from('clients').upsert(
    {
      email: TEST_USER.email,
      ...TEST_USER.profile,
    },
    { onConflict: 'email' }
  );

  if (profileError) {
    console.error('   Profile error:', profileError.message);
    return;
  }
  console.log(`   Profile created: ${TEST_USER.profile.name}`);

  // 3. Get client ID for notification preferences
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', TEST_USER.email)
    .single();

  if (!client) {
    console.error('   Could not fetch client ID');
    return;
  }

  // 4. Set up notification preferences
  console.log('3. Setting notification preferences...');
  const { error: notifError } = await supabase.from('notification_preferences').upsert(
    {
      client_id: client.id,
      email_digest_enabled: true,
      min_score_threshold: 50,
      last_notified_at: null,  // Ensure eligible for next cron run
    },
    { onConflict: 'client_id' }
  );

  if (notifError) {
    console.error('   Notification prefs error:', notifError.message);
    return;
  }
  console.log('   Digest enabled, threshold: 50');

  console.log('\n=== Done ===');
  console.log(`\nUser: ${TEST_USER.email}`);
  console.log(`Pass: ${TEST_USER.password}`);
  console.log(`Tier: ${TEST_USER.profile.tier}`);
  console.log(`CPVs: ${TEST_USER.profile.cpv_codes}`);
  console.log(`Budget: €${TEST_USER.profile.min_budget.toLocaleString()} - €${TEST_USER.profile.max_budget.toLocaleString()}`);
  console.log('\nNext steps:');
  console.log('  1. cd ../winly && python src/scripts/ingest_clients_to_bq.py');
  console.log('  2. cd ../winly && python src/workers/transform/main.py --target dev');
  console.log('  3. cd ../winly && python src/scripts/sync_all_direct.py');
  console.log('  4. Trigger cron: curl -H "Authorization: Bearer $CRON_SECRET" https://winly-frontend.vercel.app/api/cron/notify-matches');
}

main().catch(console.error);
