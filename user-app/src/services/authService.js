import { supabase } from './supabase';

/**
 * Auth Service for Passenger App
 * Phone OTP and Email authentication
 */

// ==================== PHONE OTP AUTH ====================

export const signInWithPhone = async (phone) => {
    const { data, error } = await supabase.auth.signInWithOtp({
        phone,
    });
    if (error) throw error;
    return data;
};

export const verifyOtp = async (phone, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
    });
    if (error) throw error;
    return data;
};

// ==================== EMAIL AUTH ====================

export const signUpWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

export const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

// ==================== SESSION ====================

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
};

// ==================== PROFILE ====================

export const getProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const updateProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
        .select()
        .single();
    if (error) throw error;
    return data;
};

export default {
    signInWithPhone,
    verifyOtp,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    getSession,
    getProfile,
    updateProfile,
};
