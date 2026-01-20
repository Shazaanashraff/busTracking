import { API_URL } from '../config';

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
    // Mocking Owner Stats
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dailyRevenue: 'LKR 45,200',
          monthlyRevenue: 'LKR 1.2M',
          activeBuses: 8,
          totalBuses: 12,
          todaysBookings: 42,
          seatsSold: 38,
          cancellations: 3,
          seatUtilization: 78,
          payments: [
            { passengerName: 'Kamal Perera', phone: '077****321', amount: 'LKR 850', status: 'PAID' },
            { passengerName: 'Nimali Silva', phone: '076****882', amount: 'LKR 1,200', status: 'PAID' },
            { passengerName: 'Sunil Dias', phone: '071****554', amount: 'LKR 450', status: 'PAID' },
            { passengerName: 'Chathura Rao', phone: '077****991', amount: 'LKR 1,800', status: 'PENDING' }
          ]
        });
      }, 800);
    });
  },

  async getDashboardStats(token) {
    // Mocking the stats as per requirements
    // In real app, fetch from backend: GET /api/driver/stats
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          tripsToday: 4,
          bookings: 18,
          totalPassengers: 42,
          bookedSeats: [3, 4, 6, 7, 8, 12, 13, 14],
          revenue: 0 // Hidden as per requirement
        });
      }, 800);
    });
  },

  async validateTicket(token, ticketId) {
    // Mock validation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 80% success rate
        if (Math.random() > 0.2) {
          resolve({
            valid: true,
            passengerName: 'Kasun Perera',
            seatNumber: '4',
            ticketId: ticketId,
            busId: 'ND-4567'
          });
        } else {
          resolve({
            valid: false,
            reason: 'Ticket Expired or Invalid'
          });
        }
      }, 1000);
    });
  },

  async updateCrowdLevel(token, level) {
    // level: 'Low' | 'Medium' | 'High'
    // Mock update
    console.log('Updating crowd level to:', level);
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
};

export default api;
