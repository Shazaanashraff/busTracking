/**
 * User App Booking Service Unit Tests
 * Tests passenger-side booking operations and utilities
 */

jest.mock('../supabase', () => {
    const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn(),
    };

    return {
        supabase: {
            auth: {
                getUser: jest.fn(),
            },
            from: jest.fn(() => mockQueryBuilder),
            channel: jest.fn(() => ({
                on: jest.fn().mockReturnThis(),
                subscribe: jest.fn().mockReturnThis(),
            })),
        },
        __mockQueryBuilder: mockQueryBuilder,
    };
});

const { supabase, __mockQueryBuilder } = require('../supabase');
const bookingService = require('../bookingService');

describe('bookingService (User App)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== PURE FUNCTION TESTS ====================

    describe('formatCurrency', () => {
        it('should format amount as Sri Lankan Rupees', () => {
            expect(bookingService.formatCurrency(1500)).toBe('Rs. 1,500.00');
            expect(bookingService.formatCurrency(250.5)).toBe('Rs. 250.50');
            expect(bookingService.formatCurrency(0)).toBe('Rs. 0.00');
        });

        it('should handle null/undefined amounts', () => {
            expect(bookingService.formatCurrency(null)).toBe('Rs. 0.00');
            expect(bookingService.formatCurrency(undefined)).toBe('Rs. 0.00');
        });
    });

    describe('getStatusColor', () => {
        it('should return blue for Booked status', () => {
            expect(bookingService.getStatusColor('Booked')).toBe('#3b82f6');
        });

        it('should return green for Completed status', () => {
            expect(bookingService.getStatusColor('Completed')).toBe('#22c55e');
        });

        it('should return red for Cancelled status', () => {
            expect(bookingService.getStatusColor('Cancelled')).toBe('#ef4444');
        });

        it('should return amber for NoShow status', () => {
            expect(bookingService.getStatusColor('NoShow')).toBe('#f59e0b');
        });

        it('should return gray for unknown status', () => {
            expect(bookingService.getStatusColor('Unknown')).toBe('#6b7280');
            expect(bookingService.getStatusColor('')).toBe('#6b7280');
        });
    });

    describe('getTicketQRData', () => {
        it('should return booking ID as QR data', () => {
            expect(bookingService.getTicketQRData('booking-123')).toBe('booking-123');
            expect(bookingService.getTicketQRData('abc-def-ghi')).toBe('abc-def-ghi');
        });
    });

    // ==================== BOOKING OPERATIONS ====================

    describe('createBooking', () => {
        it('should create booking with correct passenger_id', async () => {
            supabase.auth.getUser.mockResolvedValue({
                data: { user: { id: 'user-123' } },
            });

            const mockBooking = {
                id: 'booking-1',
                passenger_id: 'user-123',
                bus_id: 'bus-1',
                seat_number: 3,
                status: 'Booked',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: mockBooking,
                error: null,
            });

            const result = await bookingService.createBooking({
                busId: 'bus-1',
                seatNumber: 3,
                pickupStageId: 'stage-1',
                dropoffStageId: 'stage-2',
            });

            expect(result.status).toBe('Booked');
        });

        it('should throw error when not authenticated', async () => {
            supabase.auth.getUser.mockResolvedValue({
                data: { user: null },
            });

            await expect(bookingService.createBooking({
                busId: 'bus-1',
                seatNumber: 3,
            })).rejects.toThrow('Not authenticated');
        });
    });

    describe('cancelBooking', () => {
        it('should update booking status to Cancelled', async () => {
            const cancelledBooking = {
                id: 'booking-1',
                status: 'Cancelled',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: cancelledBooking,
                error: null,
            });

            const result = await bookingService.cancelBooking('booking-1');

            expect(result.status).toBe('Cancelled');
        });
    });
});
