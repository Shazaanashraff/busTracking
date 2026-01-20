// Jest setup for backend API tests

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.NODE_ENV = 'test';

// Mock console to reduce noise during testing
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
};
