import { supabase } from './supabase';
import { Linking, Platform } from 'react-native';

/**
 * Pickup Service - Crew Pickup Confirmation Logic
 * Handles booking confirmations, passenger calls, and status updates
 */

// ==================== FETCH PENDING BOOKINGS ====================

/**
 * Get all pending bookings for crew's assigned bus
 * Returns bookings where status = 'Booked' and pickup_status = 'Pending'
 */
export const getPendingPickups = async (busId) => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('bookings')
        .select(`
      id,
      seat_number,
      pickup_status,
      status,
      amount,
      booked_at,
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
        .eq('status', 'Booked')
        .eq('trip_date', today)
        .order('booked_at', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Get bookings grouped by pickup status
 */
export const getBookingsByStatus = async (busId) => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('bookings')
        .select(`
      id,
      seat_number,
      pickup_status,
      status,
      amount,
      booked_at,
      passenger:passenger_id (
        id,
        name,
        phone
      ),
      pickup:pickup_stage (
        stage_name,
        stage_name_sinhala,
        order_no
      )
    `)
        .eq('bus_id', busId)
        .eq('trip_date', today)
        .in('status', ['Booked', 'Completed'])
        .order('booked_at', { ascending: true });

    if (error) throw error;

    // Group by pickup_status
    const grouped = {
        pending: [],
        confirmed: [],
        noAnswer: [],
        cancelled: [],
    };

    data?.forEach(booking => {
        switch (booking.pickup_status) {
            case 'Pending':
                grouped.pending.push(booking);
                break;
            case 'Confirmed':
                grouped.confirmed.push(booking);
                break;
            case 'NoAnswer':
                grouped.noAnswer.push(booking);
                break;
            case 'Cancelled':
                grouped.cancelled.push(booking);
                break;
        }
    });

    return grouped;
};

// ==================== PICKUP STATUS UPDATES ====================

/**
 * Confirm pickup
 */
export const confirmPickup = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({
            pickup_status: 'Confirmed',
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Mark as no answer
 */
export const markNoAnswer = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({
            pickup_status: 'NoAnswer',
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Cancel pickup (by crew)
 */
export const cancelPickup = async (bookingId, reason = null) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({
            pickup_status: 'Cancelled',
            status: 'Cancelled',
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Mark passenger as picked up (on board)
 */
export const markPickedUp = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({
            pickup_status: 'Confirmed',
            status: 'Completed',
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ==================== PASSENGER CALLING ====================

/**
 * Get masked phone number for display
 * Example: +94771234567 -> +94 *** **67
 */
export const getMaskedPhone = (phone) => {
    if (!phone || phone.length < 8) return '***';

    const start = phone.slice(0, 4);
    const end = phone.slice(-2);
    return `${start} *** **${end}`;
};

/**
 * Initiate masked call to passenger via Edge Function
 * Both parties see "Bus App" caller ID, no numbers exposed
 * 
 * Flow: Crew App → Edge Function → Twilio → Passenger
 */
export const callPassengerMasked = async (bookingId) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('masked-call', {
        body: { bookingId },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || 'Call failed');

    return data;
};

/**
 * Fallback: Direct call (exposes number - use only if masked not available)
 */
export const callPassengerDirect = async (phone) => {
    if (!phone) {
        throw new Error('No phone number available');
    }

    const phoneUrl = Platform.select({
        ios: `tel:${phone}`,
        android: `tel:${phone}`,
        default: `tel:${phone}`,
    });

    const canOpen = await Linking.canOpenURL(phoneUrl);
    if (canOpen) {
        await Linking.openURL(phoneUrl);
        return true;
    } else {
        throw new Error('Cannot open phone dialer');
    }
};

/**
 * Send WhatsApp message to passenger (still uses real number but via WhatsApp)
 */
export const whatsappPassenger = async (phone, message = '') => {
    if (!phone) {
        throw new Error('No phone number available');
    }

    // Remove + and spaces from phone number
    const cleanPhone = phone.replace(/[\s+]/g, '');
    const encodedMessage = encodeURIComponent(message || 'Hello! Regarding your bus booking...');

    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;

    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
        await Linking.openURL(whatsappUrl);
        return true;
    } else {
        throw new Error('WhatsApp is not installed');
    }
};

// ==================== STATISTICS ====================

/**
 * Get pickup stats for today
 */
export const getTodayPickupStats = async (busId) => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('bookings')
        .select('pickup_status, status')
        .eq('bus_id', busId)
        .eq('trip_date', today);

    if (error) throw error;

    const stats = {
        total: data?.length || 0,
        pending: 0,
        confirmed: 0,
        noAnswer: 0,
        cancelled: 0,
        completed: 0,
    };

    data?.forEach(booking => {
        if (booking.pickup_status === 'Pending') stats.pending++;
        else if (booking.pickup_status === 'Confirmed') stats.confirmed++;
        else if (booking.pickup_status === 'NoAnswer') stats.noAnswer++;
        else if (booking.pickup_status === 'Cancelled') stats.cancelled++;

        if (booking.status === 'Completed') stats.completed++;
    });

    return stats;
};

export default {
    getPendingPickups,
    getBookingsByStatus,
    confirmPickup,
    markNoAnswer,
    cancelPickup,
    markPickedUp,
    getMaskedPhone,
    callPassengerMasked,
    callPassengerDirect,
    whatsappPassenger,
    getTodayPickupStats,
};
