import { supabase } from './supabase';

/**
 * Live Tracking Service for Passengers
 * Subscribe to bus locations and status in real-time
 */

// ==================== GET LOCATION ====================

export const getBusLocation = async (busId) => {
    const { data, error } = await supabase
        .from('bus_locations')
        .select(`
      *,
      current_stage:current_stage_id (
        stage_name,
        stage_name_sinhala
      ),
      next_stage:next_stage_id (
        stage_name,
        stage_name_sinhala
      )
    `)
        .eq('bus_id', busId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const getBusStatus = async (busId) => {
    const { data, error } = await supabase
        .from('bus_status')
        .select('*')
        .eq('bus_id', busId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// ==================== REALTIME SUBSCRIPTIONS ====================

export const subscribeToBusLocation = (busId, onUpdate) => {
    const subscription = supabase
        .channel(`passenger_bus_location_${busId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bus_locations',
                filter: `bus_id=eq.${busId}`,
            },
            (payload) => {
                console.log('Bus location update:', payload);
                onUpdate(payload.new);
            }
        )
        .subscribe();

    return subscription;
};

export const subscribeToBusStatus = (busId, onUpdate) => {
    const subscription = supabase
        .channel(`passenger_bus_status_${busId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bus_status',
                filter: `bus_id=eq.${busId}`,
            },
            (payload) => {
                console.log('Bus status update:', payload);
                onUpdate(payload.new);
            }
        )
        .subscribe();

    return subscription;
};

export const subscribeToMultipleBuses = (busIds, onLocationUpdate, onStatusUpdate) => {
    const locationSub = supabase
        .channel('passenger_multi_locations')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bus_locations',
            },
            (payload) => {
                if (busIds.includes(payload.new?.bus_id)) {
                    onLocationUpdate(payload.new);
                }
            }
        )
        .subscribe();

    const statusSub = supabase
        .channel('passenger_multi_status')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bus_status',
            },
            (payload) => {
                if (busIds.includes(payload.new?.bus_id)) {
                    onStatusUpdate(payload.new);
                }
            }
        )
        .subscribe();

    return { locationSub, statusSub };
};

export const unsubscribe = async (subscription) => {
    if (subscription) {
        await supabase.removeChannel(subscription);
    }
};

// ==================== CROWD LEVEL DISPLAY ====================

export const CROWD_LEVELS = {
    FREE: 'Free',
    MEDIUM: 'Medium',
    FULL: 'Full',
};

export const getCrowdLevelInfo = (level) => {
    switch (level) {
        case CROWD_LEVELS.FREE:
            return { color: '#22c55e', icon: '🟢', text: 'Seats Available', textSinhala: 'ආසන තිබේ' };
        case CROWD_LEVELS.MEDIUM:
            return { color: '#f59e0b', icon: '🟡', text: 'Getting Crowded', textSinhala: 'තදබදයි' };
        case CROWD_LEVELS.FULL:
            return { color: '#ef4444', icon: '🔴', text: 'Full', textSinhala: 'පිරී ඇත' };
        default:
            return { color: '#6b7280', icon: '⚪', text: 'Unknown', textSinhala: 'නොදනී' };
    }
};

// ==================== DISTANCE & ETA ====================

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

export const calculateETA = (distanceKm, speedKmh) => {
    if (speedKmh <= 0) return null;
    return Math.round((distanceKm / speedKmh) * 60);
};

export default {
    getBusLocation,
    getBusStatus,
    subscribeToBusLocation,
    subscribeToBusStatus,
    subscribeToMultipleBuses,
    unsubscribe,
    CROWD_LEVELS,
    getCrowdLevelInfo,
    calculateDistance,
    calculateETA,
};
