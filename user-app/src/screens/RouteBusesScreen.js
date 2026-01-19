import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';

const RouteBusesScreen = ({ navigation, route }) => {
    const { route: routeNumber } = route.params; // e.g. "138"
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch buses for route
        setTimeout(() => {
            setBuses([
                { id: '1', plate: 'ND-4567', distance: '1.2 km away', crowd: 'medium', eta: '5 min', type: 'Normal' },
                { id: '2', plate: 'NC-1234', distance: '3.5 km away', crowd: 'low', eta: '12 min', type: 'AC' },
                { id: '3', plate: 'NB-9876', distance: '5.0 km away', crowd: 'high', eta: '20 min', type: 'Normal' },
                { id: '4', plate: 'ND-1111', distance: '8.2 km away', crowd: 'medium', eta: '35 min', type: 'Luxury' }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const getCrowdColor = (level) => {
        switch (level) {
            case 'low': return '#22C55E'; // Green
            case 'medium': return '#EAB308'; // Yellow
            case 'high': return '#EF4444'; // Red
            default: return '#9CA3AF';
        }
    };

    const renderBus = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.busIconBadge}>
                    <Text style={styles.busIcon}>🚌</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.plateNumber}>{item.plate}</Text>
                    <Text style={styles.routeBadge}>Route {routeNumber}</Text>
                </View>
                <View style={styles.etaContainer}>
                    <Text style={styles.etaText}>{item.eta}</Text>
                    <Text style={styles.etaLabel}>ETA</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>{item.distance}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Type</Text>
                    <Text style={styles.statValue}>{item.type}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Crowd</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.crowdDot, { backgroundColor: getCrowdColor(item.crowd) }]} />
                        <Text style={[styles.statValue, { textTransform: 'capitalize' }]}>{item.crowd}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate('LiveMap', { routeId: routeNumber, busId: item.plate })}
                >
                    <Text style={styles.trackButtonText}>📍 Track</Text>
                </TouchableOpacity>

                {(item.type === 'Luxury' || item.type === 'AC') && (
                    <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => navigation.navigate('SeatSelection', { bus: item })}
                    >
                        <Text style={styles.bookButtonText}>🎟️ Book</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Route {routeNumber}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.filterRow}>
                    <Text style={styles.resultCount}>{buses.length} Buses Live</Text>
                    <TouchableOpacity><Text style={styles.filterText}>Filter 🔽</Text></TouchableOpacity>
                </View>

                <FlatList
                    data={buses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderBus}
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
        justifyContent: 'space-between',
        alignItems: 'center',
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
    screenTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
    },
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    resultCount: {
        fontWeight: '700',
        color: '#374151',
    },
    filterText: {
        color: '#2563EB',
        fontWeight: '600',
    },
    list: { paddingBottom: 40 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    busIconBadge: {
        width: 48,
        height: 48,
        backgroundColor: '#FEF3C7',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    busIcon: { fontSize: 24 },
    headerInfo: { flex: 1 },
    plateNumber: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
    },
    routeBadge: {
        fontSize: 12,
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 4,
    },
    etaContainer: {
        alignItems: 'flex-end',
    },
    etaText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#059669',
    },
    etaLabel: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '700',
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    statRow: { alignItems: 'center' },
    statLabel: { fontSize: 10, color: '#9CA3AF', marginBottom: 2 },
    statValue: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
    crowdDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
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
    trackButtonText: {
        fontWeight: '700',
        color: '#1F2937',
    },
    bookButton: {
        flex: 1,
        backgroundColor: '#1F2937',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    bookButtonText: {
        fontWeight: '700',
        color: '#FFF',
    },
});

export default RouteBusesScreen;
