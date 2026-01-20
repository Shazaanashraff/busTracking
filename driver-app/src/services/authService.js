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

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
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
