import { supabase } from './supabase';

/**
 * Owner Service - Manage owner profiles
 */

/**
 * Get current user's owner record
 */
export const getMyOwner = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('owners')
        .select('*')
        .eq('profile_id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

/**
 * Create or update owner record for current user
 */
export const upsertOwner = async (ownerData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('owners')
        .upsert({
            profile_id: user.id,
            ...ownerData,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'profile_id' })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update owner's business name
 */
export const updateBusinessName = async (businessName) => {
    const owner = await getMyOwner();
    if (!owner) throw new Error('Owner record not found');

    const { data, error } = await supabase
        .from('owners')
        .update({
            business_name: businessName,
            updated_at: new Date().toISOString()
        })
        .eq('id', owner.id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export default {
    getMyOwner,
    upsertOwner,
    updateBusinessName,
};
