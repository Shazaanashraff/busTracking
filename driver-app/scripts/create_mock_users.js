/**
 * Create Mock Users Script
 * Run with: node scripts/create_mock_users.js
 * 
 * NOTE: You need a Supabase service role key for this script.
 * Get it from: Supabase Dashboard > Settings > API > service_role key
 */

const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase credentials
const SUPABASE_URL = 'https://yonwlnoiecddokwmqycw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_ROLE_KEY';

if (SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_ROLE_KEY') {
    console.error('❌ Set SUPABASE_SERVICE_KEY environment variable first!');
    console.log('\nGet it from: Supabase Dashboard > Settings > API > service_role (secret)');
    console.log('\nRun: $env:SUPABASE_SERVICE_KEY="your-key-here"');
    console.log('Then: node scripts/create_mock_users.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

const mockUsers = [
    {
        email: 'passenger@test.com',
        password: 'Test@123',
        name: 'Kasun Perera',
        role: 'passenger',
        phone: '+94771234567',
    },
    {
        email: 'crew@test.com',
        password: 'Test@123',
        name: 'Nimal Silva',
        role: 'crew',
        phone: '+94772345678',
    },
    {
        email: 'owner@test.com',
        password: 'Test@123',
        name: 'Mahinda Fernando',
        role: 'owner',
        phone: '+94773456789',
    },
    {
        email: 'admin@test.com',
        password: 'Test@123',
        name: 'System Admin',
        role: 'admin',
        phone: '+94774567890',
    },
];

async function createUser(userData) {
    try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true, // Auto-confirm email
        });

        if (authError) {
            if (authError.message.includes('already been registered')) {
                console.log(`⚠️  User ${userData.email} already exists`);

                // Get existing user
                const { data: users } = await supabase.auth.admin.listUsers();
                const existingUser = users?.users?.find(u => u.email === userData.email);

                if (existingUser) {
                    // Update profile
                    await createProfile(existingUser.id, userData);
                }
                return;
            }
            throw authError;
        }

        console.log(`✅ Created auth user: ${userData.email}`);

        // Create profile
        await createProfile(authData.user.id, userData);

    } catch (error) {
        console.error(`❌ Error creating ${userData.email}:`, error.message);
    }
}

async function createProfile(userId, userData) {
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            name: userData.name,
            role: userData.role,
            phone: userData.phone,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        console.error(`   ❌ Profile error for ${userData.email}:`, error.message);
    } else {
        console.log(`   ✅ Profile created for ${userData.email} (${userData.role})`);
    }
}

async function main() {
    console.log('\n🚀 Creating mock users for Bus Tracking App...\n');

    for (const user of mockUsers) {
        await createUser(user);
    }

    console.log('\n✅ Done! Test accounts:');
    console.log('─────────────────────────────────────────');
    console.log('| Email                | Password  | Role      |');
    console.log('─────────────────────────────────────────');
    for (const user of mockUsers) {
        console.log(`| ${user.email.padEnd(20)} | ${user.password.padEnd(9)} | ${user.role.padEnd(9)} |`);
    }
    console.log('─────────────────────────────────────────\n');
}

main();
