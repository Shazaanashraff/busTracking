import { supabase } from './supabase';

/**
 * Crew Service - Manage bus crew assignments
 */

// ==================== CREW MEMBER FUNCTIONS ====================

/**
 * Get buses assigned to current crew member
 */
export const getMyAssignedBuses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('bus_crews')
        .select(`
      id,
      role,
      is_active,
      assigned_at,
      bus:buses (
        id,
        plate_number,
        route_number,
        bus_name,
        capacity,
        status
      )
    `)
        .eq('profile_id', user.id)
        .eq('is_active', true);

    if (error) throw error;
    return data || [];
};

/**
 * Get current crew member's primary bus (first active assignment)
 */
export const getMyPrimaryBus = async () => {
    const assignments = await getMyAssignedBuses();
    return assignments.length > 0 ? assignments[0].bus : null;
};

// ==================== OWNER FUNCTIONS ====================

/**
 * Get all crew for a specific bus (owner only)
 */
export const getCrewForBus = async (busId) => {
    const { data, error } = await supabase
        .from('bus_crews')
        .select(`
      id,
      role,
      is_active,
      assigned_at,
      profile:profiles (
        id,
        name,
        phone
      )
    `)
        .eq('bus_id', busId)
        .order('assigned_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

/**
 * Assign a crew member to a bus (owner only)
 */
export const assignCrewToBus = async (profileId, busId, role = 'driver') => {
    const { data, error } = await supabase
        .from('bus_crews')
        .insert({
            profile_id: profileId,
            bus_id: busId,
            role,
            is_active: true,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update crew assignment (owner only)
 */
export const updateCrewAssignment = async (assignmentId, updates) => {
    const { data, error } = await supabase
        .from('bus_crews')
        .update(updates)
        .eq('id', assignmentId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Deactivate crew assignment (soft delete, owner only)
 */
export const deactivateCrewAssignment = async (assignmentId) => {
    const { data, error } = await supabase
        .from('bus_crews')
        .update({ is_active: false })
        .eq('id', assignmentId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Remove crew from bus (hard delete, owner only)
 */
export const removeCrewFromBus = async (assignmentId) => {
    const { error } = await supabase
        .from('bus_crews')
        .delete()
        .eq('id', assignmentId);

    if (error) throw error;
    return true;
};

/**
 * Get all crew for owner's buses
 */
export const getAllMyCrew = async () => {
    const { data, error } = await supabase
        .from('bus_crews')
        .select(`
      id,
      role,
      is_active,
      assigned_at,
      profile:profiles (
        id,
        name,
        phone
      ),
      bus:buses (
        id,
        plate_number,
        route_number,
        bus_name
      )
    `)
        .order('assigned_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export default {
    getMyAssignedBuses,
    getMyPrimaryBus,
    getCrewForBus,
    assignCrewToBus,
    updateCrewAssignment,
    deactivateCrewAssignment,
    removeCrewFromBus,
    getAllMyCrew,
};
