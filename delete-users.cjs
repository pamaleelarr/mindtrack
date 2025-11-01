require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function deleteAllUsers() {
  console.log('🗑️  Deleting all test users...');
  
  const { data: users, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  for (const user of users.users) {
    await supabase.auth.admin.deleteUser(user.id);
    console.log(`✅ Deleted: ${user.email}`);
  }
  
  console.log('\n✅ All users deleted! Now try signing up again.');
}

deleteAllUsers();