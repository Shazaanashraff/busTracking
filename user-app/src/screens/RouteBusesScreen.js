import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

const RouteBusesScreen = ({ route, navigation }) => {
    const { route: routeNumber } = route.params;
    const [loading, setLoading] = useState(true);
    const [buses, setBuses] = useState([]);

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
            case 'Low': return '#059669';
            case 'Medium': return '#D97706';
            case 'High': return '#DC2626';
            default: return '#6B7280';
        }
    };

    const renderBusItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                    <Ionicons name="bus" size={24} color="#1F2937" />
                </View>
                <View>
                    <Text style={styles.plateNumber}>{item.plate}</Text>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badge, { backgroundColor: '#F3F4F6' }]}>
                            <Text style={styles.badgeText}>{item.type}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: '#FEF2F2' }]}>
                            <Text style={[styles.badgeText, { color: getCrowdColor(item.crowd) }]}>{item.crowd} Crowd</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.cardRight}>
                <Text style={styles.etaTime}>{item.time}</Text>
                <Text style={styles.distance}>{item.distance}</Text>
                <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate('LiveMap', { routeId: routeNumber, busId: item.plate, directTrack: true })}
                >
                    <Text style={styles.trackButtonText}>Track</Text>
                    <Feather name="navigation" size={14} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Route {routeNumber}</Text>
                    <Text style={styles.headerSubtitle}>Live Buses Available</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1F2937" />
                        <Text style={styles.loadingText}>Locating buses...</Text>
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
                                <Feather name="slash" size={40} color="#9CA3AF" />
                                <Text style={styles.emptyText}>No live buses found on this route.</Text>
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
    header: {
        paddingTop: 60,
        paddingBottom: 24,
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
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 1,
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', textAlign: 'center' },
    headerSubtitle: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
    content: { flex: 1, paddingHorizontal: 24 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 16, color: '#6B7280', fontSize: 14 },
    listContent: { paddingBottom: 40 },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        elevation: 2,
    },
    cardLeft: { flexDirection: 'row', gap: 16, flex: 1 },
    iconBox: {
        width: 48,
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plateNumber: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
    badgeRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: '700', color: '#374151' },
    cardRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
    etaTime: { fontSize: 16, fontWeight: '700', color: '#059669' },
    distance: { fontSize: 12, color: '#9CA3AF' },
    trackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 4,
        marginTop: 4,
    },
    trackButtonText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
    emptyState: { alignItems: 'center', marginTop: 100, gap: 16 },
    emptyText: { color: '#6B7280', fontSize: 16 },
});

export default RouteBusesScreen;
