import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';

const MyBookingsScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('upcoming');

    const upcomingBookings = [
        {
            id: 'BK-8821',
            date: '19 Jan 2026',
            time: '06:00 AM',
            route: 'Colombo ➔ Kandy',
            operator: 'SLTB Super Luxury',
            plate: 'ND-4567',
            seats: ['R-2', 'R-3'],
            status: 'confirmed',
            amount: 'Rs. 2,400',
            depTime: '06:00 AM'
        }
    ];

    const pastBookings = [
        {
            id: 'BK-1023',
            date: '12 Dec 2025',
            time: '02:30 PM',
            route: 'Kandy ➔ Colombo',
            operator: 'NTC Intercity',
            plate: 'NC-1234',
            seats: ['L-1'],
            status: 'completed',
            amount: 'Rs. 850',
            depTime: '02:30 PM'
        },
        {
            id: 'BK-0012',
            date: '10 Nov 2025',
            time: '08:00 AM',
            route: 'Galle ➔ Colombo',
            operator: 'Highway Express',
            plate: 'NB-9900',
            seats: ['L-4', 'L-5'],
            status: 'completed',
            amount: 'Rs. 1,800',
            depTime: '08:00 AM'
        }
    ];

    const renderBooking = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Ticket', {
                bus: { operator: item.operator, plate: item.plate, routeNo: '01', depTime: item.depTime },
                seats: item.seats,
                passenger: { name: 'Kasun Perera' }, // Mock passenger
                totalAmount: item.amount
            })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{item.date} • {item.time}</Text>
                <View style={[styles.statusBadge, item.status === 'completed' ? styles.completedBadge : styles.confirmedBadge]}>
                    <Text style={[styles.statusText, item.status === 'completed' ? styles.completedText : styles.confirmedText]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <Text style={styles.routeText}>{item.route}</Text>
            <Text style={styles.detailsText}>{item.operator} • {item.plate}</Text>

            <View style={styles.cardFooter}>
                {/* Upcoming Actions */}
                {activeTab === 'upcoming' ? (
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => alert('Booking Cancelled')}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.trackBtn}
                            onPress={() => navigation.navigate('LiveMap', { routeId: '01', busId: item.plate, directTrack: true })}
                        >
                            <Text style={styles.trackText}>Track Bus 📍</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* History Actions */
                    <View style={styles.historyFooter}>
                        <Text style={styles.seatsText}>Seats: {item.seats.join(', ').replace(/R-|L-/g, '')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Ticket', { bus: item, seats: item.seats, passenger: {}, totalAmount: item.amount })}>
                            <Text style={styles.viewTicketText}>View Ticket →</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Bookings</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={activeTab === 'upcoming' ? upcomingBookings : pastBookings}
                    renderItem={renderBooking}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={{ fontSize: 40, marginBottom: 10 }}>🎫</Text>
                            <Text style={styles.emptyText}>No bookings found</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FCD24A' },
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
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
    },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
    activeTab: { backgroundColor: '#FFF', elevation: 2 },
    tabText: { fontWeight: '600', color: '#6B7280' },
    activeTabText: { color: '#1F2937', fontWeight: '700' },
    list: { paddingBottom: 20 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    dateText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    confirmedBadge: { backgroundColor: '#ECFDF5' },
    completedBadge: { backgroundColor: '#F3F4F6' },
    statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    confirmedText: { color: '#059669' },
    completedText: { color: '#6B7280' },
    routeText: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
    detailsText: { fontSize: 12, color: '#4B5563', marginBottom: 12 },
    cardFooter: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
    },
    cancelText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#EF4444',
    },
    trackBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#ECFDF5',
    },
    trackText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669',
    },
    historyFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seatsText: { fontSize: 12, fontWeight: '600', color: '#374151' },
    viewTicketText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
    emptyState: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#9CA3AF', fontWeight: '600' }
});

export default MyBookingsScreen;
