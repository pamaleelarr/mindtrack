require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('\n🔍 ENVIRONMENT VARIABLES CHECK:');
console.log('================================');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'MISSING');
console.log('VITE_SUPABASE_SERVICE_ROLE_KEY:', process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'MISSING');
console.log('VITE_BASE44_APP_ID:', process.env.VITE_BASE44_APP_ID || 'MISSING');
console.log('VITE_BASE44_API_KEY:', process.env.VITE_BASE44_API_KEY || 'MISSING');
console.log('================================\n');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const BASE44_API_KEY = process.env.VITE_BASE44_API_KEY;
const BASE44_APP_ID = process.env.VITE_BASE44_APP_ID;

if (!SUPABASE_URL || !SUPABASE_KEY || !BASE44_API_KEY || !BASE44_APP_ID) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

console.log('✅ All credentials loaded!\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ENTITY_MAPPING = {
  'MoodEntry': 'moodentry',
  'Trigger': 'trigger',
  'Strategy': 'strategy',
  'Achievement': 'achievement',
  'MedicationChange': 'medicationchange',
};

async function fetchFromBase44(entityName) {
  const url = `https://app.base44.com/api/apps/${BASE44_APP_ID}/entities/${entityName}?api_key=${BASE44_API_KEY}`;
  console.log(`   📡 Fetching ${entityName}...`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const records = Array.isArray(data) ? data : (data.records || data.data || []);
    console.log(`   ✅ Found ${records.length} records`);
    return records;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return [];
  }
}

async function insertToSupabase(tableName, records) {
  if (!records || records.length === 0) {
    console.log(`   ⚠️  No records to insert`);
    return 0;
  }

  console.log(`   📝 Inserting ${records.length} records into ${tableName}...`);

  try {
    const { error } = await supabase.from(tableName).insert(records);
    
    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
      return 0;
    }
    
    console.log(`   ✅ Successfully inserted!`);
    return records.length;
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`);
    return 0;
  }
}

async function run() {
  console.log('🚀 Testing Supabase connection...\n');
  
  try {
    const { error } = await supabase.from('moodentry').select('id').limit(1);
    if (error) throw error;
    console.log('✅ Connected to Supabase!\n');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }

  console.log('🔄 Starting migration...\n');
  console.log('='.repeat(60));

  let total = 0;
  
  for (const [base44Entity, supabaseTable] of Object.entries(ENTITY_MAPPING)) {
    console.log(`\n📦 ${base44Entity} → ${supabaseTable}`);
    const records = await fetchFromBase44(base44Entity);
    const inserted = await insertToSupabase(supabaseTable, records);
    total += inserted;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Migration complete! Total records: ${total}\n`);
}

run().catch(error => {
  console.error('💥 Failed:', error);
  process.exit(1);
});