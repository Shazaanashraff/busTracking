/**
 * Socket Handler Real-Time Tests
 * Tests for GPS updates, live tracking, and offline status
 */

// Mock the models
jest.mock('../../models/LiveLocation', () => ({
    create: jest.fn(),
}));

jest.mock('../../models/Bus', () => ({
    findOneAndUpdate: jest.fn(),
}));

const LiveLocation = require('../../models/LiveLocation');
const Bus = require('../../models/Bus');
const setupSocket = require('../socketHandler');

// Mock Socket.IO
const createMockSocket = () => ({
    id: 'test-socket-123',
    on: jest.fn(),
    emit: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
});

const createMockIO = () => {
    const sockets = new Map();
    return {
        on: jest.fn((event, handler) => {
            if (event === 'connection') {
                // Store connection handler
                sockets.set('connectionHandler', handler);
            }
        }),
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
        // Helper to simulate connection
        simulateConnection: (socket) => {
            const handler = sockets.get('connectionHandler');
            if (handler) handler(socket);
        },
    };
};

describe('Socket Handler - Real-Time Tests', () => {
    let mockIO;
    let mockSocket;

    beforeEach(() => {
        jest.clearAllMocks();
        mockIO = createMockIO();
        mockSocket = createMockSocket();
    });

    describe('GPS Location Updates', () => {
        it('should receive and broadcast GPS updates', async () => {
            setupSocket(mockIO);
            mockIO.simulateConnection(mockSocket);

            // Get the driver:location handler
            const locationHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'driver:location'
            )?.[1];

            expect(locationHandler).toBeDefined();

            // Simulate GPS update
            LiveLocation.create.mockResolvedValue({});
            Bus.findOneAndUpdate.mockResolvedValue({});

            const locationData = {
                busId: 'BUS-101',
                routeId: '138',
                lat: 6.9271,
                lng: 79.8612,
            };

            await locationHandler(locationData);

            // Should save to database
            expect(LiveLocation.create).toHaveBeenCalledWith({
                busId: 'BUS-101',
                routeId: '138',
                lat: 6.9271,
                lng: 79.8612,
                timestamp: expect.any(Date),
            });

            // Should update bus active status
            expect(Bus.findOneAndUpdate).toHaveBeenCalledWith(
                { busId: 'BUS-101' },
                { isActive: true }
            );

            // Should broadcast to route room
            expect(mockIO.to).toHaveBeenCalledWith('route:138');
            expect(mockIO.emit).toHaveBeenCalledWith('bus:update', {
                busId: 'BUS-101',
                lat: 6.9271,
                lng: 79.8612,
                timestamp: expect.any(String),
            });
        });

        it('should reject invalid location data', async () => {
            setupSocket(mockIO);
            mockIO.simulateConnection(mockSocket);

            const locationHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'driver:location'
            )?.[1];

            // Missing required fields
            await locationHandler({ busId: 'BUS-101' }); // Missing lat, lng, routeId

            expect(mockSocket.emit).toHaveBeenCalledWith('error', {
                message: 'Invalid location data',
            });
            expect(LiveLocation.create).not.toHaveBeenCalled();
        });
    });

    describe('Route Room Subscriptions (Passenger sees movement live)', () => {
        it('should allow passenger to join route room', () => {
            setupSocket(mockIO);
            mockIO.simulateConnection(mockSocket);

            const joinHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'join-route'
            )?.[1];

            joinHandler({ routeId: '138' });

            expect(mockSocket.join).toHaveBeenCalledWith('route:138');
            expect(mockSocket.emit).toHaveBeenCalledWith('joined-route', {
                routeId: '138',
                message: 'Joined route 138',
            });
        });

        it('should reject join without routeId', () => {
            setupSocket(mockIO);
            mockIO.simulateConnection(mockSocket);

            const joinHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'join-route'
            )?.[1];

            joinHandler({});

            expect(mockSocket.emit).toHaveBeenCalledWith('error', {
                message: 'Route ID is required',
            });
            expect(mockSocket.join).not.toHaveBeenCalled();
        });

        it('should allow passenger to leave route room', () => {
            setupSocket(mockIO);
            mockIO.simulateConnection(mockSocket);

            const leaveHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'leave-route'
            )?.[1];

            leaveHandler({ routeId: '138' });

            expect(mockSocket.leave).toHaveBeenCalledWith('route:138');
        });
    });

    describe('Crew Turns Off GPS → Status Shows Offline', () => {
        it('should set bus to inactive when driver stops tracking', async () => {
            setupSocket(mockIO);
            mockIO.simulateConnection(mockSocket);

            Bus.findOneAndUpdate.mockResolvedValue({});

            const stopHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'driver:stop-tracking'
            )?.[1];

            await stopHandler({ busId: 'BUS-101' });

            // Should mark bus as inactive (offline)
            expect(Bus.findOneAndUpdate).toHaveBeenCalledWith(
                { busId: 'BUS-101' },
                { isActive: false }
            );
        });
    });

    describe('Disconnect Handling', () => {
        it('should handle client disconnect', () => {
            setupSocket(mockIO);
            mockIO.simulateConnection(mockSocket);

            const disconnectHandler = mockSocket.on.mock.calls.find(
                call => call[0] === 'disconnect'
            )?.[1];

            expect(disconnectHandler).toBeDefined();
            // Should not throw
            expect(() => disconnectHandler()).not.toThrow();
        });
    });
});
