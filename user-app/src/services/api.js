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

  async register(name, email, password) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'user' })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  async getRoutes() {
    const response = await fetch(`${API_URL}/api/bus/routes`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch routes');
    }
    
    return response.json();
  },

  async getBusesByRoute(routeId) {
    const response = await fetch(`${API_URL}/api/bus/route/${routeId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }
    
    return response.json();
  }
};

export default api;
