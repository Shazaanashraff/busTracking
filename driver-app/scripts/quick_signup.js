/**
 * Quick Signup Script
 * Attempts to sign up the mock users using the public Anon Key.
 * Useful if you don't have the Service Role Key.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yonwlnoiecddokwmqycw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvbndsbm9pZWNkZG9rd21xeWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzYyMDIsImV4cCI6MjA4NDQ1MjIwMn0.D2g6nC57m_7SDHIEOOqPP0SC08jMsx0APRf1ndRR0pY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const mockUsers = [
    { email: 'passenger@test.com', password: 'Test@123', role: 'passenger' },
    { email: 'crew@test.com', password: 'Test@123', role: 'crew' },
    { email: 'owner@test.com', password: 'Test@123', role: 'owner' },
    { email: 'admin@test.com', password: 'Test@123', role: 'admin' },
];

async function signupUser(user) {
    console.log(`\nAttempting signup for: ${user.email}...`);

    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
            data: {
                name: user.role.charAt(0).toUpperCase() + user.role.slice(1), // Capitalize role as name
                role: user.role,
                phone: '+94770000000', // Dummy phone
            }
        }
    });

    if (error) {
        console.error(`❌ Error: ${error.message}`);
        if (error.message.includes('already registered')) {
            console.log('   (User already exists, try logging in)');
        }
    } else {
        // Check if session exists (means auto-confirm is ON)
        if (data.session) {
            console.log(`✅ Success! User created and logged in.`);
        } else if (data.user && !data.session) {
            console.log(`⚠️  User created but requires EMAIL CONFIRMATION.`);
            console.log(`   Please check email or confirm manually in dashboard.`);
        } else {
            console.log(`✅ User created.`);
        }
    }
}

async function main() {
    console.log('--- Quick Signup for Bus App ---');
    for (const user of mockUsers) {
        await signupUser(user);
    }
    console.log('\n--------------------------------');
}

main();
