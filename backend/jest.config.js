module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
    testPathIgnorePatterns: ['/node_modules/'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/config/*.js'
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testTimeout: 10000,
};
