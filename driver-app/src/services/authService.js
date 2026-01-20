import { supabase } from './supabase';

/**
 * Auth Service - Supabase Authentication
 * Supports Email/Password and Phone OTP authentication
 */

// ==================== EMAIL AUTH ====================

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

// ==================== TEST/DEMO CREDENTIALS ====================
const TEST_USERS = {
    'passenger@test.com': { id: 'test-passenger-id', role: 'passenger' },
    'crew@test.com': { id: 'test-crew-id', role: 'crew' },
    'owner@test.com': { id: 'test-owner-id', role: 'owner' },
    'admin@test.com': { id: 'test-admin-id', role: 'admin' },
};

const TEST_OTP = '123456';

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
    // DEMO BYPASS
    if (TEST_USERS[email] && password === 'Test@123') {
        console.log('🔹 Using Demo Login for:', email);
        const user = TEST_USERS[email];
        return {
            user: { id: user.id, email, role: user.role },
            session: { access_token: 'mock-token', user: { id: user.id, email, role: user.role } }
        };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

// ==================== PHONE OTP AUTH ====================

/**
 * Send OTP to phone number
 * @param {string} phone - Phone number with country code (e.g., +94771234567)
 */
export const signInWithPhone = async (phone) => {
    // DEMO BYPASS
    if (phone.endsWith('000000')) { // Test numbers ending in 000000
        console.log('🔹 Using Demo OTP for:', phone);
        return { message: 'Demo OTP sent' };
    }

    const { data, error } = await supabase.auth.signInWithOtp({
        phone,
    });
    if (error) throw error;
    return data;
};

/**
 * Verify OTP for phone authentication
 * @param {string} phone - Phone number with country code
 * @param {string} token - OTP code received via SMS
 */
export const verifyOtp = async (phone, token) => {
    // DEMO BYPASS
    if (token === TEST_OTP) {
        console.log('🔹 Using Demo OTP Verify');
        return {
            user: { id: 'test-phone-user', phone, role: 'passenger' },
            session: { access_token: 'mock-token', user: { id: 'test-phone-user', phone, role: 'passenger' } }
        };
    }

    const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
    });
    if (error) throw error;
    return data;
};

// ==================== SESSION ====================

/**
 * Sign out current user
 */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

/**
 * Get current session
 */
export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
};

// ==================== PROFILE ====================

/**
 * Get user profile from profiles table
 */
export const getProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
};

/**
 * Update user profile
 */
export const updateProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
        .select()
        .single();
    if (error) throw error;
    return data;
};

/**
 * Create initial profile (called after signup if trigger doesn't exist)
 */
export const createProfile = async (userId, profileData) => {
    const { data, error } = await supabase
        .from('profiles')
        .insert({ id: userId, ...profileData })
        .select()
        .single();
    if (error) throw error;
    return data;
};

export default {
    signUpWithEmail,
    signInWithEmail,
    signInWithPhone,
    verifyOtp,
    signOut,
    getSession,
    getProfile,
    updateProfile,
    createProfile,
};
