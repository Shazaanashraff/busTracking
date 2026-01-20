import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BusDetailsScreen = ({ route, navigation }) => {
    // Mock Data (In real app, fetch using route.params.busId)
    const bus = {
        plate: 'ND-4567',
        route: '138',
        routeText: 'Pettah - Homagama',
        status: 'Active',
        driver: 'Kamal Perera',
        driverPhone: '077****321',
        revenue: 'LKR 45,200',
        trips: 4,
        rating: 4.8,
        nextService: '12 Oct 2025'
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bus Details</Text>
                <TouchableOpacity style={styles.editBtn}>
                    <Ionicons name="create-outline" size={24} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Hero Card */}
                <View style={styles.heroCard}>
                    <View style={styles.busIconCircle}>
                        <Ionicons name="bus" size={40} color="#FFF" />
                    </View>
                    <Text style={styles.plateNumber}>{bus.plate}</Text>
                    <View style={styles.routeBadge}>
                        <Text style={styles.routeText}>Route {bus.route}</Text>
                    </View>
                    <Text style={styles.routeDetail}>{bus.routeText}</Text>

                    <View style={styles.statusChip}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Currently Active</Text>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Today's Revenue</Text>
                        <Text style={styles.statValue}>{bus.revenue}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Trips Completed</Text>
                        <Text style={styles.statValue}>{bus.trips}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Overall Rating</Text>
                        <Text style={styles.statValue}>⭐ {bus.rating}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Next Service</Text>
                        <Text style={[styles.statValue, { fontSize: 16, marginTop: 4 }]}>{bus.nextService}</Text>
                    </View>
                </View>

                {/* Driver Info */}
                <Text style={styles.sectionTitle}>Assigned Driver</Text>
                <View style={styles.driverCard}>
                    <View style={styles.driverAvatar}>
                        <Text style={styles.avatarText}>{bus.driver.charAt(0)}</Text>
                    </View>
                    <View style={styles.driverInfo}>
                        <Text style={styles.driverName}>{bus.driver}</Text>
                        <Text style={styles.driverPhone}>{bus.driverPhone}</Text>
                    </View>
                    <View style={styles.driverActions}>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="call-outline" size={20} color="#1F2937" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="chatbubble-outline" size={20} color="#1F2937" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Maintenance / Other */}
                <Text style={styles.sectionTitle}>Vehicle Health</Text>
                <View style={styles.healthCard}>
                    <View style={styles.healthItem}>
                        <MaterialCommunityIcons name="engine" size={24} color="#10B981" />
                        <Text style={styles.healthText}>Engine Status: Good</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.healthItem}>
                        <MaterialCommunityIcons name="tire" size={24} color="#F59E0B" />
                        <Text style={styles.healthText}>Tire Pressure: Check</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
    backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF' },
    editBtn: { padding: 8, borderRadius: 12, backgroundColor: '#EFF6FF' },

    content: { padding: 24, paddingTop: 0 },

    heroCard: {
        backgroundColor: '#1F2937', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24,
        shadowColor: '#1F2937', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, elevation: 8
    },
    busIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    plateNumber: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 8 },
    routeBadge: { backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
    routeText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
    routeDetail: { color: '#9CA3AF', fontSize: 14, marginBottom: 16 },
    statusChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064E3B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
    statusText: { color: '#D1FAE5', fontSize: 12, fontWeight: '600' },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    statCard: { width: (width - 60) / 2, backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 2 },
    statLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
    driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 24, elevation: 2 },
    driverAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    avatarText: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
    driverInfo: { flex: 1 },
    driverName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    driverPhone: { fontSize: 13, color: '#6B7280' },
    driverActions: { flexDirection: 'row', gap: 8 },
    actionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },

    healthCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 24, elevation: 2 },
    healthItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    healthText: { fontSize: 15, color: '#374151', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 }
});

export default BusDetailsScreen;
