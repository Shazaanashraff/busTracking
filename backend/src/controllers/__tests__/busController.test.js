/**
 * Bus Controller Unit Tests
 * Tests bus-related API operations
 */

// Mock the Bus model
jest.mock('../../models/Bus', () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    distinct: jest.fn(),
}));

const Bus = require('../../models/Bus');
const { registerBus, getBusesByRoute, getAllRoutes, getMyBus } = require('../busController');

// Mock request/response helpers
const mockReq = (overrides = {}) => ({
    body: {},
    params: {},
    user: { _id: 'driver-123' },
    ...overrides,
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Bus Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerBus', () => {
        it('should register a new bus for driver', async () => {
            const req = mockReq({
                body: { busId: 'BUS-101', busName: 'Express 1', routeId: '138' },
                user: { _id: 'driver-123' },
            });
            const res = mockRes();

            Bus.findOne.mockResolvedValue(null);
            Bus.create.mockResolvedValue({
                busId: 'BUS-101',
                busName: 'Express 1',
                routeId: '138',
                driverId: 'driver-123',
            });

            await registerBus(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
        });

        it('should reject duplicate bus registration', async () => {
            const req = mockReq({
                body: { busId: 'BUS-101', busName: 'Express 1', routeId: '138' },
            });
            const res = mockRes();

            Bus.findOne.mockResolvedValue({ busId: 'BUS-101' });

            await registerBus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Bus already registered' });
        });
    });

    describe('getBusesByRoute', () => {
        it('should return buses for a specific route', async () => {
            const req = mockReq({ params: { routeId: '138' } });
            const res = mockRes();

            const mockBuses = [
                { busId: 'BUS-101', busName: 'Express 1', routeId: '138' },
                { busId: 'BUS-102', busName: 'Express 2', routeId: '138' },
            ];

            Bus.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockBuses),
            });

            await getBusesByRoute(req, res);

            expect(Bus.find).toHaveBeenCalledWith({ routeId: '138' });
            expect(res.json).toHaveBeenCalledWith(mockBuses);
        });
    });

    describe('getAllRoutes', () => {
        it('should return all distinct route IDs', async () => {
            const req = mockReq();
            const res = mockRes();

            Bus.distinct.mockResolvedValue(['138', '177', '255']);

            await getAllRoutes(req, res);

            expect(Bus.distinct).toHaveBeenCalledWith('routeId');
            expect(res.json).toHaveBeenCalledWith(['138', '177', '255']);
        });
    });

    describe('getMyBus (Owner fetches only their buses)', () => {
        it('should return bus assigned to driver', async () => {
            const req = mockReq({ user: { _id: 'driver-123' } });
            const res = mockRes();

            const mockBus = {
                busId: 'BUS-101',
                busName: 'Express 1',
                driverId: 'driver-123',
            };
            Bus.findOne.mockResolvedValue(mockBus);

            await getMyBus(req, res);

            // KEY TEST: Owner fetches only their buses
            expect(Bus.findOne).toHaveBeenCalledWith({ driverId: 'driver-123' });
            expect(res.json).toHaveBeenCalledWith(mockBus);
        });

        it('should return 404 if driver has no bus', async () => {
            const req = mockReq({ user: { _id: 'driver-no-bus' } });
            const res = mockRes();

            Bus.findOne.mockResolvedValue(null);

            await getMyBus(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'No bus assigned to this driver' });
        });
    });
});
