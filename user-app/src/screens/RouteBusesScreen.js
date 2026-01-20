import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const RouteBusesScreen = ({ route, navigation }) => {
    // Handling route params safely
    const routeNumber = route.params?.route || 'Unknown';

    const [loading, setLoading] = useState(true);
    const [buses, setBuses] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        // Mock API call simulation
        setTimeout(() => {
            setBuses([
                { id: '1', plate: 'ND-4567', distance: '1.2 km away', time: '5 mins', crowd: 'High', type: 'Normal' },
                { id: '2', plate: 'NC-1234', distance: '3.5 km away', time: '12 mins', crowd: 'Medium', type: 'Semi-Luxury' },
                { id: '3', plate: 'NB-9900', distance: '8.0 km away', time: '25 mins', crowd: 'Low', type: 'AC' },
            ]);
            setLoading(false);
        }, 1500);
    }, []);

    const getCrowdColor = (level) => {
        switch (level) {
            case 'Low': return '#10B981'; // Green
            case 'Medium': return '#F59E0B'; // Yellow/Orange
            case 'High': return '#EF4444'; // Red
            default: return '#6B7280';
        }
    };

    const getCrowdWidth = (level) => {
        switch (level) {
            case 'Low': return '30%';
            case 'Medium': return '60%';
            case 'High': return '90%';
            default: return '0%';
        }
    };

    const renderBusItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('LiveMap', { routeId: routeNumber, busId: item.plate, directTrack: true })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.busIconContainer}>
                    <Ionicons name="bus" size={24} color="#FFF" />
                </View>
                <View style={styles.busInfo}>
                    <Text style={styles.plateNumber}>{item.plate}</Text>
                    <Text style={styles.busType}>{item.type}</Text>
                </View>
                <View style={styles.etaContainer}>
                    <Text style={styles.etaTime}>{item.time}</Text>
                    <Text style={styles.etaLabel}>ETA</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <View style={styles.crowdContainer}>
                    <Text style={styles.crowdLabel}>Crowd: <Text style={{ color: getCrowdColor(item.crowd), fontWeight: '700' }}>{item.crowd}</Text></Text>
                    <View style={styles.crowdBarBg}>
                        <View style={[styles.crowdBarFill, { width: getCrowdWidth(item.crowd), backgroundColor: getCrowdColor(item.crowd) }]} />
                    </View>
                </View>
                <View style={styles.distanceBadge}>
                    <Feather name="map-pin" size={12} color="#4B5563" />
                    <Text style={styles.distanceText}>{item.distance}</Text>
                </View>
            </View>

            <View style={styles.trackAction}>
                <Text style={styles.trackText}>Track Live</Text>
                <Feather name="arrow-right" size={16} color="#FFF" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={styles.headerTitle}>Route {routeNumber}</Text>
                    </View>
                    <View style={{ width: 44 }} />
                </View>

                <Text style={styles.headerSubtitle}>Select a bus to track its real-time location</Text>

                {/* Filter Chips */}
                <View style={styles.filterContainer}>
                    {['All', 'AC', 'Normal', 'Semi-Luxury'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.filterChip, filter === type && styles.activeFilterChip]}
                            onPress={() => setFilter(type)}
                        >
                            <Text style={[styles.filterText, filter === type && styles.activeFilterText]}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1F2937" />
                        <Text style={styles.loadingText}>Locating nearby buses...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={buses}
                        renderItem={renderBusItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconBox}>
                                    <Feather name="slash" size={32} color="#9CA3AF" />
                                </View>
                                <Text style={styles.emptyText}>No buses found</Text>
                                <Text style={styles.emptySubText}>There are no matching buses running on this route right now.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },

    headerContainer: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 24,
        backgroundColor: '#F3F4F6',
        zIndex: 1,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    backButton: {
        width: 44,
        height: 44,
        backgroundColor: '#FFF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
    headerSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20, textAlign: 'center' },

    filterContainer: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeFilterChip: { backgroundColor: '#1F2937', borderColor: '#1F2937' },
    filterText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
    activeFilterText: { color: '#FFF' },

    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 16, color: '#6B7280', fontSize: 14, fontWeight: '500' },
    listContent: { paddingBottom: 40 },

    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    busIconContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#1F2937',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    busInfo: { flex: 1 },
    plateNumber: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    busType: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    etaContainer: { alignItems: 'flex-end' },
    etaTime: { fontSize: 18, fontWeight: '700', color: '#059669' },
    etaLabel: { fontSize: 10, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' },

    divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    crowdContainer: { flex: 1, marginRight: 24 },
    crowdLabel: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
    crowdBarBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
    crowdBarFill: { height: '100%', borderRadius: 3 },

    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
    },
    distanceText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },

    trackAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F2937',
        paddingVertical: 12,
        borderRadius: 16,
        gap: 8,
    },
    trackText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

    emptyState: { alignItems: 'center', marginTop: 80 },
    emptyIconBox: {
        width: 80,
        height: 80,
        backgroundColor: '#E5E7EB',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyText: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
    emptySubText: { fontSize: 14, color: '#6B7280', textAlign: 'center', maxWidth: 200 },
});

export default RouteBusesScreen;
