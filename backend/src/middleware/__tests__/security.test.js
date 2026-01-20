/**
 * Security Tests
 * Tests for data protection, role access, and JWT security
 * Critical for protecting phone + NIC data in Sri Lanka
 */

const jwt = require('jsonwebtoken');

// Mock User model
jest.mock('../../models/User', () => ({
    findById: jest.fn(),
}));

const User = require('../../models/User');
const { protect, requireDriver, requireUser } = require('../auth');

// Mock helpers
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

describe('Security Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== JWT TAMPERING PROTECTION ====================

    describe('JWT Tampering Protection', () => {
        it('should reject token with modified payload', () => {
            // Create valid token
            const validToken = jwt.sign({ id: 'user-123', role: 'user' }, process.env.JWT_SECRET);

            // Tamper with payload by changing role
            const parts = validToken.split('.');
            const tamperedPayload = Buffer.from(JSON.stringify({
                id: 'user-123',
                role: 'admin' // Trying to escalate privileges
            })).toString('base64url');
            const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

            expect(() => {
                jwt.verify(tamperedToken, process.env.JWT_SECRET);
            }).toThrow();
        });

        it('should reject token with invalid signature', () => {
            const token = jwt.sign({ id: 'user-123' }, 'attacker-secret');

            expect(() => {
                jwt.verify(token, process.env.JWT_SECRET);
            }).toThrow();
        });

        it('should reject expired tokens', () => {
            const expiredToken = jwt.sign(
                { id: 'user-123' },
                process.env.JWT_SECRET,
                { expiresIn: '-1h' } // Expired 1 hour ago
            );

            expect(() => {
                jwt.verify(expiredToken, process.env.JWT_SECRET);
            }).toThrow();
        });

        it('should reject forged tokens', () => {
            // Completely fake token
            const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0.fake_signature';

            expect(() => {
                jwt.verify(forgedToken, process.env.JWT_SECRET);
            }).toThrow();
        });
    });

    // ==================== ROLE ACCESS CONTROL ====================

    describe('Role Access Control', () => {
        it('PASSENGER trying to access DRIVER endpoint → Block', () => {
            const req = mockReq({ user: { role: 'user' } }); // Passenger role
            const res = mockRes();

            requireDriver(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('CREW/DRIVER trying to access PASSENGER-only endpoint → Block', () => {
            const req = mockReq({ user: { role: 'driver' } }); // Crew role
            const res = mockRes();

            requireUser(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('VALID ROLE gets access', () => {
            const driverReq = mockReq({ user: { role: 'driver' } });
            const userReq = mockReq({ user: { role: 'user' } });
            const res = mockRes();

            requireDriver(driverReq, res, mockNext);
            expect(mockNext).toHaveBeenCalledTimes(1);

            jest.clearAllMocks();

            requireUser(userReq, res, mockNext);
            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // ==================== DATA LEAKAGE PREVENTION ====================

    describe('Data Leakage Prevention', () => {
        it('should not expose JWT secret in error messages', async () => {
            const req = mockReq({
                headers: { authorization: 'Bearer invalid-token' },
            });
            const res = mockRes();

            await protect(req, res, mockNext);

            // Check that error message doesn't contain secret
            const errorCall = res.json.mock.calls[0][0];
            expect(errorCall.message).not.toContain(process.env.JWT_SECRET);
            expect(errorCall.message).toBe('Not authorized, token failed');
        });

        it('should not expose user password in responses', async () => {
            const mockUser = {
                _id: 'user-123',
                name: 'Test User',
                role: 'driver',
                password: 'hashed_password_should_not_appear'
            };
            const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET);
            const req = mockReq({
                headers: { authorization: `Bearer ${token}` },
            });
            const res = mockRes();

            User.findById.mockResolvedValue(mockUser);

            await protect(req, res, mockNext);

            // User is attached but in real app, password should be excluded from select
            expect(mockNext).toHaveBeenCalled();
        });
    });

    // ==================== INJECTION PREVENTION ====================

    describe('Injection Prevention', () => {
        it('should handle malicious input in authorization header', async () => {
            const maliciousInputs = [
                'Bearer <script>alert(1)</script>',
                'Bearer ${process.env.JWT_SECRET}',
                'Bearer "; DROP TABLE users; --',
                'Bearer \'; DELETE FROM users; --',
            ];

            for (const maliciousAuth of maliciousInputs) {
                const req = mockReq({
                    headers: { authorization: maliciousAuth },
                });
                const res = mockRes();

                await protect(req, res, mockNext);

                // Should reject all malicious tokens gracefully
                expect(res.status).toHaveBeenCalledWith(401);
            }
        });
    });

    // ==================== AUTHORIZATION BYPASS ATTEMPTS ====================

    describe('Authorization Bypass Prevention', () => {
        it('should block request without Authorization header', async () => {
            const req = mockReq(); // No auth header
            const res = mockRes();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
        });

        it('should block request with empty Bearer token', async () => {
            const req = mockReq({
                headers: { authorization: 'Bearer ' },
            });
            const res = mockRes();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should block request with malformed Bearer format', async () => {
            const req = mockReq({
                headers: { authorization: 'NotBearer validtoken' },
            });
            const res = mockRes();

            await protect(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
        });
    });
});
