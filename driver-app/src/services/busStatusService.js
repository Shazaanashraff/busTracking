import { supabase } from './supabase';

/**
 * Bus Status Service - Crowd Level Tracking
 * Crew updates, passengers see live
 */

export const CROWD_LEVELS = {
    FREE: 'Free',
    MEDIUM: 'Medium',
    FULL: 'Full',
};

// ==================== CREW FUNCTIONS ====================

/**
 * Update crowd level for a bus
 */
export const updateCrowdLevel = async (busId, crowdLevel, passengerCount = null) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('bus_status')
        .upsert({
            bus_id: busId,
            crowd_level: crowdLevel,
            passenger_count: passengerCount,
            updated_by: user?.id,
            is_active: true,
        }, { onConflict: 'bus_id' })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Quick update buttons
 */
export const setFree = async (busId) => updateCrowdLevel(busId, CROWD_LEVELS.FREE);
export const setMedium = async (busId) => updateCrowdLevel(busId, CROWD_LEVELS.MEDIUM);
export const setFull = async (busId) => updateCrowdLevel(busId, CROWD_LEVELS.FULL);

/**
 * Update passenger count (also auto-calculates crowd level)
 */
export const updatePassengerCount = async (busId, count, capacity = 50) => {
    let crowdLevel;
    const ratio = count / capacity;

    if (ratio < 0.5) {
        crowdLevel = CROWD_LEVELS.FREE;
    } else if (ratio < 0.85) {
        crowdLevel = CROWD_LEVELS.MEDIUM;
    } else {
        crowdLevel = CROWD_LEVELS.FULL;
    }

    return updateCrowdLevel(busId, crowdLevel, count);
};

/**
 * Update last stop
 */
export const updateLastStop = async (busId, stopName) => {
    const { data, error } = await supabase
        .from('bus_status')
        .upsert({
            bus_id: busId,
            last_stop: stopName,
        }, { onConflict: 'bus_id' })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Set bus as inactive (trip ended)
 */
export const setBusInactive = async (busId) => {
    const { data, error } = await supabase
        .from('bus_status')
        .update({ is_active: false })
        .eq('bus_id', busId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ==================== PASSENGER FUNCTIONS ====================

/**
 * Get bus status
 */
export const getBusStatus = async (busId) => {
    const { data, error } = await supabase
        .from('bus_status')
        .select('*')
        .eq('bus_id', busId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

/**
 * Get status for multiple buses
 */
export const getMultipleBusStatus = async (busIds) => {
    const { data, error } = await supabase
        .from('bus_status')
        .select('*')
        .in('bus_id', busIds);

    if (error) throw error;
    return data || [];
};

// ==================== REALTIME SUBSCRIPTIONS ====================

/**
 * Subscribe to bus status updates (passengers use this)
 */
export const subscribeToBusStatus = (busId, onUpdate) => {
    const subscription = supabase
        .channel(`bus_status_${busId}`)
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

/**
 * Subscribe to all bus status updates on a route
 */
export const subscribeToRouteStatus = (onUpdate) => {
    const subscription = supabase
        .channel('all_bus_status')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bus_status',
            },
            (payload) => {
                onUpdate(payload.new);
            }
        )
        .subscribe();

    return subscription;
};

/**
 * Unsubscribe
 */
export const unsubscribeFromStatus = async (subscription) => {
    if (subscription) {
        await supabase.removeChannel(subscription);
    }
};

// ==================== UTILITY ====================

/**
 * Get crowd level display info
 */
export const getCrowdLevelInfo = (level) => {
    switch (level) {
        case CROWD_LEVELS.FREE:
            return { color: '#22c55e', icon: '🟢', text: 'Free - Seats Available' };
        case CROWD_LEVELS.MEDIUM:
            return { color: '#f59e0b', icon: '🟡', text: 'Medium - Getting Crowded' };
        case CROWD_LEVELS.FULL:
            return { color: '#ef4444', icon: '🔴', text: 'Full - Standing Only' };
        default:
            return { color: '#6b7280', icon: '⚪', text: 'Unknown' };
    }
};

export default {
    CROWD_LEVELS,
    updateCrowdLevel,
    setFree,
    setMedium,
    setFull,
    updatePassengerCount,
    updateLastStop,
    setBusInactive,
    getBusStatus,
    getMultipleBusStatus,
    subscribeToBusStatus,
    subscribeToRouteStatus,
    unsubscribeFromStatus,
    getCrowdLevelInfo,
};
