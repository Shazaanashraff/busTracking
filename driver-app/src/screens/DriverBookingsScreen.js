import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DriverBookingsScreen = () => {

    // Mock Limited Data (No Names/Phones)
    const bookings = [
        { seat: '2', status: 'Booked' },
        { seat: '4', status: 'Booked' },
        { seat: '6', status: 'Booked' },
        { seat: '7', status: 'Booked' },
        { seat: '8', status: 'Booked' },
        { seat: '10', status: 'Booked' },
        { seat: '14', status: 'Booked' },
        { seat: '15', status: 'Booked' },
        { seat: '21', status: 'Booked' },
        { seat: '22', status: 'Booked' },
        { seat: '25', status: 'Booked' },
        { seat: '26', status: 'Booked' },
        { seat: '29', status: 'Booked' },
        { seat: '30', status: 'Booked' },
    ];

    const totalBookings = bookings.length;
    const totalSeats = 42;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Trip Manifest</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{totalBookings}</Text>
                        <Text style={styles.summaryLabel}>Booked</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{totalSeats - totalBookings}</Text>
                        <Text style={[styles.summaryLabel, { color: '#059669' }]}>Available</Text>
                    </View>
                </View>

                {/* Seat Visualizer */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="grid-outline" size={20} color="#1F2937" />
                        <Text style={styles.sectionTitle}>Seat Map</Text>
                    </View>

                    <View style={styles.seatGrid}>
                        {Array.from({ length: totalSeats }, (_, i) => {
                            const seatNum = (i + 1).toString();
                            const isBooked = bookings.some(b => b.seat === seatNum);

                            return (
                                <View
                                    key={seatNum}
                                    style={[
                                        styles.seat,
                                        isBooked ? styles.seatBooked : styles.seatFree
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
                        <View style={[styles.seat, styles.seatFree, { width: 24, height: 24 }]} />
                        <Text style={styles.legendText}>Free</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 24, paddingBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
    content: { padding: 24, paddingBottom: 100 },

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
    divider: { width: 1, height: 40, backgroundColor: '#374151' },

    section: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 2 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

    seatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
    seat: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },
    seatBooked: { backgroundColor: '#1F2937', borderColor: '#1F2937' },
    seatFree: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
    seatText: { fontSize: 12, fontWeight: '700' },
    seatTextBooked: { color: '#FFF' },
    seatTextFree: { color: '#9CA3AF' },

    legend: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 24 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    legendText: { color: '#4B5563', fontSize: 14, fontWeight: '500' }
});

export default DriverBookingsScreen;
