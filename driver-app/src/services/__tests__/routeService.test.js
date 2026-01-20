/**
 * Route Service Unit Tests
 * Tests distance calculation (for fare estimation) and nearest stage finding
 */

jest.mock('../supabase', () => {
    return {
        supabase: {
            from: jest.fn(),
        },
    };
});

const { supabase } = require('../supabase');
const routeService = require('../routeService');

describe('routeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findNearestStage (uses Haversine distance calculation for fare)', () => {
        it('should find the nearest stage based on coordinates', async () => {
            const mockStages = [
                { id: 'stage-1', stage_name: 'Colombo Fort', latitude: 6.9344, longitude: 79.8428, order_no: 1 },
                { id: 'stage-2', stage_name: 'Pettah', latitude: 6.9366, longitude: 79.8503, order_no: 2 },
                { id: 'stage-3', stage_name: 'Maradana', latitude: 6.9293, longitude: 79.8655, order_no: 3 },
            ];

            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: mockStages,
                    error: null,
                }),
            };
            supabase.from.mockReturnValue(mockQueryBuilder);

            // Location near Pettah
            const result = await routeService.findNearestStage('route-1', 6.9370, 79.8510);

            expect(result.stage_name).toBe('Pettah');
            expect(result.distance).toBeDefined();
            expect(result.distance).toBeLessThan(1); // Less than 1km
        });

        it('should return null when no stages have coordinates', async () => {
            const mockStages = [
                { id: 'stage-1', stage_name: 'Unknown', latitude: null, longitude: null },
            ];

            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: mockStages,
                    error: null,
                }),
            };
            supabase.from.mockReturnValue(mockQueryBuilder);

            const result = await routeService.findNearestStage('route-1', 6.9270, 79.8612);

            expect(result).toBeNull();
        });

        it('should return null for empty stages list', async () => {
            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: [],
                    error: null,
                }),
            };
            supabase.from.mockReturnValue(mockQueryBuilder);

            const result = await routeService.findNearestStage('route-1', 6.9270, 79.8612);

            expect(result).toBeNull();
        });
    });

    describe('Haversine Distance Calculation (fare calculation basis)', () => {
        it('should calculate approximate distance between Colombo and Kandy', async () => {
            // Colombo: 6.9271, 79.8612
            // Kandy: 7.2906, 80.6337
            const mockStages = [
                { id: 'kandy', stage_name: 'Kandy', latitude: 7.2906, longitude: 80.6337, order_no: 1 },
            ];

            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: mockStages,
                    error: null,
                }),
            };
            supabase.from.mockReturnValue(mockQueryBuilder);

            const result = await routeService.findNearestStage('route-1', 6.9271, 79.8612);

            // Haversine calculation gives ~94 km
            expect(result.distance).toBeGreaterThan(90);
            expect(result.distance).toBeLessThan(110);
        });
    });

    describe('getStagesForRoute', () => {
        it('should return stages for a route', async () => {
            const mockStages = [
                { id: 'stage-1', order_no: 1, stage_name: 'Start' },
                { id: 'stage-2', order_no: 2, stage_name: 'Middle' },
                { id: 'stage-3', order_no: 3, stage_name: 'End' },
            ];

            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: mockStages,
                    error: null,
                }),
            };
            supabase.from.mockReturnValue(mockQueryBuilder);

            const result = await routeService.getStagesForRoute('route-1');

            expect(result).toHaveLength(3);
            expect(supabase.from).toHaveBeenCalledWith('stages');
        });
    });

    describe('searchRoutes', () => {
        it('should search routes by number or name', async () => {
            const mockRoutes = [
                { id: 'route-1', route_number: '138', name: 'Colombo - Kandy' },
            ];

            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                or: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue({
                    data: mockRoutes,
                    error: null,
                }),
            };
            supabase.from.mockReturnValue(mockQueryBuilder);

            const result = await routeService.searchRoutes('138');

            expect(result).toHaveLength(1);
            expect(result[0].route_number).toBe('138');
        });
    });
});
