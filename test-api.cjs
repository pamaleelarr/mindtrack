require('dotenv').config();

const BASE44_API_KEY = process.env.VITE_BASE44_API_KEY;
const BASE44_APP_ID = process.env.VITE_BASE44_APP_ID;

async function testAPI() {
  const url = `https://app.base44.com/api/apps/${BASE44_APP_ID}/entities/MoodEntry`;
  
  console.log('Testing URL:', url);
  console.log('API Key:', BASE44_API_KEY);
  console.log('\n🧪 Testing different authorization formats...\n');
  
  // Test 1: Bearer token
  console.log('Test 1: Bearer token');
  let response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${BASE44_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  console.log('Status:', response.status);
  
  // Test 2: X-API-Key header
  console.log('\nTest 2: X-API-Key header');
  response = await fetch(url, {
    headers: {
      'X-API-Key': BASE44_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  console.log('Status:', response.status);
  
  // Test 3: Direct API key in Authorization
  console.log('\nTest 3: Direct API key');
  response = await fetch(url, {
    headers: {
      'Authorization': BASE44_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  console.log('Status:', response.status);
  
  // Test 4: API key in query param
  console.log('\nTest 4: Query parameter');
  response = await fetch(`${url}?api_key=${BASE44_API_KEY}`);
  console.log('Status:', response.status);
  
  if (response.ok) {
    const data = await response.json();
    console.log('\n✅ Success! Found', data.length || data.records?.length || 0, 'records');
  }
}

testAPI().catch(console.error);