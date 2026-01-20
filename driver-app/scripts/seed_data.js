const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = 'https://yonwlnoiecddokwmqycw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvbndsbm9pZWNkZG9rd21xeWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzYyMDIsImV4cCI6MjA4NDQ1MjIwMn0.D2g6nC57m_7SDHIEOOqPP0SC08jMsx0APRf1ndRR0pY';

// Initialize Supabase (No Auth storage needed for admin operations if RLS allows or we use service key, 
// BUT we only have Anon key so we must respect RLS or rely on open policies)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

async function seedData() {
    console.log('🚀 Starting Data Seeding...');

    try {
        // 1. Check for existing Owners
        console.log('🔍 Finding Owner...');
        let { data: owners, error: ownerError } = await supabase
            .from('owners')
            .select('id, profile_id')
            .limit(1);

        if (ownerError) throw ownerError;

        if (!owners || owners.length === 0) {
            console.log('⚠️ No owners found. Please create an owner account in the app first.');
            return;
        }

        const owner = owners[0];
        console.log(`✅ Found Owner: ${owner.id}`);

        // 2. Check for Buses for this Owner
        console.log('🔍 Finding Bus...');
        let { data: buses, error: busError } = await supabase
            .from('buses')
            .select('id')
            .eq('owner_id', owner.id)
            .limit(1);

        if (busError) throw busError;

        let busId;
        if (!buses || buses.length === 0) {
            console.log('⚠️ No bus found for owner. Creating a test bus...');
            // Try to insert a bus (Subject to RLS - THIS MIGHT FAIL if Anon cannot insert)
            // Since we can't easily sign in as the owner here without credentials, 
            // we are limited to what Anon can do.
            // IF RLS IS ON, THIS WILL FAIL. 
            // We will assume the user has created at least one bus via the app, 
            // OR we rely on Public policies I saw in setup_all.sql (Wait, policies were restrictive).

            // Let's TRY to find ANY bus from any owner to attach bookings to
            let { data: anyBus } = await supabase.from('buses').select('id, owner_id').limit(1);
            if (anyBus && anyBus.length > 0) {
                busId = anyBus[0].id;
                console.log(`✅ Using existing bus: ${busId}`);
            } else {
                console.error('❌ No buses found and cannot create one without auth. Please add a bus in the app first.');
                return;
            }
        } else {
            busId = buses[0].id;
            console.log(`✅ Found Bus: ${busId}`);
        }

        // 3. Find a Passenger (Profile that is not an owner)
        // We need a passenger_id for bookings
        let { data: profiles } = await supabase.from('profiles').select('id').limit(5);
        let passengerId = profiles.find(p => p.id !== owner.profile_id)?.id || profiles[0].id;

        console.log(`✅ Using Passenger ID: ${passengerId}`);

        // 4. Create Dummy Bookings
        console.log('📦 Creating Bookings...');

        // We need route stages for pickup/dropoff
        let { data: stages } = await supabase.from('stages').select('id').limit(2);
        let pickup = stages && stages[0] ? stages[0].id : null;
        let dropoff = stages && stages[1] ? stages[1].id : null;

        const today = new Date().toISOString().split('T')[0];

        const bookings = [
            {
                bus_id: busId,
                passenger_id: passengerId,
                seat_number: '1',
                pickup_stage: pickup,
                dropoff_stage: dropoff,
                trip_date: today,
                amount: 850.00,
                payment_status: 'Paid',
                status: 'Booked', // Valid booking for today
            },
            {
                bus_id: busId,
                passenger_id: passengerId,
                seat_number: '2',
                pickup_stage: pickup,
                dropoff_stage: dropoff,
                trip_date: today,
                amount: 1200.00,
                payment_status: 'Paid',
                status: 'Completed', // Already used
            },
            {
                bus_id: busId,
                passenger_id: passengerId,
                seat_number: '3',
                pickup_stage: pickup,
                dropoff_stage: dropoff,
                trip_date: today,
                amount: 850.00,
                payment_status: 'Paid',
                status: 'Booked',
            },
            {
                bus_id: busId,
                passenger_id: passengerId,
                seat_number: '4',
                pickup_stage: pickup,
                dropoff_stage: dropoff,
                trip_date: today,
                amount: 1500.00,
                payment_status: 'Pending',
                status: 'Booked',
            }
        ];

        // NOTE: This insert requires Policy 'Passengers can create bookings' 
        // AND auth.uid() = passenger_id.
        // Since we are ANON (not logged in as passenger), this INSERT WILL FAIL if RLS is strict.
        // Check setup_all.sql:
        // CREATE POLICY "Passengers can create bookings" ON bookings FOR INSERT WITH CHECK (passenger_id = auth.uid());

        // PROBLEM: We cannot insert bookings as Anon if RLS enforces auth.uid() == passenger_id.
        // WORKAROUND: We need to sign in as the passenger first?
        // We don't have passenger password.

        // Alternative: The user asked to "put some data to database".
        // I already provided SQL which they can run in Supabase Editor (which bypasses RLS).
        // If they want a script, this script needs to use SERVICE_ROLE_KEY to bypass RLS.
        // I DON'T HAVE THE SERVICE ROLE KEY. I only have Anon Key.

        // Conclusion: I cannot programmatically insert data from here without a Service Key or User Password.
        // I MUST instruct the user to use the SQL Editor.

        console.log('⚠️ NOTE: Because of Row Level Security (RLS), this script might fail to insert records if you are not logged in.');
        console.log('⚠️ Attempting insert...');

        const { data: inserts, error: insertError } = await supabase
            .from('bookings')
            .insert(bookings)
            .select();

        if (insertError) {
            console.error('❌ Insert failed (expected due to RLS):', insertError.message);
            console.log('\n💡 SOLUTION: Please run the SQL script provided earlier in Supabase SQL Editor.');
            console.log('   Script Path: driver-app/scripts/seed_dashboard_data.sql');
        } else {
            console.log('✅ Successfully inserted bookings:', inserts.length);
        }

    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

seedData();
