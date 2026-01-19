import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitLocation = (busId, routeId, lat, lng) => {
  if (socket && socket.connected) {
    socket.emit('driver:location', { busId, routeId, lat, lng });
  }
};

export const stopTracking = (busId) => {
  if (socket && socket.connected) {
    socket.emit('driver:stop-tracking', { busId });
  }
};
