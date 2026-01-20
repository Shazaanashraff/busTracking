import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, SafeAreaView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DriverBookingsScreen = () => {

    // Tab State: 'manifest' | 'pickup'
    const [activeTab, setActiveTab] = useState('pickup');

    // Enriched Mock Data
    const [bookings, setBookings] = useState([
        { seat: '4', name: 'Nimal P.', pickup: 'Kadawatha', status: 'pending', callStatus: null },
        { seat: '7', name: 'Saman T.', pickup: 'Kiribathgoda', status: 'pending', callStatus: null },
        { seat: '12', name: 'Kamal A.', pickup: 'Nittambuwa', status: 'pending', callStatus: null },
        { seat: '15', name: 'Sunil D.', pickup: 'Warakapola', status: 'confirmed', callStatus: 'Coming' },
        { seat: '22', name: 'Perera K.', pickup: 'Kegalle', status: 'pending', callStatus: null },
    ]);

    const totalSeats = 42;
    const totalBooked = bookings.length;

    const handleCall = (passenger) => {
        Alert.alert(
            "Calling Passenger",
            `Connecting to ${passenger.name} (${passenger.seat}) via masked number...`,
            [{ text: "End Call" }]
        );
    };

    const updateStatus = (seat, newStatus) => {
        setBookings(prev => prev.map(b =>
            b.seat === seat ? { ...b, callStatus: newStatus } : b
        ));
    };

    const renderPickupItem = (item) => (
        <View key={item.seat} style={styles.pickupCard}>
            <View style={styles.pickupRow}>
                <View style={styles.seatBadge}>
                    <Text style={styles.seatBadgeText}>{item.seat}</Text>
                </View>
                <View style={styles.passengerInfo}>
                    <Text style={styles.passengerName}>{item.name}</Text>
                    <View style={styles.pickupLocation}>
                        <Ionicons name="location-outline" size={12} color="#6B7280" />
                        <Text style={styles.pickupText}>Pickup: {item.pickup}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(item)}>
                    <Ionicons name="call" size={18} color="#FFF" />
                    <Text style={styles.callText}>Call</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionRow}>
                <Text style={styles.statusLabel}>Status:</Text>
                <View style={styles.statusButtons}>
                    <TouchableOpacity
                        style={[styles.statusBtn, item.callStatus === 'Coming' && styles.statusBtnActive, { backgroundColor: item.callStatus === 'Coming' ? '#ECFDF5' : '#F3F4F6' }]}
                        onPress={() => updateStatus(item.seat, 'Coming')}
                    >
                        <Text style={[styles.statusEmoji, { opacity: item.callStatus && item.callStatus !== 'Coming' ? 0.3 : 1 }]}>✔</Text>
                        <Text style={[styles.statusBtnText, { color: '#047857' }]}>Coming</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.statusBtn, item.callStatus === 'Not Coming' && styles.statusBtnActive, { backgroundColor: item.callStatus === 'Not Coming' ? '#FEF2F2' : '#F3F4F6' }]}
                        onPress={() => updateStatus(item.seat, 'Not Coming')}
                    >
                        <Text style={[styles.statusEmoji, { opacity: item.callStatus && item.callStatus !== 'Not Coming' ? 0.3 : 1 }]}>❌</Text>
                        <Text style={[styles.statusBtnText, { color: '#B91C1C' }]}>No</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.statusBtn, item.callStatus === 'No Answer' && styles.statusBtnActive, { backgroundColor: item.callStatus === 'No Answer' ? '#FFFBEB' : '#F3F4F6' }]}
                        onPress={() => updateStatus(item.seat, 'No Answer')}
                    >
                        <Text style={[styles.statusEmoji, { opacity: item.callStatus && item.callStatus !== 'No Answer' ? 0.3 : 1 }]}>⏳</Text>
                        <Text style={[styles.statusBtnText, { color: '#B45309' }]}>No Ans</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Trip Details</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'pickup' && styles.activeTab]}
                    onPress={() => setActiveTab('pickup')}
                >
                    <Text style={[styles.tabText, activeTab === 'pickup' && styles.activeTabText]}>Pickup List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'manifest' && styles.activeTab]}
                    onPress={() => setActiveTab('manifest')}
                >
                    <Text style={[styles.tabText, activeTab === 'manifest' && styles.activeTabText]}>Seat Map</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{totalBooked}</Text>
                        <Text style={styles.summaryLabel}>Booked</Text>
                    </View>
                    <View style={styles.cardDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{totalSeats - totalBooked}</Text>
                        <Text style={[styles.summaryLabel, { color: '#059669' }]}>Available</Text>
                    </View>
                </View>

                {activeTab === 'pickup' ? (
                    <View style={styles.listContainer}>
                        {bookings.map(renderPickupItem)}
                    </View>
                ) : (
                    <>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="grid-outline" size={20} color="#1F2937" />
                                <Text style={styles.sectionTitle}>Seat Map</Text>
                            </View>

                            <View style={styles.seatGrid}>
                                {Array.from({ length: totalSeats }, (_, i) => {
                                    const seatNum = (i + 1).toString();
                                    const booking = bookings.find(b => b.seat === seatNum);
                                    const isBooked = !!booking;

                                    return (
                                        <View
                                            key={seatNum}
                                            style={[
                                                styles.seat,
                                                isBooked ? styles.seatBooked : styles.seatFree,
                                                booking?.callStatus === 'Not Coming' && styles.seatCancelled
                                            ]}
                                        >
                                            <Text style={[
                                                styles.seatText,
                                                isBooked ? styles.seatTextBooked : styles.seatTextFree
                                            ]}>{seatNum}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.legend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.seat, styles.seatBooked, { width: 24, height: 24 }]} />
                                <Text style={styles.legendText}>Booked</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.seat, styles.seatCancelled, { width: 24, height: 24 }]} />
                                <Text style={styles.legendText}>Cancelled</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.seat, styles.seatFree, { width: 24, height: 24 }]} />
                                <Text style={styles.legendText}>Free</Text>
                            </View>
                        </View>
                    </>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 24, paddingBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
    content: { padding: 24, paddingBottom: 100 },

    tabContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16 },
    tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, backgroundColor: '#E5E7EB' },
    activeTab: { backgroundColor: '#1F2937' },
    tabText: { fontWeight: '600', color: '#6B7280' },
    activeTabText: { color: '#FFF' },

    summaryCard: {
        backgroundColor: '#1F2937',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#1F2937',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        elevation: 8,
    },
    summaryItem: { alignItems: 'center' },
    summaryValue: { color: '#FFF', fontSize: 32, fontWeight: '800' },
    summaryLabel: { color: '#9CA3AF', fontSize: 13, fontWeight: '600', marginTop: 4 },
    cardDivider: { width: 1, height: 40, backgroundColor: '#374151' },

    // Pickup List Styles
    listContainer: { gap: 16 },
    pickupCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, elevation: 2 },
    pickupRow: { flexDirection: 'row', alignItems: 'center' },
    seatBadge: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    seatBadgeText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
    passengerInfo: { flex: 1 },
    passengerName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    pickupLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    pickupText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
    callBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, gap: 6 },
    callText: { color: '#FFF', fontWeight: '700', fontSize: 13 },

    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },

    actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statusLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
    statusButtons: { flexDirection: 'row', gap: 8 },
    statusBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6, borderWidth: 1, borderColor: '#F3F4F6' },
    statusBtnActive: { borderColor: 'transparent' },
    statusEmoji: { fontSize: 12 },
    statusBtnText: { fontSize: 12, fontWeight: '700' },

    // Seat Map Styles
    section: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 2 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

    seatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
    seat: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
    seatBooked: { backgroundColor: '#1F2937', borderColor: '#1F2937' },
    seatFree: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
    seatCancelled: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
    seatText: { fontSize: 12, fontWeight: '700' },
    seatTextBooked: { color: '#FFF' },
    seatTextFree: { color: '#9CA3AF' },

    legend: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 24 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    legendText: { color: '#4B5563', fontSize: 14, fontWeight: '500' }
});

export default DriverBookingsScreen;
