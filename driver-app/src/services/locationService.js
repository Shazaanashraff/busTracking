import { supabase } from './supabase';

/**
 * Location Service - Live Bus Tracking
 * Handles location updates and real-time subscriptions
 */

// ==================== CREW: UPDATE LOCATION ====================

/**
 * Update bus location (called every 5 seconds by crew app)
 * Uses upsert to create or update the location record
 */
export const updateBusLocation = async (busId, locationData) => {
    const { data, error } = await supabase
        .from('bus_locations')
        .upsert({
            bus_id: busId,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            speed: locationData.speed || 0,
            heading: locationData.heading || 0,
            accuracy: locationData.accuracy,
            is_moving: locationData.speed > 1, // Consider moving if speed > 1 km/h
        }, { onConflict: 'bus_id' })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Stop tracking (set speed to 0, is_moving to false)
 */
export const stopTracking = async (busId) => {
    const { data, error } = await supabase
        .from('bus_locations')
        .update({
            speed: 0,
            is_moving: false,
        })
        .eq('bus_id', busId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ==================== PASSENGER: GET LOCATION ====================

/**
 * Get current location of a bus
 */
export const getBusLocation = async (busId) => {
    const { data, error } = await supabase
        .from('bus_locations')
        .select('*')
        .eq('bus_id', busId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

/**
 * Get locations of multiple buses
 */
export const getMultipleBusLocations = async (busIds) => {
    const { data, error } = await supabase
        .from('bus_locations')
        .select('*')
        .in('bus_id', busIds);

    if (error) throw error;
    return data || [];
};

// ==================== REALTIME SUBSCRIPTIONS ====================

/**
 * Subscribe to real-time location updates for a specific bus
 * @param {string} busId - The bus ID to track
 * @param {function} onUpdate - Callback when location updates
 * @returns {object} Subscription object (call .unsubscribe() to stop)
 */
export const subscribeToBusLocation = (busId, onUpdate) => {
    const subscription = supabase
        .channel(`bus_location_${busId}`)
        .on(
            'postgres_changes',
            {
                event: '*', // Listen to INSERT, UPDATE, DELETE
                schema: 'public',
                table: 'bus_locations',
                filter: `bus_id=eq.${busId}`,
            },
            (payload) => {
                console.log('Location update received:', payload);
                onUpdate(payload.new);
            }
        )
        .subscribe();

    return subscription;
};

/**
 * Subscribe to real-time location updates for multiple buses
 * @param {string[]} busIds - Array of bus IDs to track
 * @param {function} onUpdate - Callback when any location updates
 * @returns {object} Subscription object
 */
export const subscribeToMultipleBuses = (busIds, onUpdate) => {
    const subscription = supabase
        .channel('multi_bus_tracking')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bus_locations',
            },
            (payload) => {
                // Filter to only tracked buses
                if (busIds.includes(payload.new?.bus_id)) {
                    console.log('Location update for tracked bus:', payload);
                    onUpdate(payload.new);
                }
            }
        )
        .subscribe();

    return subscription;
};

/**
 * Unsubscribe from a location channel
 */
export const unsubscribeFromLocation = async (subscription) => {
    if (subscription) {
        await supabase.removeChannel(subscription);
    }
};

// ==================== UTILITY ====================

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @returns Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Calculate ETA based on distance and speed
 * @returns ETA in minutes
 */
export const calculateETA = (distanceKm, speedKmh) => {
    if (speedKmh <= 0) return null;
    return Math.round((distanceKm / speedKmh) * 60);
};

export default {
    updateBusLocation,
    stopTracking,
    getBusLocation,
    getMultipleBusLocations,
    subscribeToBusLocation,
    subscribeToMultipleBuses,
    unsubscribeFromLocation,
    calculateDistance,
    calculateETA,
};
