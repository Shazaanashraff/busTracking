/**
 * Revenue Service Unit Tests
 * Focus on pure functions and role access control
 */

// Mock supabase first (required by ownerService)
jest.mock('../supabase', () => ({
    supabase: {
        from: jest.fn(),
        auth: { getUser: jest.fn() },
    },
}));

jest.mock('../ownerService', () => ({
    getMyOwner: jest.fn(),
}));

const { getMyOwner } = require('../ownerService');
const revenueService = require('../revenueService');

describe('revenueService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== PURE FUNCTION TESTS ====================

    describe('formatCurrency', () => {
        it('should format amount as Sri Lankan Rupees', () => {
            expect(revenueService.formatCurrency(1500)).toBe('Rs. 1,500.00');
            expect(revenueService.formatCurrency(250.5)).toBe('Rs. 250.50');
            expect(revenueService.formatCurrency(0)).toBe('Rs. 0.00');
        });

        it('should handle null/undefined amounts', () => {
            expect(revenueService.formatCurrency(null)).toBe('Rs. 0.00');
            expect(revenueService.formatCurrency(undefined)).toBe('Rs. 0.00');
        });

        it('should handle string amounts', () => {
            expect(revenueService.formatCurrency('1000')).toBe('Rs. 1,000.00');
        });

        it('should format large amounts with proper separators', () => {
            expect(revenueService.formatCurrency(100000)).toBe('Rs. 100,000.00');
        });

        it('should handle decimal amounts correctly', () => {
            expect(revenueService.formatCurrency(99.99)).toBe('Rs. 99.99');
            expect(revenueService.formatCurrency(1234.5)).toBe('Rs. 1,234.50');
        });
    });

    // ==================== ROLE ACCESS TESTS ====================
    // KEY TEST: Crew cannot access revenue API

    describe('getTotalRevenue - Owner Only Access', () => {
        it('should throw error when crew tries to access (no owner record)', async () => {
            // Crew member - getMyOwner returns null (not an owner)
            getMyOwner.mockResolvedValue(null);

            // Crew cannot access revenue API
            await expect(revenueService.getTotalRevenue())
                .rejects.toThrow('Owner record not found');
        });
    });
});
