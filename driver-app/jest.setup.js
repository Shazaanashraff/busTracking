// Jest setup file for driver-app

// Global test utilities
global.console = {
    ...console,
    error: jest.fn(),
};
