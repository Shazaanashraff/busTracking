module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    moduleFileExtensions: ['js', 'jsx', 'json'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@supabase)/)'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^react-native$': '<rootDir>/src/services/__mocks__/react-native.js',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    collectCoverageFrom: [
        'src/services/**/*.js',
        '!src/services/supabase.js',
        '!src/services/socket.js'
    ],
};
