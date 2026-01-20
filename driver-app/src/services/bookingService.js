import { supabase } from './supabase';

/**
 * Booking Service - Manage bus bookings
 */

// ==================== PASSENGER FUNCTIONS ====================

/**
 * Create a new booking (passenger)
 */
export const createBooking = async (bookingData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('bookings')
        .insert({
            bus_id: bookingData.busId,
            passenger_id: user.id,
            seat_number: bookingData.seatNumber,
            pickup_stage: bookingData.pickupStageId,
            dropoff_stage: bookingData.dropoffStageId,
            trip_date: bookingData.tripDate || new Date().toISOString().split('T')[0],
            amount: bookingData.amount || 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Get passenger's bookings
 */
export const getMyBookings = async (status = null) => {
    let query = supabase
        .from('bookings')
        .select(`
      *,
      bus:buses (
        id,
        plate_number,
        route_number,
        bus_name
      ),
      pickup:pickup_stage (
        stage_name,
        stage_name_sinhala
      ),
      dropoff:dropoff_stage (
        stage_name,
        stage_name_sinhala
      )
    `)
        .order('booked_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};

/**
 * Cancel a booking (passenger)
 */
export const cancelMyBooking = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'Cancelled' })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ==================== CREW/OWNER FUNCTIONS ====================

/**
 * Get bookings for a specific bus
 */
export const getBookingsForBus = async (busId, tripDate = null) => {
    let query = supabase
        .from('bookings')
        .select(`
      *,
      passenger:passenger_id (
        id,
        name,
        phone
      ),
      pickup:pickup_stage (
        stage_name,
        stage_name_sinhala,
        order_no
      ),
      dropoff:dropoff_stage (
        stage_name,
        stage_name_sinhala,
        order_no
      )
    `)
        .eq('bus_id', busId)
        .order('booked_at', { ascending: false });

    if (tripDate) {
        query = query.eq('trip_date', tripDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};

/**
 * Get today's bookings for a bus
 */
export const getTodaysBookings = async (busId) => {
    const today = new Date().toISOString().split('T')[0];
    return getBookingsForBus(busId, today);
};

/**
 * Update pickup status (crew)
 */
export const updatePickupStatus = async (bookingId, pickupStatus) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({ pickup_status: pickupStatus })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Confirm booking (owner/crew)
 */
export const confirmBooking = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({
            pickup_status: 'Confirmed',
            status: 'Booked'
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Mark booking as completed (crew)
 */
export const completeBooking = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'Completed' })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Mark as no-show (crew)
 */
export const markNoShow = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({
            status: 'NoShow',
            pickup_status: 'NoAnswer'
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ==================== OWNER ANALYTICS ====================

/**
 * Get booking stats for owner's buses
 */
export const getBookingStats = async (busId = null, dateFrom = null, dateTo = null) => {
    let query = supabase
        .from('bookings')
        .select('status, amount', { count: 'exact' });

    if (busId) {
        query = query.eq('bus_id', busId);
    }
    if (dateFrom) {
        query = query.gte('trip_date', dateFrom);
    }
    if (dateTo) {
        query = query.lte('trip_date', dateTo);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    const stats = {
        total: count || 0,
        completed: 0,
        cancelled: 0,
        revenue: 0,
    };

    data?.forEach(booking => {
        if (booking.status === 'Completed') {
            stats.completed++;
            stats.revenue += parseFloat(booking.amount) || 0;
        } else if (booking.status === 'Cancelled') {
            stats.cancelled++;
        }
    });

    return stats;
};

// ==================== REALTIME SUBSCRIPTIONS ====================

/**
 * Subscribe to booking updates for a bus (crew/owner)
 */
export const subscribeToBookings = (busId, onUpdate) => {
    const subscription = supabase
        .channel(`bookings_${busId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bookings',
                filter: `bus_id=eq.${busId}`,
            },
            (payload) => {
                console.log('Booking update:', payload);
                onUpdate(payload);
            }
        )
        .subscribe();

    return subscription;
};

export default {
    createBooking,
    getMyBookings,
    cancelMyBooking,
    getBookingsForBus,
    getTodaysBookings,
    updatePickupStatus,
    confirmBooking,
    completeBooking,
    markNoShow,
    getBookingStats,
    subscribeToBookings,
};
