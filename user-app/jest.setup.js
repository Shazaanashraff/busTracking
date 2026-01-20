// Jest setup file for user-app
global.console = {
    ...console,
    error: jest.fn(),
};
