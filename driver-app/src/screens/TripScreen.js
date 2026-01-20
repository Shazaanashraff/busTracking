import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Dimensions, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import api from '../services/api';

const { width } = Dimensions.get('window');

const TripScreen = () => {
    const [isTripStarted, setIsTripStarted] = useState(false);
    const [crowdLevel, setCrowdLevel] = useState(null); // 'Low', 'Medium', 'High'
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        if (isTripStarted) {
            startPulse();
        }
    }, [isTripStarted]);

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const handleStartTrip = () => {
        setIsTripStarted(true);
        // Integrate GPS Logic Here
    };

    const handleEndTrip = () => {
        setIsTripStarted(false);
        setCrowdLevel(null);
        // Stop GPS Logic Here
    };

    const handleCrowdUpdate = (level) => {
        setCrowdLevel(level);
        // Call API
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning,</Text>
                    <Text style={styles.driverName}>Kamal (Driver)</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: isTripStarted ? '#DEF7EC' : '#F3F4F6' }]}>
                    <View style={[styles.statusDot, { backgroundColor: isTripStarted ? '#059669' : '#9CA3AF' }]} />
                    <Text style={[styles.statusText, { color: isTripStarted ? '#03543F' : '#6B7280' }]}>
                        {isTripStarted ? 'LIVE TRIP' : 'OFFLINE'}
                    </Text>
                </View>
            </View>

            <View style={styles.content}>

                {/* Trip Details Card */}
                <View style={styles.card}>
                    <View style={styles.routeRow}>
                        <View style={styles.routeBadge}>
                            <Text style={styles.routeText}>138</Text>
                        </View>
                        <View>
                            <Text style={styles.destinationText}>Pettah - Homagama</Text>
                            <Text style={styles.plateText}>ND-4567</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.timeRow}>
                        <View style={styles.timeItem}>
                            <Text style={styles.timeLabel}>Start</Text>
                            <Text style={styles.timeValue}>08:30 AM</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
                        <View style={styles.timeItem}>
                            <Text style={styles.timeLabel}>End</Text>
                            <Text style={styles.timeValue}>10:00 AM</Text>
                        </View>
                    </View>
                </View>

                {/* Dynamic Action Area */}
                {isTripStarted ? (
                    <View style={styles.liveArea}>
                        {/* Fake Map / Location Status */}
                        <View style={styles.mapPlaceholder}>
                            <Animated.View style={[styles.locationPuck, { transform: [{ scale: pulseAnim }] }]}>
                                <View style={styles.locationInner} />
                            </Animated.View>
                            <Text style={styles.mapText}>Tracking Location...</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Crowd Level</Text>
                        <View style={styles.crowdGrid}>
                            <TouchableOpacity
                                style={[styles.crowdBtn, crowdLevel === 'Low' && styles.crowdLowActive]}
                                onPress={() => handleCrowdUpdate('Low')}
                            >
                                <View style={[styles.crowdDot, { backgroundColor: '#10B981' }]} />
                                <Text style={styles.crowdLabel}>Free</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.crowdBtn, crowdLevel === 'Medium' && styles.crowdMedActive]}
                                onPress={() => handleCrowdUpdate('Medium')}
                            >
                                <View style={[styles.crowdDot, { backgroundColor: '#F59E0B' }]} />
                                <Text style={styles.crowdLabel}>Medium</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.crowdBtn, crowdLevel === 'High' && styles.crowdHighActive]}
                                onPress={() => handleCrowdUpdate('High')}
                            >
                                <View style={[styles.crowdDot, { backgroundColor: '#EF4444' }]} />
                                <Text style={styles.crowdLabel}>Full</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.endBtn} onPress={handleEndTrip}>
                            <Ionicons name="stop" size={24} color="#FFF" />
                            <Text style={styles.endBtnText}>End Trip</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.idleArea}>
                        <TouchableOpacity style={styles.startBtn} onPress={handleStartTrip} activeOpacity={0.8}>
                            <View style={styles.startIconCircle}>
                                <Ionicons name="play" size={32} color="#059669" style={{ marginLeft: 4 }} />
                            </View>
                            <Text style={styles.startBtnText}>Start Trip</Text>
                            <Text style={styles.startBtnSub}>Share GPS Location</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 10
    },
    greeting: { color: '#6B7280', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
    driverName: { color: '#1F2937', fontSize: 22, fontWeight: '800' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 6 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 12, fontWeight: '700' },

    content: { padding: 24 },

    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        elevation: 4,
        marginBottom: 32
    },
    routeRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    routeBadge: { width: 56, height: 56, backgroundColor: '#1F2937', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    routeText: { color: '#FFF', fontSize: 20, fontWeight: '800' },
    destinationText: { color: '#1F2937', fontSize: 16, fontWeight: '700' },
    plateText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
    timeItem: { alignItems: 'center' },
    timeLabel: { color: '#9CA3AF', fontSize: 12, marginBottom: 4 },
    timeValue: { color: '#1F2937', fontSize: 16, fontWeight: '700' },

    startBtn: {
        backgroundColor: '#059669',
        borderRadius: 32,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        marginTop: 20
    },
    startIconCircle: {
        width: 80,
        height: 80,
        backgroundColor: '#FFF',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    startBtnText: { color: '#FFF', fontSize: 24, fontWeight: '800' },
    startBtnSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 4 },

    liveArea: { flex: 1 },
    mapPlaceholder: {
        height: 200,
        backgroundColor: '#E5E7EB',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#FFF'
    },
    locationPuck: {
        width: 24,
        height: 24,
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    locationInner: { width: 12, height: 12, backgroundColor: '#3B82F6', borderRadius: 6, borderWidth: 2, borderColor: '#FFF' },
    mapText: { color: '#6B7280', fontSize: 12, fontWeight: '600' },

    sectionTitle: { color: '#1F2937', fontSize: 16, fontWeight: '700', marginBottom: 12 },
    crowdGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    crowdBtn: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F3F4F6'
    },
    crowdDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 8 },
    crowdLabel: { color: '#4B5563', fontWeight: '600', fontSize: 13 },

    crowdLowActive: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
    crowdMedActive: { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
    crowdHighActive: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },

    endBtn: {
        backgroundColor: '#1F2937',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        gap: 12
    },
    endBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});

export default TripScreen;
