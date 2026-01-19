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

export const joinRoute = (routeId) => {
  if (socket && socket.connected) {
    socket.emit('join-route', { routeId });
  }
};

export const leaveRoute = (routeId) => {
  if (socket && socket.connected) {
    socket.emit('leave-route', { routeId });
  }
};

export const onBusUpdate = (callback) => {
  if (socket) {
    socket.on('bus:update', callback);
  }
};

export const offBusUpdate = () => {
  if (socket) {
    socket.off('bus:update');
  }
};
