import { supabase } from './supabase';

/**
 * Route Service - Routes and Stages Management
 * Sri Lankan-style stage-based tracking
 */

// ==================== ROUTES ====================

/**
 * Get all routes
 */
export const getAllRoutes = async () => {
    const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('is_active', true)
        .order('route_number');

    if (error) throw error;
    return data || [];
};

/**
 * Get route by ID
 */
export const getRouteById = async (routeId) => {
    const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('id', routeId)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Get route by route number
 */
export const getRouteByNumber = async (routeNumber) => {
    const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('route_number', routeNumber)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

/**
 * Search routes by number or name
 */
export const searchRoutes = async (query) => {
    const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('is_active', true)
        .or(`route_number.ilike.%${query}%,name.ilike.%${query}%`)
        .order('route_number')
        .limit(20);

    if (error) throw error;
    return data || [];
};

// ==================== STAGES ====================

/**
 * Get all stages for a route (ordered)
 */
export const getStagesForRoute = async (routeId) => {
    const { data, error } = await supabase
        .from('stages')
        .select('*')
        .eq('route_id', routeId)
        .order('order_no');

    if (error) throw error;
    return data || [];
};

/**
 * Get major stops only for a route
 */
export const getMajorStops = async (routeId) => {
    const { data, error } = await supabase
        .from('stages')
        .select('*')
        .eq('route_id', routeId)
        .eq('is_major_stop', true)
        .order('order_no');

    if (error) throw error;
    return data || [];
};

/**
 * Get route with all stages
 */
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

    // Sort stages by order_no
    if (data?.stages) {
        data.stages.sort((a, b) => a.order_no - b.order_no);
    }

    return data;
};

// ==================== STAGE TRACKING ====================

/**
 * Update current stage for a bus (crew function)
 */
export const updateBusCurrentStage = async (busId, currentStageId, nextStageId = null) => {
    const { data, error } = await supabase
        .from('bus_locations')
        .update({
            current_stage_id: currentStageId,
            next_stage_id: nextStageId,
        })
        .eq('bus_id', busId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Get bus current stage info
 */
export const getBusCurrentStage = async (busId) => {
    const { data, error } = await supabase
        .from('bus_locations')
        .select(`
      bus_id,
      current_stage:current_stage_id (
        id,
        stage_name,
        stage_name_sinhala,
        order_no
      ),
      next_stage:next_stage_id (
        id,
        stage_name,
        stage_name_sinhala,
        order_no
      )
    `)
        .eq('bus_id', busId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

/**
 * Find nearest stage based on coordinates
 */
export const findNearestStage = async (routeId, latitude, longitude) => {
    const stages = await getStagesForRoute(routeId);

    if (!stages.length) return null;

    let nearest = null;
    let minDistance = Infinity;

    for (const stage of stages) {
        if (stage.latitude && stage.longitude) {
            const distance = calculateDistance(
                latitude, longitude,
                stage.latitude, stage.longitude
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearest = { ...stage, distance };
            }
        }
    }

    return nearest;
};

// ==================== UTILITY ====================

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default {
    getAllRoutes,
    getRouteById,
    getRouteByNumber,
    searchRoutes,
    getStagesForRoute,
    getMajorStops,
    getRouteWithStages,
    updateBusCurrentStage,
    getBusCurrentStage,
    findNearestStage,
};
