/**
 * Booking Service Unit Tests
 * Tests booking creation, stats calculation, and status updates
 * 
 * Note: Focus on testable pure logic. Complex Supabase queries
 * are better tested via integration tests with a real database.
 */

// Mock the entire supabase module
jest.mock('../supabase', () => {
    const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn(),
    };

    return {
        supabase: {
            auth: {
                getUser: jest.fn(),
            },
            from: jest.fn(() => mockQueryBuilder),
        },
        __mockQueryBuilder: mockQueryBuilder,
    };
});

const { supabase, __mockQueryBuilder } = require('../supabase');
const bookingService = require('../bookingService');

describe('bookingService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createBooking', () => {
        it('should create a booking with correct fields when authenticated', async () => {
            // Setup auth mock
            supabase.auth.getUser.mockResolvedValue({
                data: { user: { id: 'user-123' } },
            });

            const mockBooking = {
                id: 'booking-1',
                bus_id: 'bus-123',
                passenger_id: 'user-123',
                seat_number: 5,
                status: 'Booked',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: mockBooking,
                error: null,
            });

            const result = await bookingService.createBooking({
                busId: 'bus-123',
                seatNumber: 5,
                pickupStageId: 'stage-1',
                dropoffStageId: 'stage-2',
                amount: 150,
            });

            expect(result).toEqual(mockBooking);
            expect(supabase.from).toHaveBeenCalledWith('bookings');
            expect(__mockQueryBuilder.insert).toHaveBeenCalled();
        });

        it('should throw error when not authenticated', async () => {
            supabase.auth.getUser.mockResolvedValue({
                data: { user: null },
            });

            await expect(
                bookingService.createBooking({
                    busId: 'bus-123',
                    seatNumber: 5,
                })
            ).rejects.toThrow('Not authenticated');
        });
    });

    describe('cancelMyBooking', () => {
        it('should update booking status to Cancelled', async () => {
            const cancelledBooking = {
                id: 'booking-1',
                status: 'Cancelled',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: cancelledBooking,
                error: null,
            });

            const result = await bookingService.cancelMyBooking('booking-1');

            expect(result.status).toBe('Cancelled');
            expect(__mockQueryBuilder.update).toHaveBeenCalledWith({ status: 'Cancelled' });
        });
    });

    describe('confirmBooking', () => {
        it('should update pickup_status to Confirmed and status to Booked', async () => {
            const confirmedBooking = {
                id: 'booking-1',
                pickup_status: 'Confirmed',
                status: 'Booked',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: confirmedBooking,
                error: null,
            });

            const result = await bookingService.confirmBooking('booking-1');

            expect(result.pickup_status).toBe('Confirmed');
            expect(result.status).toBe('Booked');
        });
    });

    describe('markNoShow', () => {
        it('should mark booking as NoShow with NoAnswer pickup status', async () => {
            const noShowBooking = {
                id: 'booking-1',
                status: 'NoShow',
                pickup_status: 'NoAnswer',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: noShowBooking,
                error: null,
            });

            const result = await bookingService.markNoShow('booking-1');

            expect(result.status).toBe('NoShow');
            expect(result.pickup_status).toBe('NoAnswer');
            expect(__mockQueryBuilder.update).toHaveBeenCalledWith({
                status: 'NoShow',
                pickup_status: 'NoAnswer',
            });
        });
    });

    describe('updatePickupStatus', () => {
        it('should update pickup status correctly', async () => {
            const updatedBooking = {
                id: 'booking-1',
                pickup_status: 'Confirmed',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: updatedBooking,
                error: null,
            });

            const result = await bookingService.updatePickupStatus('booking-1', 'Confirmed');

            expect(result.pickup_status).toBe('Confirmed');
            expect(__mockQueryBuilder.update).toHaveBeenCalledWith({ pickup_status: 'Confirmed' });
        });
    });
});
