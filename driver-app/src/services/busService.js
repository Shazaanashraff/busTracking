import { supabase } from './supabase';
import { getMyOwner } from './ownerService';

/**
 * Bus Service - Manage buses for owners
 */

/**
 * Get all buses for current owner
 */
export const getMyBuses = async () => {
    const { data, error } = await supabase
        .from('buses')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

/**
 * Get a single bus by ID
 */
export const getBusById = async (busId) => {
    const { data, error } = await supabase
        .from('buses')
        .select('*')
        .eq('id', busId)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Add a new bus
 */
export const addBus = async (busData) => {
    const owner = await getMyOwner();
    if (!owner) throw new Error('Owner record not found. Please set up your owner profile first.');

    const { data, error } = await supabase
        .from('buses')
        .insert({
            owner_id: owner.id,
            plate_number: busData.plateNumber,
            route_number: busData.routeNumber,
            bus_name: busData.busName,
            capacity: busData.capacity || 50,
            status: busData.status || 'active',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update a bus
 */
export const updateBus = async (busId, busData) => {
    const { data, error } = await supabase
        .from('buses')
        .update({
            plate_number: busData.plateNumber,
            route_number: busData.routeNumber,
            bus_name: busData.busName,
            capacity: busData.capacity,
            status: busData.status,
            updated_at: new Date().toISOString(),
        })
        .eq('id', busId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Delete a bus
 */
export const deleteBus = async (busId) => {
    const { error } = await supabase
        .from('buses')
        .delete()
        .eq('id', busId);

    if (error) throw error;
    return true;
};

/**
 * Get bus count for current owner
 */
export const getBusCount = async () => {
    const { count, error } = await supabase
        .from('buses')
        .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
};

/**
 * Get active buses count
 */
export const getActiveBusCount = async () => {
    const { count, error } = await supabase
        .from('buses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

    if (error) throw error;
    return count || 0;
};

export default {
    getMyBuses,
    getBusById,
    addBus,
    updateBus,
    deleteBus,
    getBusCount,
    getActiveBusCount,
};
