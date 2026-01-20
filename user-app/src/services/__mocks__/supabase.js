/**
 * Supabase Mock for User App Unit Testing
 */

let mockAuthUser = { id: 'user-123', email: 'passenger@example.com' };
let mockSession = { user: mockAuthUser, access_token: 'test-token' };
let mockQueryData = [];
let mockQueryError = null;

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
        then: function (resolve) {
            return resolve({ data: mockQueryData, error: mockQueryError, count: mockQueryData.length });
        }
    };
    return builder;
};

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
        signOut: jest.fn().mockImplementation(() =>
            Promise.resolve({ error: null })
        ),
    },
    from: jest.fn().mockImplementation(() => createQueryBuilder()),
    channel: jest.fn().mockReturnValue({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockReturnThis(),
    }),
};

export const mockHelpers = {
    setAuthUser: (user) => { mockAuthUser = user; },
    setSession: (session) => { mockSession = session; },
    setQueryData: (data) => { mockQueryData = Array.isArray(data) ? data : [data]; },
    setQueryError: (error) => { mockQueryError = error; },
    resetMocks: () => {
        mockAuthUser = { id: 'user-123', email: 'passenger@example.com' };
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
