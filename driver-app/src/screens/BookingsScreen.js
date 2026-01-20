import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BookingsScreen = () => {
    // Mock Data
    const [bookings, setBookings] = useState([
        { id: '1', name: 'Kamal Perera', phone: '077****321', seat: '4', route: '138', date: 'Today, 10:30 AM', status: 'Confirmed', price: '850' },
        { id: '2', name: 'Nimali Silva', phone: '076****882', seat: '5', route: '138', date: 'Today, 10:32 AM', status: 'Confirmed', price: '850' },
        { id: '3', name: 'Sunil Dias', phone: '071****554', seat: '12', route: '177', date: 'Yesterday, 04:15 PM', status: 'Completed', price: '450' },
        { id: '4', name: 'Chathura Rao', phone: '077****991', seat: '8', route: '138', date: 'Today, 09:00 AM', status: 'Cancelled', price: '850' },
    ]);
    const [filter, setFilter] = useState('All'); // All, Confirmed, Cancelled

    const renderBookingItem = ({ item }) => (
        <View style={styles.bookingCard}>
            <View style={styles.cardHeader}>
                <View style={styles.userContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                    </View>
                    <View>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userPhone}>{item.phone}</Text>
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>LKR {item.price}</Text>
                    <Text style={[
                        styles.statusText,
                        { color: item.status === 'Cancelled' ? '#EF4444' : item.status === 'Completed' ? '#059669' : '#3B82F6' }
                    ]}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Ionicons name="bus-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailText}>Route {item.route}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{item.date}</Text>
                </View>
                <View style={styles.seatBadge}>
                    <Text style={styles.seatText}>Seat {item.seat}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bookings</Text>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="filter" size={20} color="#1F2937" />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsContainer}>
                {['All', 'Confirmed', 'Cancelled'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, filter === tab && styles.activeTab]}
                        onPress={() => setFilter(tab)}
                    >
                        <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={bookings.filter(b => filter === 'All' || b.status === filter)}
                renderItem={renderBookingItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
    },
    filterBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },
    activeTab: {
        backgroundColor: '#1F2937',
    },
    tabText: {
        color: '#6B7280',
        fontWeight: '600',
        fontSize: 14
    },
    activeTabText: {
        color: '#FFF'
    },
    listContent: {
        padding: 20,
        paddingTop: 0
    },
    bookingCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937'
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937'
    },
    userPhone: {
        fontSize: 12,
        color: '#9CA3AF'
    },
    priceContainer: {
        alignItems: 'flex-end'
    },
    priceText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937'
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 2
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    detailText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500'
    },
    seatBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BFDBFE'
    },
    seatText: {
        color: '#1D4ED8',
        fontSize: 12,
        fontWeight: '700'
    }
});

export default BookingsScreen;
