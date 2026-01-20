import { supabase } from './supabase';
import { getMyOwner } from './ownerService';

/**
 * Revenue Service - Owner Only
 * Crew never sees financial data
 */

// ==================== REVENUE QUERIES ====================

/**
 * Get total revenue for all owner's buses
 */
export const getTotalRevenue = async (dateFrom = null, dateTo = null) => {
    const owner = await getMyOwner();
    if (!owner) throw new Error('Owner record not found');

    let query = supabase
        .from('bookings')
        .select('amount, bus_id')
        .in('status', ['Booked', 'Completed']);

    if (dateFrom) {
        query = query.gte('trip_date', dateFrom);
    }
    if (dateTo) {
        query = query.lte('trip_date', dateTo);
    }

    const { data, error } = await query;
    if (error) throw error;

    const total = data?.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0) || 0;
    return total;
};

/**
 * Get revenue for a specific bus
 */
export const getBusRevenue = async (busId, dateFrom = null, dateTo = null) => {
    let query = supabase
        .from('bookings')
        .select('amount')
        .eq('bus_id', busId)
        .in('status', ['Booked', 'Completed']);

    if (dateFrom) {
        query = query.gte('trip_date', dateFrom);
    }
    if (dateTo) {
        query = query.lte('trip_date', dateTo);
    }

    const { data, error } = await query;
    if (error) throw error;

    const total = data?.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0) || 0;
    return total;
};

/**
 * Get today's revenue
 */
export const getTodayRevenue = async () => {
    const today = new Date().toISOString().split('T')[0];
    return getTotalRevenue(today, today);
};

/**
 * Get this week's revenue
 */
export const getWeekRevenue = async () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return getTotalRevenue(
        weekAgo.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
    );
};

/**
 * Get this month's revenue
 */
export const getMonthRevenue = async () => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    return getTotalRevenue(
        monthStart.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
    );
};

// ==================== REVENUE BREAKDOWN ====================

/**
 * Get revenue by bus
 */
export const getRevenueByBus = async (dateFrom = null, dateTo = null) => {
    let query = supabase
        .from('bookings')
        .select(`
      amount,
      bus:bus_id (
        id,
        plate_number,
        bus_name,
        route_number
      )
    `)
        .in('status', ['Booked', 'Completed']);

    if (dateFrom) {
        query = query.gte('trip_date', dateFrom);
    }
    if (dateTo) {
        query = query.lte('trip_date', dateTo);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Group by bus
    const busRevenue = {};
    data?.forEach(booking => {
        const busId = booking.bus?.id;
        if (!busId) return;

        if (!busRevenue[busId]) {
            busRevenue[busId] = {
                bus: booking.bus,
                total: 0,
                bookings: 0,
            };
        }
        busRevenue[busId].total += parseFloat(booking.amount) || 0;
        busRevenue[busId].bookings += 1;
    });

    return Object.values(busRevenue).sort((a, b) => b.total - a.total);
};

/**
 * Get daily revenue for a date range (for charts)
 */
export const getDailyRevenue = async (dateFrom, dateTo) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('amount, trip_date')
        .in('status', ['Booked', 'Completed'])
        .gte('trip_date', dateFrom)
        .lte('trip_date', dateTo)
        .order('trip_date');

    if (error) throw error;

    // Group by date
    const dailyRevenue = {};
    data?.forEach(booking => {
        const date = booking.trip_date;
        if (!dailyRevenue[date]) {
            dailyRevenue[date] = 0;
        }
        dailyRevenue[date] += parseFloat(booking.amount) || 0;
    });

    // Convert to array
    return Object.entries(dailyRevenue).map(([date, amount]) => ({
        date,
        amount,
    }));
};

// ==================== STATISTICS ====================

/**
 * Get comprehensive revenue stats
 */
export const getRevenueStats = async () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const [todayRev, weekRev, monthRev, lastMonthRev] = await Promise.all([
        getTotalRevenue(todayStr, todayStr),
        getTotalRevenue(weekAgo.toISOString().split('T')[0], todayStr),
        getTotalRevenue(monthStart.toISOString().split('T')[0], todayStr),
        getTotalRevenue(
            lastMonthStart.toISOString().split('T')[0],
            lastMonthEnd.toISOString().split('T')[0]
        ),
    ]);

    // Calculate growth percentage
    const monthGrowth = lastMonthRev > 0
        ? ((monthRev - lastMonthRev) / lastMonthRev * 100).toFixed(1)
        : 0;

    return {
        today: todayRev,
        thisWeek: weekRev,
        thisMonth: monthRev,
        lastMonth: lastMonthRev,
        monthGrowth: parseFloat(monthGrowth),
    };
};

/**
 * Get booking count stats
 */
export const getBookingStats = async (dateFrom = null, dateTo = null) => {
    let query = supabase
        .from('bookings')
        .select('status, amount');

    if (dateFrom) {
        query = query.gte('trip_date', dateFrom);
    }
    if (dateTo) {
        query = query.lte('trip_date', dateTo);
    }

    const { data, error } = await query;
    if (error) throw error;

    const stats = {
        total: data?.length || 0,
        booked: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0,
        avgTicketPrice: 0,
    };

    data?.forEach(booking => {
        if (booking.status === 'Booked') stats.booked++;
        else if (booking.status === 'Completed') stats.completed++;
        else if (booking.status === 'Cancelled') stats.cancelled++;

        if (booking.status !== 'Cancelled') {
            stats.revenue += parseFloat(booking.amount) || 0;
        }
    });

    stats.avgTicketPrice = stats.total > 0
        ? (stats.revenue / (stats.booked + stats.completed)).toFixed(2)
        : 0;

    return stats;
};

// ==================== FORMATTING ====================

/**
 * Format currency (Sri Lankan Rupees)
 */
export const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount || 0).toLocaleString('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export default {
    getTotalRevenue,
    getBusRevenue,
    getTodayRevenue,
    getWeekRevenue,
    getMonthRevenue,
    getRevenueByBus,
    getDailyRevenue,
    getRevenueStats,
    getBookingStats,
    formatCurrency,
};
