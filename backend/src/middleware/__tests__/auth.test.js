/**
 * Auth Middleware Unit Tests
 * Tests role-based access control
 */

const jwt = require('jsonwebtoken');

// Mock User model
jest.mock('../../models/User', () => ({
    findById: jest.fn(),
}));

const User = require('../../models/User');
const { protect, requireDriver, requireUser } = require('../auth');

// Helper to create mock request/response
const mockReq = (overrides = {}) => ({
    headers: {},
    ...overrides,
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = jest.fn();

describe('Auth Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('protect middleware', () => {
        it('should reject request without token', async () => {
            const req = mockReq();
            const res = mockRes();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should reject request with invalid token', async () => {
            const req = mockReq({
                headers: { authorization: 'Bearer invalid-token' },
            });
            const res = mockRes();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
        });

        it('should reject if user not found', async () => {
            const token = jwt.sign({ id: 'user-123' }, process.env.JWT_SECRET);
            const req = mockReq({
                headers: { authorization: `Bearer ${token}` },
            });
            const res = mockRes();

            User.findById.mockResolvedValue(null);

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should allow valid token and set req.user', async () => {
            const mockUser = { _id: 'user-123', name: 'Test User', role: 'driver' };
            const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET);
            const req = mockReq({
                headers: { authorization: `Bearer ${token}` },
            });
            const res = mockRes();

            User.findById.mockResolvedValue(mockUser);

            await protect(req, res, mockNext);

            expect(req.user).toEqual(mockUser);
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('requireDriver middleware', () => {
        it('should allow driver role', () => {
            const req = mockReq({ user: { role: 'driver' } });
            const res = mockRes();

            requireDriver(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should reject passenger trying to access driver endpoint', () => {
            const req = mockReq({ user: { role: 'user' } });
            const res = mockRes();

            requireDriver(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Access denied. Driver role required.',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('requireUser middleware', () => {
        it('should allow user/passenger role', () => {
            const req = mockReq({ user: { role: 'user' } });
            const res = mockRes();

            requireUser(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should reject crew trying to access passenger-only endpoint', () => {
            const req = mockReq({ user: { role: 'driver' } });
            const res = mockRes();

            requireUser(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Access denied. User role required.',
            });
        });
    });
});
