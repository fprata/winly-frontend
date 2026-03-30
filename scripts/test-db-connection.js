const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing Supabase Connection...');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Missing URL or Service Role Key in environment variables.');
    return;
  }

  const supabase = createClient(url, key);

  // 1. Try to fetch a user (Winly seed user)
  const email = 'contact@winly.me';
  console.log(`Fetching user: ${email}`);
  const { data: user, error: fetchError } = await supabase
    .from('clients')
    .select('*')
    .eq('email', email)
    .single();

  if (fetchError) {
    console.error('Fetch Error:', fetchError);
    return;
  }
  console.log('User found:', user);

  // 2. Try to update the tier
  console.log('Attempting update...');
  const { error: updateError } = await supabase
    .from('clients')
    .update({ tier: 'Pro_Test' })
    .eq('email', email);

  if (updateError) {
    console.error('Update Error:', updateError);
  } else {
    console.log('Update Successful!');
  }
}

testConnection();
