require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env file!');
  console.log('SUPABASE_URL:', SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Found' : 'Missing');
  process.exit(1);
}

console.log('✅ Supabase credentials loaded!');
console.log('📍 URL:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🚀 Testing Supabase connection...\n');

async function testConnection() {
  try {
    const { data, error } = await supabase.from('moodentry').select('count');
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('📊 MoodEntry table exists!');
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();