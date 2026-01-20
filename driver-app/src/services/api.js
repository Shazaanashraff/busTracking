import { API_URL } from '../config';
import { supabase } from './supabase';

const api = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async register(name, email, password, role = 'driver') {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async getMyBus(token) {
    const response = await fetch(`${API_URL}/api/bus/my-bus`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Fallback for demo if backend not ready
    if (!response.ok) {
      return {
        busId: 'BUS-101',
        busName: 'ND-4567',
        routeId: '138',
        routeStart: 'Pettah',
        routeEnd: 'Homagama'
      };
    }

    return response.json();
  },

  async getOwnerStats(token) {
    const { data, error } = await supabase.rpc('get_owner_dashboard_stats');

    if (error) {
      console.error('Error fetching owner stats:', error);
      throw error;
    }

    return {
      dailyRevenue: `LKR ${data.dailyRevenue?.toLocaleString() || '0'}`,
      monthlyRevenue: `LKR ${data.monthlyRevenue?.toLocaleString() || '0'}`,
      activeBuses: data.activeBuses || 0,
      totalBuses: data.totalBuses || 0,
      todaysBookings: data.todaysBookings || 0,
      seatUtilization: data.seatUtilization || 0,
      cancellations: data.cancellations || 0,
      payments: [] // Keeping empty for now as requested or implementing separate RPC later
    };
  },

  async getDashboardStats(token) {
    const { data, error } = await supabase.rpc('get_driver_dashboard_stats');

    if (error) {
      console.error('Error fetching driver stats:', error);
      // Return zeros on error to prevent crash
      return {
        tripsToday: 0,
        bookings: 0,
        totalPassengers: 0,
        bookedSeats: [],
        revenue: 0
      };
    }

    return data;
  },

  async validateTicket(token, ticketId, busId) {
    const { data, error } = await supabase.rpc('validate_ticket', {
      ticket_id: ticketId,
      scan_bus_id: busId || '00000000-0000-0000-0000-000000000000' // Fallback or handle error
    });

    if (error) {
      console.error('Validation error:', error);
      return { valid: false, reason: 'Validation Error' };
    }

    return data;
  },

  async updateCrowdLevel(token, level) {
    // level: 'Low' | 'Medium' | 'High'
    // Mock update
    console.log('Updating crowd level to:', level);
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
};

export default api;
