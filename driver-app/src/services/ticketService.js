import { supabase } from './supabase';
import { getMyAssignedBuses } from './crewService';

/**
 * Ticket Scanning Service
 * Handles QR code validation for passenger boarding
 */

/**
 * Scan result types
 */
export const SCAN_RESULT = {
    VALID: 'VALID',
    INVALID_BOOKING: 'INVALID_BOOKING',
    WRONG_BUS: 'WRONG_BUS',
    ALREADY_USED: 'ALREADY_USED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',
    NOT_FOUND: 'NOT_FOUND',
};

/**
 * Validate a scanned ticket QR code
 * @param {string} qrData - The QR code data (booking_id)
 * @param {string} crewBusId - The bus ID the crew is assigned to
 * @returns {object} { valid, result, booking, message }
 */
export const validateTicket = async (qrData, crewBusId) => {
    try {
        // Parse QR data - it should be the booking_id
        const bookingId = qrData.trim();

        if (!bookingId) {
            return {
                valid: false,
                result: SCAN_RESULT.INVALID_BOOKING,
                booking: null,
                message: 'Invalid QR code',
            };
        }

        // Fetch booking
        const { data: booking, error } = await supabase
            .from('bookings')
            .select(`
        id,
        bus_id,
        seat_number,
        status,
        pickup_status,
        trip_date,
        passenger:passenger_id (
          id,
          name,
          phone
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
            .eq('id', bookingId)
            .single();

        if (error || !booking) {
            return {
                valid: false,
                result: SCAN_RESULT.NOT_FOUND,
                booking: null,
                message: 'Booking not found',
            };
        }

        // Check if booking is for today
        const today = new Date().toISOString().split('T')[0];
        if (booking.trip_date !== today) {
            return {
                valid: false,
                result: SCAN_RESULT.EXPIRED,
                booking,
                message: `Ticket is for ${booking.trip_date}, not today`,
            };
        }

        // Check if bus matches
        if (booking.bus_id !== crewBusId) {
            return {
                valid: false,
                result: SCAN_RESULT.WRONG_BUS,
                booking,
                message: 'Ticket is for a different bus',
            };
        }

        // Check booking status
        if (booking.status === 'Cancelled') {
            return {
                valid: false,
                result: SCAN_RESULT.CANCELLED,
                booking,
                message: 'Booking has been cancelled',
            };
        }

        if (booking.status === 'Completed') {
            return {
                valid: false,
                result: SCAN_RESULT.ALREADY_USED,
                booking,
                message: 'Ticket has already been used',
            };
        }

        if (booking.status !== 'Booked') {
            return {
                valid: false,
                result: SCAN_RESULT.INVALID_BOOKING,
                booking,
                message: `Invalid booking status: ${booking.status}`,
            };
        }

        // Valid ticket!
        return {
            valid: true,
            result: SCAN_RESULT.VALID,
            booking,
            message: 'Valid ticket - Allow boarding',
        };

    } catch (error) {
        console.error('Ticket validation error:', error);
        return {
            valid: false,
            result: SCAN_RESULT.INVALID_BOOKING,
            booking: null,
            message: 'Error validating ticket',
        };
    }
};

/**
 * Validate ticket and automatically get crew's bus
 */
export const validateTicketForCrew = async (qrData) => {
    // Get crew's assigned bus
    const assignments = await getMyAssignedBuses();

    if (!assignments || assignments.length === 0) {
        return {
            valid: false,
            result: SCAN_RESULT.INVALID_BOOKING,
            booking: null,
            message: 'You are not assigned to any bus',
        };
    }

    // Get the first (primary) bus assignment
    const primaryBus = assignments[0].bus;

    if (!primaryBus?.id) {
        return {
            valid: false,
            result: SCAN_RESULT.INVALID_BOOKING,
            booking: null,
            message: 'Invalid bus assignment',
        };
    }

    return validateTicket(qrData, primaryBus.id);
};

/**
 * Mark ticket as used (boarding complete)
 */
export const markTicketUsed = async (bookingId) => {
    const { data, error } = await supabase
        .from('bookings')
        .update({
            status: 'Completed',
            pickup_status: 'Confirmed',
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Get scan history for today (crew)
 */
export const getTodayScanHistory = async (busId) => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('bookings')
        .select(`
      id,
      seat_number,
      status,
      updated_at,
      passenger:passenger_id (
        name
      )
    `)
        .eq('bus_id', busId)
        .eq('trip_date', today)
        .eq('status', 'Completed')
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

/**
 * Get boarding statistics for today
 */
export const getTodayBoardingStats = async (busId) => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('bookings')
        .select('status')
        .eq('bus_id', busId)
        .eq('trip_date', today);

    if (error) throw error;

    const stats = {
        total: data?.length || 0,
        boarded: 0,
        pending: 0,
        cancelled: 0,
    };

    data?.forEach(booking => {
        if (booking.status === 'Completed') stats.boarded++;
        else if (booking.status === 'Booked') stats.pending++;
        else if (booking.status === 'Cancelled') stats.cancelled++;
    });

    return stats;
};

export default {
    SCAN_RESULT,
    validateTicket,
    validateTicketForCrew,
    markTicketUsed,
    getTodayScanHistory,
    getTodayBoardingStats,
};
