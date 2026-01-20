/**
 * Auth Controller Unit Tests
 * Tests JWT token logic
 */

const jwt = require('jsonwebtoken');

describe('Auth Logic Tests', () => {
    describe('JWT Token Generation', () => {
        it('should generate valid JWT token', () => {
            const userId = 'test-user-123';
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
                expiresIn: '7d',
            });

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            expect(decoded.id).toBe(userId);
        });

        it('should reject invalid token', () => {
            expect(() => {
                jwt.verify('invalid.token.here', process.env.JWT_SECRET);
            }).toThrow();
        });

        it('should reject token with wrong secret', () => {
            const token = jwt.sign({ id: 'user-123' }, 'different-secret');

            expect(() => {
                jwt.verify(token, process.env.JWT_SECRET);
            }).toThrow();
        });
    });
});
