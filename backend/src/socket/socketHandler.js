const LiveLocation = require('../models/LiveLocation');
const Bus = require('../models/Bus');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Driver sends location update
    socket.on('driver:location', async (data) => {
      try {
        const { busId, routeId, lat, lng } = data;

        if (!busId || !routeId || lat === undefined || lng === undefined) {
          socket.emit('error', { message: 'Invalid location data' });
          return;
        }

        // Save location to database
        await LiveLocation.create({
          busId,
          routeId,
          lat,
          lng,
          timestamp: new Date()
        });

        // Update bus active status
        await Bus.findOneAndUpdate({ busId }, { isActive: true });

        // Broadcast to all users in the route room
        const updatePayload = {
          busId,
          lat,
          lng,
          timestamp: new Date().toISOString()
        };

        io.to(`route:${routeId}`).emit('bus:update', updatePayload);
        
        console.log(`Location update for ${busId} on ${routeId}: ${lat}, ${lng}`);
      } catch (error) {
        console.error('Error processing location:', error);
        socket.emit('error', { message: 'Failed to process location' });
      }
    });

    // User joins a route room to receive updates
    socket.on('join-route', (data) => {
      const { routeId } = data;

      if (!routeId) {
        socket.emit('error', { message: 'Route ID is required' });
        return;
      }

      socket.join(`route:${routeId}`);
      console.log(`Socket ${socket.id} joined route: ${routeId}`);
      
      socket.emit('joined-route', { routeId, message: `Joined route ${routeId}` });
    });

    // User leaves a route room
    socket.on('leave-route', (data) => {
      const { routeId } = data;
      
      if (routeId) {
        socket.leave(`route:${routeId}`);
        console.log(`Socket ${socket.id} left route: ${routeId}`);
      }
    });

    // Driver stops tracking
    socket.on('driver:stop-tracking', async (data) => {
      const { busId } = data;
      
      if (busId) {
        await Bus.findOneAndUpdate({ busId }, { isActive: false });
        console.log(`Driver stopped tracking for bus: ${busId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
