import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yonwlnoiecddokwmqycw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvbndsbm9pZWNkZG9rd21xeWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzYyMDIsImV4cCI6MjA4NDQ1MjIwMn0.D2g6nC57m_7SDHIEOOqPP0SC08jMsx0APRf1ndRR0pY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
