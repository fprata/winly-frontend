const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function listClients() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('clients')
    .select('email, tier');

  if (error) {
      console.error(error);
  } else {
      console.log("All Clients:", data);
  }
}

listClients();