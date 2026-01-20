/**
 * Ticket Service Unit Tests
 * Tests ticket validation logic and scan results
 */

jest.mock('../supabase', () => {
    const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
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

jest.mock('../crewService', () => ({
    getMyAssignedBuses: jest.fn(),
}));

const { supabase, __mockQueryBuilder } = require('../supabase');
const { getMyAssignedBuses } = require('../crewService');
const ticketService = require('../ticketService');
const { SCAN_RESULT } = ticketService;

describe('ticketService', () => {
    const today = new Date().toISOString().split('T')[0];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('SCAN_RESULT enum', () => {
        it('should have all expected scan result types', () => {
            expect(SCAN_RESULT.VALID).toBe('VALID');
            expect(SCAN_RESULT.INVALID_BOOKING).toBe('INVALID_BOOKING');
            expect(SCAN_RESULT.WRONG_BUS).toBe('WRONG_BUS');
            expect(SCAN_RESULT.ALREADY_USED).toBe('ALREADY_USED');
            expect(SCAN_RESULT.CANCELLED).toBe('CANCELLED');
            expect(SCAN_RESULT.EXPIRED).toBe('EXPIRED');
            expect(SCAN_RESULT.NOT_FOUND).toBe('NOT_FOUND');
        });
    });

    describe('validateTicket', () => {
        it('should return VALID for a correct booking', async () => {
            const validBooking = {
                id: 'booking-1',
                bus_id: 'bus-123',
                seat_number: 5,
                status: 'Booked',
                trip_date: today,
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: validBooking,
                error: null,
            });

            const result = await ticketService.validateTicket('booking-1', 'bus-123');

            expect(result.valid).toBe(true);
            expect(result.result).toBe(SCAN_RESULT.VALID);
            expect(result.message).toBe('Valid ticket - Allow boarding');
        });

        it('should return INVALID_BOOKING for empty QR data', async () => {
            const result = await ticketService.validateTicket('', 'bus-123');

            expect(result.valid).toBe(false);
            expect(result.result).toBe(SCAN_RESULT.INVALID_BOOKING);
            expect(result.message).toBe('Invalid QR code');
        });

        it('should return INVALID_BOOKING for whitespace-only QR data', async () => {
            const result = await ticketService.validateTicket('   ', 'bus-123');

            expect(result.valid).toBe(false);
            expect(result.result).toBe(SCAN_RESULT.INVALID_BOOKING);
        });

        it('should return NOT_FOUND when booking does not exist', async () => {
            __mockQueryBuilder.single.mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
            });

            const result = await ticketService.validateTicket('nonexistent', 'bus-123');

            expect(result.valid).toBe(false);
            expect(result.result).toBe(SCAN_RESULT.NOT_FOUND);
        });

        it('should return WRONG_BUS when ticket is for different bus', async () => {
            const booking = {
                id: 'booking-1',
                bus_id: 'bus-456', // Different bus
                status: 'Booked',
                trip_date: today,
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: booking,
                error: null,
            });

            const result = await ticketService.validateTicket('booking-1', 'bus-123');

            expect(result.valid).toBe(false);
            expect(result.result).toBe(SCAN_RESULT.WRONG_BUS);
            expect(result.message).toBe('Ticket is for a different bus');
        });

        it('should return ALREADY_USED for completed booking (seat already used)', async () => {
            const completedBooking = {
                id: 'booking-1',
                bus_id: 'bus-123',
                status: 'Completed',
                trip_date: today,
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: completedBooking,
                error: null,
            });

            const result = await ticketService.validateTicket('booking-1', 'bus-123');

            expect(result.valid).toBe(false);
            expect(result.result).toBe(SCAN_RESULT.ALREADY_USED);
            expect(result.message).toBe('Ticket has already been used');
        });

        it('should return CANCELLED for cancelled booking', async () => {
            const cancelledBooking = {
                id: 'booking-1',
                bus_id: 'bus-123',
                status: 'Cancelled',
                trip_date: today,
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: cancelledBooking,
                error: null,
            });

            const result = await ticketService.validateTicket('booking-1', 'bus-123');

            expect(result.valid).toBe(false);
            expect(result.result).toBe(SCAN_RESULT.CANCELLED);
        });

        it('should return EXPIRED for past date ticket', async () => {
            const expiredBooking = {
                id: 'booking-1',
                bus_id: 'bus-123',
                status: 'Booked',
                trip_date: '2025-01-01', // Past date
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: expiredBooking,
                error: null,
            });

            const result = await ticketService.validateTicket('booking-1', 'bus-123');

            expect(result.valid).toBe(false);
            expect(result.result).toBe(SCAN_RESULT.EXPIRED);
        });
    });

    describe('markTicketUsed', () => {
        it('should mark booking as Completed with Confirmed pickup', async () => {
            const usedTicket = {
                id: 'booking-1',
                status: 'Completed',
                pickup_status: 'Confirmed',
            };

            __mockQueryBuilder.single.mockResolvedValue({
                data: usedTicket,
                error: null,
            });

            const result = await ticketService.markTicketUsed('booking-1');

            expect(result.status).toBe('Completed');
            expect(result.pickup_status).toBe('Confirmed');
            expect(__mockQueryBuilder.update).toHaveBeenCalledWith({
                status: 'Completed',
                pickup_status: 'Confirmed',
            });
        });
    });

    describe('validateTicketForCrew', () => {
        it('should return error when crew is not assigned to any bus', async () => {
            getMyAssignedBuses.mockResolvedValue([]);

            const result = await ticketService.validateTicketForCrew('booking-1');

            expect(result.valid).toBe(false);
            expect(result.result).toBe(SCAN_RESULT.INVALID_BOOKING);
            expect(result.message).toBe('You are not assigned to any bus');
        });
    });
});
