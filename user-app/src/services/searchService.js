import { supabase } from './supabase';

/**
 * Route & Bus Search Service for Passengers
 */

// ==================== ROUTE SEARCH ====================

export const getAllRoutes = async () => {
    const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('is_active', true)
        .order('route_number');

    if (error) throw error;
    return data || [];
};

export const searchRoutes = async (query) => {
    const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('is_active', true)
        .or(`route_number.ilike.%${query}%,name.ilike.%${query}%,start_location.ilike.%${query}%,end_location.ilike.%${query}%`)
        .order('route_number')
        .limit(20);

    if (error) throw error;
    return data || [];
};

export const getRouteById = async (routeId) => {
    const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('id', routeId)
        .single();

    if (error) throw error;
    return data;
};

// ==================== STAGES ====================

export const getStagesForRoute = async (routeId) => {
    const { data, error } = await supabase
        .from('stages')
        .select('*')
        .eq('route_id', routeId)
        .order('order_no');

    if (error) throw error;
    return data || [];
};

export const getRouteWithStages = async (routeId) => {
    const { data, error } = await supabase
        .from('routes')
        .select(`
      *,
      stages (
        id,
        stage_name,
        stage_name_sinhala,
        order_no,
        latitude,
        longitude,
        is_major_stop
      )
    `)
        .eq('id', routeId)
        .single();

    if (error) throw error;

    if (data?.stages) {
        data.stages.sort((a, b) => a.order_no - b.order_no);
    }

    return data;
};

// ==================== BUS SEARCH ====================

export const getBusesOnRoute = async (routeId) => {
    const { data, error } = await supabase
        .from('buses')
        .select(`
      id,
      plate_number,
      bus_name,
      route_number,
      capacity,
      status
    `)
        .eq('route_id', routeId)
        .eq('status', 'active');

    if (error) throw error;
    return data || [];
};

export const getBusesWithStatus = async (routeId) => {
    const { data: buses, error } = await supabase
        .from('buses')
        .select('id, plate_number, bus_name, route_number, capacity')
        .eq('route_id', routeId)
        .eq('status', 'active');

    if (error) throw error;

    // Get status for these buses
    const busIds = buses?.map(b => b.id) || [];
    if (busIds.length === 0) return [];

    const { data: statuses } = await supabase
        .from('bus_status')
        .select('bus_id, crowd_level, is_active, last_stop')
        .in('bus_id', busIds);

    const { data: locations } = await supabase
        .from('bus_locations')
        .select('bus_id, latitude, longitude, speed, is_moving, current_stage_id')
        .in('bus_id', busIds);

    // Merge data
    return buses?.map(bus => ({
        ...bus,
        status: statuses?.find(s => s.bus_id === bus.id) || null,
        location: locations?.find(l => l.bus_id === bus.id) || null,
    })) || [];
};

export default {
    getAllRoutes,
    searchRoutes,
    getRouteById,
    getStagesForRoute,
    getRouteWithStages,
    getBusesOnRoute,
    getBusesWithStatus,
};
