import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';

const SearchResultsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);

    useEffect(() => {
        // Mock API call
        setTimeout(() => {
            setResults([
                {
                    id: '1',
                    operator: 'SLTB Super Luxury',
                    routeNo: '01',
                    depTime: '06:00 AM',
                    arrTime: '09:30 AM',
                    type: 'Luxury',
                    price: 'Rs. 1,200',
                    seats: 12,
                    duration: '3h 30m',
                    plate: 'ND-4567'
                },
                {
                    id: '2',
                    operator: 'NTC Intercity',
                    routeNo: '01',
                    depTime: '06:30 AM',
                    arrTime: '10:00 AM',
                    type: 'AC',
                    price: 'Rs. 850',
                    seats: 4,
                    duration: '3h 30m',
                    plate: 'NC-1234'
                },
                {
                    id: '3',
                    operator: 'Private Normal',
                    routeNo: '01',
                    depTime: '06:45 AM',
                    arrTime: '10:45 AM',
                    type: 'Normal',
                    price: 'Rs. 430',
                    crowd: 'High',
                    duration: '4h 00m',
                    plate: 'NB-9876'
                },
                {
                    id: '4',
                    operator: 'Highway Express',
                    routeNo: '01',
                    depTime: '07:00 AM',
                    arrTime: '10:00 AM',
                    type: 'Luxury',
                    price: 'Rs. 1,500',
                    seats: 22,
                    duration: '3h 00m',
                    plate: 'ND-1111'
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.operatorText}>{item.operator}</Text>
                    <Text style={styles.routeText}>Route {item.routeNo} • {item.plate}</Text>
                </View>
                <Text style={styles.priceText}>{item.price}</Text>
            </View>

            <View style={styles.timeRow}>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeText}>{item.depTime}</Text>
                    <Text style={styles.placeText}>Colombo</Text>
                </View>
                <Text style={styles.durationText}>---- {item.duration} ----</Text>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeText}>{item.arrTime}</Text>
                    <Text style={styles.placeText}>Kandy</Text>
                </View>
            </View>

            <View style={styles.detailsRow}>
                <View style={[styles.badge, styles.typeBadge]}>
                    <Text style={styles.badgeText}>{item.type}</Text>
                </View>
                <View style={[styles.badge, item.seats ? styles.seatBadge : styles.crowdBadge]}>
                    <Text style={[styles.badgeText, item.seats && { color: '#059669' }]}>
                        {item.seats ? `${item.seats} Seats Left` : `${item.crowd} Crowd`}
                    </Text>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate('LiveMap', { routeId: item.routeNo, busId: item.plate, directTrack: true })}
                >
                    <Text style={styles.trackButtonText}>📍 Track</Text>
                </TouchableOpacity>

                {item.type !== 'Normal' ? (
                    <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => navigation.navigate('SeatSelection', { bus: item })}
                    >
                        <Text style={styles.bookButtonText}>Book Seat</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.bookButton, styles.disabledButton]} disabled>
                        <Text style={styles.disabledButtonText}>Walk-in Only</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>Colombo ➔ Kandy</Text>
                    <Text style={styles.headerSubtitle}>Today, 19 Jan</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.resultsCount}>{results.length} Buses Found</Text>
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
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
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    resultsCount: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 16,
        marginLeft: 4,
    },
    list: { paddingBottom: 40 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    operatorText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    routeText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    priceText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#059669',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    timeBlock: { alignItems: 'center' },
    timeText: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    placeText: { fontSize: 12, color: '#6B7280' },
    durationText: { fontSize: 10, color: '#9CA3AF' },
    detailsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeBadge: { backgroundColor: '#F3F4F6' },
    seatBadge: { backgroundColor: '#ECFDF5' },
    crowdBadge: { backgroundColor: '#FEF2F2' },
    badgeText: { fontSize: 12, fontWeight: '600', color: '#374151' },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    trackButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    trackButtonText: { fontWeight: '700', color: '#1F2937' },
    bookButton: {
        flex: 1,
        backgroundColor: '#1F2937',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    bookButtonText: { fontWeight: '700', color: '#FFF' },
    disabledButton: { backgroundColor: '#E5E7EB' },
    disabledButtonText: { fontWeight: '600', color: '#9CA3AF' },
});

export default SearchResultsScreen;
