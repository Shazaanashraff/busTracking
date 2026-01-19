import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';

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
                <View style={styles.seatTop} />
                <View style={styles.seatBottom} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Seats</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.busContainer}>
                <View style={styles.driverSection}>
                    <Text style={styles.driverText}>👮‍♂️ Driver</Text>
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
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCD24A',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: { fontSize: 24, color: '#1F2937' },
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
        padding: 24,
        paddingBottom: 100,
    },
    driverSection: {
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 16,
        marginBottom: 16,
    },
    driverText: { fontSize: 20 },
    seatsArea: { flex: 1 },
    seatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    seatSide: { flexDirection: 'row', gap: 12 },
    aisle: { width: 30 },
    seat: {
        width: 36,
        height: 36,
        borderRadius: 8,
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
        backgroundColor: '#E5E7EB',
        borderColor: '#E5E7EB',
    },
    seatTop: {
        flex: 1,
        borderRadius: 4,
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
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    seatLegend: { width: 20, height: 20, borderRadius: 4, borderWidth: 1 },
    legendText: { fontSize: 12, color: '#6B7280' },
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
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        elevation: 10,
    },
    priceLabel: { fontSize: 12, color: '#6B7280' },
    totalPrice: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
    confirmButton: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
    },
    confirmButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    disabledButton: { backgroundColor: '#E5E7EB' },
});

export default SeatSelectionScreen;
