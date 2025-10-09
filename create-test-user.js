// Script to create a test user account
// Run with: node create-test-user.js

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const createTestUser = async () => {
  try {
    console.log('👤 Creating test user account...');
    
    const userData = {
      email: 'saltysausage10@gmail.com',
      password: 'TestPassword123!', // This will be hashed
      first_name: 'Test',
      last_name: 'User',
      user_type: 'student',
      phone: '+1234567890',
      created_at: new Date().toISOString()
    };

    console.log('📧 Email:', userData.email);
    console.log('🔑 Password:', userData.password);
    console.log('👤 Name:', `${userData.first_name} ${userData.last_name}`);
    console.log('🎓 User Type:', userData.user_type);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      console.log('⚠️ User already exists with this email!');
      console.log('📧 Existing user ID:', existingUser.id);
      return;
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user in database
    console.log('💾 Inserting user into database...');
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        password: hashedPassword,
        first_name: userData.first_name,
        last_name: userData.last_name,
        user_type: userData.user_type,
        phone: userData.phone,
        created_at: userData.created_at
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating user:', error);
      return;
    }

    console.log('✅ User created successfully!');
    console.log('🆔 User ID:', user.id);
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', `${user.first_name} ${user.last_name}`);
    console.log('🎓 User Type:', user.user_type);
    
    console.log('\n🎉 Test Account Created!');
    console.log('📧 Email: saltysausage10@gmail.com');
    console.log('🔑 Password: TestPassword123!');
    console.log('\n🧪 You can now test:');
    console.log('1. Login with these credentials');
    console.log('2. Password reset functionality');
    console.log('3. All other features');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
};

// Run the script
createTestUser();
