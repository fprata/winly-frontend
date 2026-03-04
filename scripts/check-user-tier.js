const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'frontend/.env.local' });

async function checkTier() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Replace with the email you used
  const email = process.argv[2]; 

  if (!email) {
      console.log("Usage: node check-user-tier.js <email>");
      return;
  }

  const { data, error } = await supabase
    .from('clients')
    .select('email, tier')
    .eq('email', email)
    .single();

  if (error) {
      console.error(error);
  } else {
      console.log("Current DB State:", data);
  }
}

checkTier();
