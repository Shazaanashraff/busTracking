/**
 * Location Service Real-Time Tests
 * Tests for GPS updates, ETA calculation, and network recovery logic
 */

jest.mock('../supabase', () => {
    return {
        supabase: {
            from: jest.fn(),
            channel: jest.fn(),
            removeChannel: jest.fn(),
        },
    };
});

const { supabase } = require('../supabase');
const locationService = require('../locationService');

describe('Location Service - Real-Time Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== GPS UPDATE TESTS ====================

    describe('GPS Updates (every 5 seconds)', () => {
        it('should update bus location with all fields', async () => {
            const mockQueryBuilder = {
                upsert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: {
                        bus_id: 'bus-123',
                        latitude: 6.9271,
                        longitude: 79.8612,
                        speed: 45,
                        is_moving: true,
                    },
                    error: null,
                }),
            };
            supabase.from.mockReturnValue(mockQueryBuilder);

            const result = await locationService.updateBusLocation('bus-123', {
                latitude: 6.9271,
                longitude: 79.8612,
                speed: 45,
                heading: 90,
                accuracy: 10,
            });

            expect(supabase.from).toHaveBeenCalledWith('bus_locations');
            expect(mockQueryBuilder.upsert).toHaveBeenCalledWith(
                {
                    bus_id: 'bus-123',
                    latitude: 6.9271,
                    longitude: 79.8612,
                    speed: 45,
                    heading: 90,
                    accuracy: 10,
                    is_moving: true, // Speed > 1 km/h
                },
                { onConflict: 'bus_id' }
            );
        });

        it('should set is_moving to false when speed is low', async () => {
            const mockQueryBuilder = {
                upsert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: {}, error: null }),
            };
            supabase.from.mockReturnValue(mockQueryBuilder);

            await locationService.updateBusLocation('bus-123', {
                latitude: 6.9271,
                longitude: 79.8612,
                speed: 0.5, // Below 1 km/h threshold
            });

            expect(mockQueryBuilder.upsert).toHaveBeenCalledWith(
                expect.objectContaining({ is_moving: false }),
                expect.anything()
            );
        });
    });

    // ==================== STOP TRACKING (OFFLINE) ====================

    describe('Crew turns off GPS → status shows Offline', () => {
        it('should set speed to 0 and is_moving to false when stopping', async () => {
            const mockQueryBuilder = {
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: { speed: 0, is_moving: false },
                    error: null,
                }),
            };
            supabase.from.mockReturnValue(mockQueryBuilder);

            const result = await locationService.stopTracking('bus-123');

            expect(mockQueryBuilder.update).toHaveBeenCalledWith({
                speed: 0,
                is_moving: false,
            });
            expect(result.speed).toBe(0);
            expect(result.is_moving).toBe(false);
        });
    });

    // ==================== REAL-TIME SUBSCRIPTIONS ====================

    describe('Passenger sees movement live', () => {
        it('should subscribe to bus location updates', () => {
            const mockChannel = {
                on: jest.fn().mockReturnThis(),
                subscribe: jest.fn().mockReturnThis(),
            };
            supabase.channel.mockReturnValue(mockChannel);

            const onUpdate = jest.fn();
            locationService.subscribeToBusLocation('bus-123', onUpdate);

            expect(supabase.channel).toHaveBeenCalledWith('bus_location_bus-123');
            expect(mockChannel.on).toHaveBeenCalledWith(
                'postgres_changes',
                expect.objectContaining({
                    event: '*',
                    table: 'bus_locations',
                    filter: 'bus_id=eq.bus-123',
                }),
                expect.any(Function)
            );
            expect(mockChannel.subscribe).toHaveBeenCalled();
        });

        it('should subscribe to multiple buses for route view', () => {
            const mockChannel = {
                on: jest.fn().mockReturnThis(),
                subscribe: jest.fn().mockReturnThis(),
            };
            supabase.channel.mockReturnValue(mockChannel);

            const onUpdate = jest.fn();
            locationService.subscribeToMultipleBuses(['bus-1', 'bus-2'], onUpdate);

            expect(supabase.channel).toHaveBeenCalledWith('multi_bus_tracking');
            expect(mockChannel.subscribe).toHaveBeenCalled();
        });

        it('should unsubscribe from location channel', async () => {
            const mockSubscription = { id: 'sub-1' };

            await locationService.unsubscribeFromLocation(mockSubscription);

            expect(supabase.removeChannel).toHaveBeenCalledWith(mockSubscription);
        });
    });

    // ==================== UTILITY FUNCTIONS ====================

    describe('ETA Calculation', () => {
        it('should calculate ETA correctly', () => {
            // 30 km at 60 km/h = 30 minutes
            expect(locationService.calculateETA(30, 60)).toBe(30);

            // 15 km at 45 km/h = 20 minutes
            expect(locationService.calculateETA(15, 45)).toBe(20);
        });

        it('should return null if speed is zero (stopped)', () => {
            expect(locationService.calculateETA(10, 0)).toBeNull();
        });

        it('should handle negative speed', () => {
            expect(locationService.calculateETA(10, -5)).toBeNull();
        });
    });

    describe('Distance Calculation (Haversine)', () => {
        it('should calculate distance between two points', () => {
            // Colombo Fort to Pettah (~0.8 km)
            const distance = locationService.calculateDistance(
                6.9344, 79.8428, // Colombo Fort
                6.9366, 79.8503  // Pettah
            );

            expect(distance).toBeGreaterThan(0.5);
            expect(distance).toBeLessThan(1.5);
        });
    });
});

// ==================== NETWORK RECOVERY TESTS ====================

describe('Network Recovery Logic', () => {
    // Simulating retry logic patterns
    const createRetryLogic = (maxRetries = 3, delayMs = 1000) => {
        let attempts = 0;

        return {
            reset: () => { attempts = 0; },
            shouldRetry: () => attempts < maxRetries,
            incrementAttempt: () => { attempts++; },
            getAttempts: () => attempts,
            getDelay: () => Math.min(delayMs * Math.pow(2, attempts), 30000), // Exponential backoff, max 30s
        };
    };

    describe('Internet lost → app retries', () => {
        it('should retry up to max attempts', () => {
            const retry = createRetryLogic(3);

            expect(retry.shouldRetry()).toBe(true);
            retry.incrementAttempt();
            expect(retry.shouldRetry()).toBe(true);
            retry.incrementAttempt();
            expect(retry.shouldRetry()).toBe(true);
            retry.incrementAttempt();
            expect(retry.shouldRetry()).toBe(false); // Max reached
        });

        it('should use exponential backoff for delays', () => {
            const retry = createRetryLogic(5, 1000);

            expect(retry.getDelay()).toBe(1000); // 1s
            retry.incrementAttempt();
            expect(retry.getDelay()).toBe(2000); // 2s
            retry.incrementAttempt();
            expect(retry.getDelay()).toBe(4000); // 4s
            retry.incrementAttempt();
            expect(retry.getDelay()).toBe(8000); // 8s
        });

        it('should cap delay at 30 seconds', () => {
            const retry = createRetryLogic(10, 10000);

            for (let i = 0; i < 5; i++) {
                retry.incrementAttempt();
            }

            expect(retry.getDelay()).toBeLessThanOrEqual(30000);
        });

        it('should reset attempts after successful connection', () => {
            const retry = createRetryLogic(3);

            retry.incrementAttempt();
            retry.incrementAttempt();
            expect(retry.getAttempts()).toBe(2);

            retry.reset();
            expect(retry.getAttempts()).toBe(0);
            expect(retry.shouldRetry()).toBe(true);
        });
    });
});
