# Real-Time Bus Tracking System

A complete real-time bus tracking system with Node.js backend, Socket.IO for WebSocket communication, and React Native (Expo) mobile apps.

## Project Structure

```
bus-tracking-system/
├── backend/           # Node.js + Express + Socket.IO + MongoDB
├── driver-app/        # React Native (Expo) - Driver app
└── user-app/          # React Native (Expo) - User app
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone

### 1. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/bus-tracking

# Install dependencies
npm install

# Seed the database
npm run seed

# Start server
npm run dev
```

Server runs at `http://localhost:5000`

### 2. Driver App Setup

```bash
cd driver-app

# Install dependencies
npm install

# Update src/config.js with your server IP
# Use your computer's local IP (e.g., 192.168.1.x) for device testing

# Start Expo
npx expo start
```

### 3. User App Setup

```bash
cd user-app

# Install dependencies
npm install

# Update src/config.js with your server IP

# For Google Maps, add API keys in app.json

# Start Expo
npx expo start
```

---

## Test Credentials

| Role   | Email              | Password    |
|--------|--------------------|-------------|
| Driver | driver@test.com    | password123 |
| User   | user@test.com      | password123 |

---

## API Endpoints

| Method | Endpoint             | Description              | Auth     |
|--------|----------------------|--------------------------|----------|
| POST   | /api/auth/register   | Register new user        | -        |
| POST   | /api/auth/login      | Login                    | -        |
| POST   | /api/bus/register    | Register a bus           | Driver   |
| GET    | /api/bus/routes      | Get all routes           | -        |
| GET    | /api/bus/route/:id   | Get buses on a route     | -        |
| GET    | /api/bus/my-bus      | Get driver's bus         | Driver   |

---

## Socket.IO Events

### Driver → Server
```javascript
// Emit location updates
socket.emit('driver:location', {
  busId: 'BUS001',
  routeId: 'ROUTE_A',
  lat: 28.6139,
  lng: 77.2090
});

// Stop tracking
socket.emit('driver:stop-tracking', { busId: 'BUS001' });
```

### User → Server
```javascript
// Join a route room
socket.emit('join-route', { routeId: 'ROUTE_A' });

// Leave a route room
socket.emit('leave-route', { routeId: 'ROUTE_A' });
```

### Server → User
```javascript
// Receive bus location updates
socket.on('bus:update', (data) => {
  // { busId, lat, lng, timestamp }
});
```

---

## Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│  Driver App │ ──────────────────►│   Backend   │
│  (Expo)     │   driver:location  │  (Node.js)  │
└─────────────┘                    └──────┬──────┘
                                          │
                                          │ bus:update
                                          ▼
                                   ┌─────────────┐
                                   │  User App   │
                                   │  (Expo)     │
                                   └─────────────┘
```

---

## Notes

- Update `src/config.js` in both apps with your backend IP when testing on devices
- For Google Maps on Android/iOS, add API keys in `app.json`
- MongoDB must be running before starting the backend
