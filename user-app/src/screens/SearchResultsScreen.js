import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const SearchResultsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);

    useEffect(() => {
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
                    price: 'Rs. 950',
                    seats: 5,
                    duration: '3h 30m',
                    plate: 'NC-1234'
                },
                {
                    id: '3',
                    operator: 'Semi-Luxury Normal',
                    routeNo: '01',
                    depTime: '06:45 AM',
                    arrTime: '10:45 AM',
                    type: 'Normal',
                    price: 'Rs. 450',
                    seats: 0,
                    crowd: 'High',
                    duration: '4h 00m',
                    plate: 'NB-9900'
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
                <View style={styles.durationContainer}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                    <View style={styles.dottedLine} />
                    <Ionicons name="bus-outline" size={16} color="#9CA3AF" />
                </View>
                <View style={[styles.timeBlock, { alignItems: 'flex-end' }]}>
                    <Text style={styles.timeText}>{item.arrTime}</Text>
                    <Text style={styles.placeText}>Kandy</Text>
                </View>
            </View>

            <View style={styles.footerRow}>
                <View style={styles.badges}>
                    <View style={[styles.badge, { backgroundColor: '#F3F4F6' }]}>
                        <Text style={styles.badgeText}>{item.type}</Text>
                    </View>
                    <View style={[styles.badge, item.seats ? { backgroundColor: '#ECFDF5' } : { backgroundColor: '#FEF2F2' }]}>
                        <Text style={[styles.badgeText, item.seats && { color: '#059669' }]}>
                            {item.seats ? `${item.seats} Seats Left` : `${item.crowd} Crowd`}
                        </Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    {item.type !== 'Normal' ? (
                        <TouchableOpacity
                            style={styles.bookButton}
                            onPress={() => navigation.navigate('SeatSelection', { bus: item })}
                        >
                            <Text style={styles.bookButtonText}>Book</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.disabledButton}>
                            <Text style={styles.disabledButtonText}>Walk-in</Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.trackButton}
                        onPress={() => navigation.navigate('LiveMap', { routeId: item.routeNo, busId: item.plate, directTrack: true })}
                    >
                        <Feather name="navigation" size={18} color="#1F2937" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>Colombo ➔ Kandy</Text>
                    <Text style={styles.headerSubtitle}>Today, 19 Jan</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultCount}>{results.length} Buses Found</Text>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Feather name="filter" size={16} color="#4B5563" />
                    </TouchableOpacity>
                </View>

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
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
    headerSubtitle: { fontSize: 12, color: '#6B7280' },
    content: { flex: 1 },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    resultCount: { fontSize: 14, fontWeight: '700', color: '#374151' },
    filterBtn: {
        padding: 8,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    list: { paddingHorizontal: 24, paddingBottom: 40 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    operatorText: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
    routeText: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    priceText: { fontSize: 18, fontWeight: '800', color: '#059669' },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    timeBlock: { flex: 1 },
    timeText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    placeText: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
    durationContainer: { flex: 1, alignItems: 'center' },
    durationText: { fontSize: 10, color: '#9CA3AF', marginBottom: 4 },
    dottedLine: {
        width: '80%',
        height: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        marginBottom: -8,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 16,
    },
    badges: { flexDirection: 'row', gap: 8 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '700', color: '#374151' },
    actions: { flexDirection: 'row', gap: 8 },
    bookButton: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    bookButtonText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
    trackButton: {
        padding: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
    },
    disabledButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    disabledButtonText: { color: '#9CA3AF', fontWeight: '700', fontSize: 12 },
});

export default SearchResultsScreen;
