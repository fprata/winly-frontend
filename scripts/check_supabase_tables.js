const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function checkTables() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    console.error("Missing env vars");
    return;
  }

  const supabase = createClient(url, key);
  
  console.log("Checking 'tender_matches'...");
  const { count, error } = await supabase
    .from('tender_matches')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error("Error accessing tender_matches:", error.message);
  } else {
    console.log(`Success! 'tender_matches' has ${count} rows.`);
  }

  console.log("Checking 'clients'...");
  const { count: clientCount, error: clientError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true });

  if (clientError) {
    console.error("Error accessing clients:", clientError.message);
  } else {
    console.log(`Success! 'clients' has ${clientCount} rows.`);
  }
}

checkTables();
