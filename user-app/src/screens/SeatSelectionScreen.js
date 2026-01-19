import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const SeatSelectionScreen = ({ navigation, route }) => {
    const { bus } = route.params;
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Mock seat layout (1 = booked, 0 = available, null = aisle)
    const seatsLeft = [
        [1, 0], [0, 0], [1, 1], [0, 0], [0, 1],
        [0, 0], [1, 0], [0, 0], [0, 0], [0, 0]
    ];

    const seatsRight = [
        [0, 1], [0, 0], [1, 0], [0, 0], [1, 1],
        [0, 0], [0, 1], [0, 0], [0, 0], [0, 0]
    ];

    const handleSeatPress = (side, row, col) => {
        const seatId = `${side}-${row}-${col}`;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const getSeatStyle = (status, isSelected) => {
        if (status === 1) return styles.seatBooked;
        if (isSelected) return styles.seatSelected;
        return styles.seatAvailable;
    };

    const renderSeat = (status, side, row, col) => {
        const seatId = `${side}-${row}-${col}`;
        const isSelected = selectedSeats.includes(seatId);

        return (
            <TouchableOpacity
                key={`seat-${side}-${row}-${col}`}
                style={[styles.seat, getSeatStyle(status, isSelected)]}
                onPress={() => status === 0 && handleSeatPress(side, row, col)}
                disabled={status === 1}
            >
                <View style={[styles.seatTop, isSelected && { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
                <View style={[styles.seatBottom, isSelected && { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Seats</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.busContainer}>
                <View style={styles.driverSection}>
                    <Ionicons name="person" size={24} color="#9CA3AF" />
                    <Text style={styles.driverText}>Driver</Text>
                </View>

                <ScrollView style={styles.seatsArea} showsVerticalScrollIndicator={false}>
                    {seatsLeft.map((row, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={styles.seatRow}>
                            <View style={styles.seatSide}>
                                {row.map((status, colIndex) => renderSeat(status, 'L', rowIndex, colIndex))}
                            </View>
                            <View style={styles.aisle} />
                            <View style={styles.seatSide}>
                                {seatsRight[rowIndex].map((status, colIndex) => renderSeat(status, 'R', rowIndex, colIndex))}
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.seatLegend, styles.seatAvailable]} />
                        <Text style={styles.legendText}>Available</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.seatLegend, styles.seatSelected]} />
                        <Text style={styles.legendText}>Selected</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.seatLegend, styles.seatBooked]} />
                        <Text style={styles.legendText}>Booked</Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceLabel}>Total Price</Text>
                    <Text style={styles.totalPrice}>
                        Rs. {selectedSeats.length * parseInt(bus.price.replace(/\D/g, ''))}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.confirmButton, selectedSeats.length === 0 && styles.disabledButton]}
                    disabled={selectedSeats.length === 0}
                    onPress={() => navigation.navigate('PassengerDetails', { bus, seats: selectedSeats })}
                >
                    <Text style={styles.confirmButtonText}>Confirm Seats</Text>
                    <Feather name="arrow-right" size={20} color={selectedSeats.length > 0 ? "#FFF" : "#9CA3AF"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
    },
    busContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 32,
        paddingBottom: 120, // Space for footer
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 8,
    },
    driverSection: {
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 16,
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    driverText: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
    seatsArea: { flex: 1 },
    seatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    seatSide: { flexDirection: 'row', gap: 12 },
    aisle: { width: 30 },
    seat: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        padding: 2,
    },
    seatAvailable: {
        backgroundColor: '#FFF',
        borderColor: '#D1D5DB',
    },
    seatSelected: {
        backgroundColor: '#1F2937',
        borderColor: '#1F2937',
    },
    seatBooked: {
        backgroundColor: '#F3F4F6',
        borderColor: '#F3F4F6',
    },
    seatTop: {
        flex: 1,
        borderRadius: 6,
        marginBottom: 2,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    seatBottom: {
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 16,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    seatLegend: { width: 16, height: 16, borderRadius: 4, borderWidth: 1 },
    legendText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 24,
        paddingBottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.05,
        elevation: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    priceLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
    totalPrice: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
    confirmButton: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    confirmButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    disabledButton: { backgroundColor: '#F3F4F6' },
});

export default SeatSelectionScreen;
