/**
 * Script to create demo accounts in Supabase
 * Run with: node scripts/create-demo-accounts.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key needed for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please ensure EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Demo account credentials
const DEMO_ACCOUNTS = [
  {
    email: 'admin@ismph.org',
    password: 'ISMPH@Admin2024',
    role: 'super_admin',
    fullName: 'ISMPH Super Admin',
    description: 'Super Administrator with full system access'
  },
  {
    email: 'staff@ismph.org',
    password: 'ISMPH@Staff2024',
    role: 'staff',
    fullName: 'Demo Staff Member',
    state: 'Lagos',
    phone: '08012345678',
    description: 'Staff member with limited access (Lagos)'
  }
];

async function createDemoAccounts() {
  console.log('🚀 Creating demo accounts in Supabase...\n');

  for (const account of DEMO_ACCOUNTS) {
    try {
      console.log(`📧 Creating account: ${account.email}`);

      // Create user with auto-confirm
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.fullName
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`⚠️  Account already exists: ${account.email}`);
          console.log(`   Updating password...`);

          // Update existing user's password
          const { data: users } = await supabase.auth.admin.listUsers();
          const existingUser = users.users.find(u => u.email === account.email);

          if (existingUser) {
            const { error: updateError } = await supabase.auth.admin.updateUserById(
              existingUser.id,
              { password: account.password }
            );

            if (updateError) {
              console.log(`   ❌ Failed to update password: ${updateError.message}`);
            } else {
              console.log(`   ✅ Password updated successfully`);
            }
          }
        } else {
          console.log(`   ❌ Error: ${error.message}`);
          continue;
        }
      } else {
        console.log(`   ✅ Account created successfully`);
        console.log(`   👤 User ID: ${data.user.id}`);
      }

      console.log(`   📋 Role: ${account.role}`);
      if (account.state) {
        console.log(`   📍 State: ${account.state}`);
      }
      console.log(`   🔑 Password: ${account.password}`);
      console.log('');

    } catch (err) {
      console.error(`❌ Unexpected error for ${account.email}:`, err.message);
      console.log('');
    }
  }

  console.log('✅ Demo account creation completed!\n');
  console.log('📝 Login Credentials Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  DEMO_ACCOUNTS.forEach(account => {
    console.log(`\n${account.description}`);
    console.log(`Email:    ${account.email}`);
    console.log(`Password: ${account.password}`);
    console.log(`Role:     ${account.role}`);
    if (account.state) console.log(`State:    ${account.state}`);
  });
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚠️  IMPORTANT: These are demo credentials.');
  console.log('   Change passwords in production environments.\n');
}

// Run the script
createDemoAccounts()
  .then(() => {
    console.log('✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
