import { supabase } from './supabase';

/**
 * Booking Service for Passengers
 * Create bookings, view history, get QR ticket
 */

// ==================== CREATE BOOKING ====================

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
        .select(`
      *,
      bus:bus_id (
        plate_number,
        bus_name,
        route_number
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
        .single();

    if (error) throw error;
    return data;
};

// ==================== GET BOOKINGS ====================

export const getMyBookings = async () => {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      bus:bus_id (
        id,
        plate_number,
        bus_name,
        route_number
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

    if (error) throw error;
    return data || [];
};

export const getUpcomingBookings = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      bus:bus_id (
        id,
        plate_number,
        bus_name,
        route_number
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
        .gte('trip_date', today)
        .in('status', ['Booked'])
        .order('trip_date', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getPastBookings = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      bus:bus_id (
        plate_number,
        bus_name,
        route_number
      ),
      pickup:pickup_stage (
        stage_name
      ),
      dropoff:dropoff_stage (
        stage_name
      )
    `)
        .or(`trip_date.lt.${today},status.eq.Completed,status.eq.Cancelled`)
        .order('trip_date', { ascending: false })
        .limit(20);

    if (error) throw error;
    return data || [];
};

export const getBookingById = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      bus:bus_id (
        id,
        plate_number,
        bus_name,
        route_number
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
        .eq('id', bookingId)
        .single();

    if (error) throw error;
    return data;
};

// ==================== CANCEL BOOKING ====================

export const cancelBooking = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'Cancelled' })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ==================== QR TICKET ====================

/**
 * Generate QR code data for a booking
 * The QR simply contains the booking ID
 */
export const getTicketQRData = (bookingId) => {
    return bookingId;
};

/**
 * Get ticket details for display
 */
export const getTicketDetails = async (bookingId) => {
    const booking = await getBookingById(bookingId);

    return {
        qrData: getTicketQRData(bookingId),
        bookingId: booking.id,
        busName: booking.bus?.bus_name || booking.bus?.plate_number,
        routeNumber: booking.bus?.route_number,
        pickup: booking.pickup?.stage_name,
        dropoff: booking.dropoff?.stage_name,
        seatNumber: booking.seat_number,
        tripDate: booking.trip_date,
        status: booking.status,
        amount: booking.amount,
    };
};

// ==================== BOOKING STATUS SUBSCRIPTION ====================

export const subscribeToMyBookings = (onUpdate) => {
    const subscription = supabase
        .channel('my_bookings')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bookings',
            },
            (payload) => {
                console.log('Booking update:', payload);
                onUpdate(payload);
            }
        )
        .subscribe();

    return subscription;
};

// ==================== FORMATTING ====================

export const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount || 0).toLocaleString('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'Booked': return '#3b82f6';
        case 'Completed': return '#22c55e';
        case 'Cancelled': return '#ef4444';
        case 'NoShow': return '#f59e0b';
        default: return '#6b7280';
    }
};

export default {
    createBooking,
    getMyBookings,
    getUpcomingBookings,
    getPastBookings,
    getBookingById,
    cancelBooking,
    getTicketQRData,
    getTicketDetails,
    subscribeToMyBookings,
    formatCurrency,
    getStatusColor,
};
