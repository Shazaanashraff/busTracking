/**
 * Pickup Service Unit Tests
 * Tests pickup status updates, phone masking, and status grouping
 */

jest.mock('../supabase', () => {
    const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn(),
    };

    return {
        supabase: {
            from: jest.fn(() => mockQueryBuilder),
        },
        __mockQueryBuilder: mockQueryBuilder,
    };
});

const { supabase, __mockQueryBuilder } = require('../supabase');
const pickupService = require('../pickupService');

describe('pickupService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== PURE FUNCTION TESTS ====================
    // These don't need mocking - pure functions with no side effects

    describe('getMaskedPhone', () => {
        it('should mask phone number correctly', () => {
            const result = pickupService.getMaskedPhone('+94771234567');
            expect(result).toBe('+947 *** **67');
        });

        it('should return *** for empty phone', () => {
            expect(pickupService.getMaskedPhone('')).toBe('***');
            expect(pickupService.getMaskedPhone(null)).toBe('***');
            expect(pickupService.getMaskedPhone(undefined)).toBe('***');
        });

        it('should return *** for phone shorter than 8 chars', () => {
            expect(pickupService.getMaskedPhone('12345')).toBe('***');
            expect(pickupService.getMaskedPhone('1234567')).toBe('***');
        });

        it('should work with 8 character phone', () => {
            expect(pickupService.getMaskedPhone('12345678')).toBe('1234 *** **78');
        });
    });

    // ==================== STATUS UPDATE TESTS ====================

    describe('confirmPickup', () => {
        it('should update pickup_status to Confirmed', async () => {
            const confirmedBooking = {
                id: 'booking-1',
                pickup_status: 'Confirmed',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: confirmedBooking,
                error: null,
            });

            const result = await pickupService.confirmPickup('booking-1');

            expect(result.pickup_status).toBe('Confirmed');
            expect(__mockQueryBuilder.update).toHaveBeenCalledWith({
                pickup_status: 'Confirmed',
            });
        });
    });

    describe('markNoAnswer', () => {
        it('should update pickup_status to NoAnswer', async () => {
            const noAnswerBooking = {
                id: 'booking-1',
                pickup_status: 'NoAnswer',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: noAnswerBooking,
                error: null,
            });

            const result = await pickupService.markNoAnswer('booking-1');

            expect(result.pickup_status).toBe('NoAnswer');
            expect(__mockQueryBuilder.update).toHaveBeenCalledWith({
                pickup_status: 'NoAnswer',
            });
        });
    });

    describe('cancelPickup', () => {
        it('should set pickup_status and status to Cancelled (seat becomes free)', async () => {
            const cancelledBooking = {
                id: 'booking-1',
                pickup_status: 'Cancelled',
                status: 'Cancelled',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: cancelledBooking,
                error: null,
            });

            const result = await pickupService.cancelPickup('booking-1');

            // KEY TEST: When pickup_status = Cancelled → seat becomes free
            expect(result.pickup_status).toBe('Cancelled');
            expect(result.status).toBe('Cancelled');
            expect(__mockQueryBuilder.update).toHaveBeenCalledWith({
                pickup_status: 'Cancelled',
                status: 'Cancelled',
            });
        });
    });

    describe('markPickedUp', () => {
        it('should mark passenger as picked up and complete booking', async () => {
            const pickedUpBooking = {
                id: 'booking-1',
                pickup_status: 'Confirmed',
                status: 'Completed',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: pickedUpBooking,
                error: null,
            });

            const result = await pickupService.markPickedUp('booking-1');

            expect(result.pickup_status).toBe('Confirmed');
            expect(result.status).toBe('Completed');
        });
    });
});
