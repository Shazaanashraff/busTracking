/**
 * Supabase Mock for Unit Testing
 * Provides chainable query builder mocks
 */

// Default mock data
let mockAuthUser = { id: 'test-user-123', email: 'test@example.com' };
let mockSession = { user: mockAuthUser, access_token: 'test-token' };
let mockQueryData = [];
let mockQueryError = null;

// Chainable query builder mock
const createQueryBuilder = () => {
    const builder = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        neq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockImplementation(() =>
            Promise.resolve({ data: mockQueryData[0] || null, error: mockQueryError })
        ),
        // When not using .single(), return array
        then: function (resolve) {
            return resolve({ data: mockQueryData, error: mockQueryError, count: mockQueryData.length });
        }
    };

    // Make the builder thenable for await
    builder[Symbol.toStringTag] = 'Promise';

    return builder;
};

// Mock supabase client
export const supabase = {
    auth: {
        getUser: jest.fn().mockImplementation(() =>
            Promise.resolve({ data: { user: mockAuthUser }, error: null })
        ),
        getSession: jest.fn().mockImplementation(() =>
            Promise.resolve({ data: { session: mockSession }, error: null })
        ),
        signUp: jest.fn().mockImplementation(({ email }) =>
            Promise.resolve({ data: { user: { id: 'new-user', email } }, error: null })
        ),
        signInWithPassword: jest.fn().mockImplementation(() =>
            Promise.resolve({ data: { user: mockAuthUser, session: mockSession }, error: null })
        ),
        signInWithOtp: jest.fn().mockImplementation(() =>
            Promise.resolve({ data: {}, error: null })
        ),
        verifyOtp: jest.fn().mockImplementation(() =>
            Promise.resolve({ data: { user: mockAuthUser, session: mockSession }, error: null })
        ),
        signOut: jest.fn().mockImplementation(() =>
            Promise.resolve({ error: null })
        ),
    },
    from: jest.fn().mockImplementation(() => createQueryBuilder()),
    channel: jest.fn().mockReturnValue({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockReturnThis(),
    }),
    functions: {
        invoke: jest.fn().mockImplementation(() =>
            Promise.resolve({ data: { success: true }, error: null })
        ),
    },
};

// Helper functions to control mock behavior in tests
export const mockHelpers = {
    setAuthUser: (user) => {
        mockAuthUser = user;
    },
    setSession: (session) => {
        mockSession = session;
    },
    setQueryData: (data) => {
        mockQueryData = Array.isArray(data) ? data : [data];
    },
    setQueryError: (error) => {
        mockQueryError = error;
    },
    resetMocks: () => {
        mockAuthUser = { id: 'test-user-123', email: 'test@example.com' };
        mockSession = { user: mockAuthUser, access_token: 'test-token' };
        mockQueryData = [];
        mockQueryError = null;
        jest.clearAllMocks();
    },
    clearAuth: () => {
        mockAuthUser = null;
        mockSession = null;
    },
};

export default { supabase, mockHelpers };
