import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    RefreshControl,
    SafeAreaView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';

const { width } = Dimensions.get('window');
const BRAND_GREEN = '#10B981'; // FareGO Green

const OwnerDashboard = ({ navigation }) => {
    const { user, token, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setRefreshing(true);
        try {
            const data = await api.getOwnerStats(token);
            setStats(data);
        } catch (error) {
            console.log('Error loading stats:', error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Partner'}</Text>
                    <Text style={styles.subGreeting}>Here's your fleet summary</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn} onPress={logout}>
                    <View style={styles.avatarCircle}>
                        <Feather name="user" size={20} color="#FFF" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#10B981" />}
                showsVerticalScrollIndicator={false}
            >
                {/* HERO CARD: REVENUE */}
                <View style={styles.heroCard}>
                    <View style={styles.heroHeader}>
                        <View style={styles.iconChip}>
                            <Feather name="dollar-sign" size={16} color={BRAND_GREEN} />
                        </View>
                        <Text style={styles.heroLabel}>Total Revenue</Text>
                    </View>
                    <Text style={styles.heroValue}>{stats?.dailyRevenue || 'LKR 0'}</Text>
                    <View style={styles.heroFooter}>
                        <View style={styles.badge}>
                            <Feather name="trending-up" size={12} color="#065F46" />
                            <Text style={styles.badgeText}>+12.5% vs yesterday</Text>
                        </View>
                    </View>
                </View>

                {/* STATS GRID */}
                <View style={styles.gridContainer}>
                    {/* Booking Stats */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
                            <Feather name="ticket" size={20} color="#9333EA" />
                        </View>
                        <Text style={styles.statValue}>{stats?.todaysBookings || 0}</Text>
                        <Text style={styles.statLabel}>Today's Bookings</Text>
                    </View>

                    {/* Active Buses */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
                            <MaterialCommunityIcons name="bus-side" size={20} color={BRAND_GREEN} />
                        </View>
                        <Text style={styles.statValue}>{stats?.activeBuses || 0} / {stats?.totalBuses || 0}</Text>
                        <Text style={styles.statLabel}>Active Buses</Text>
                    </View>

                    {/* Seat Utilization */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                            <MaterialCommunityIcons name="seat-passenger" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.statValue}>{stats?.seatUtilization || 0}%</Text>
                        <Text style={styles.statLabel}>Occupancy Rate</Text>
                    </View>

                    {/* Warnings/Cancellations */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FEF2F2' }]}>
                            <Feather name="alert-circle" size={20} color="#EF4444" />
                        </View>
                        <Text style={styles.statValue}>{stats?.cancellations || 0}</Text>
                        <Text style={styles.statLabel}>Issues Reported</Text>
                    </View>
                </View>

                {/* RECENT ACTIVITY LIST */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                    {stats?.payments?.length > 0 ? (
                        stats.payments.map((p, i) => (
                            <View key={i} style={styles.listItem}>
                                <View style={styles.listIconBox}>
                                    <Feather name="arrow-down-left" size={20} color={BRAND_GREEN} />
                                </View>
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>{p.passengerName || 'Passenger'}</Text>
                                    <Text style={styles.listSub}>{p.phone || 'Unknown'}</Text>
                                </View>
                                <View style={styles.listRight}>
                                    <Text style={styles.listAmount}>{p.amount}</Text>
                                    <Text style={styles.listStatus}>{p.status}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No recent transactions</Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
    },
    subGreeting: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    profileBtn: {
        marginLeft: 16,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    // HERO CARD
    heroCard: {
        backgroundColor: '#111827', // Black Card for Contrast (FareGO style)
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        elevation: 8,
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconChip: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    heroLabel: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '500',
    },
    heroValue: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 16,
        letterSpacing: -1,
    },
    heroFooter: {
        flexDirection: 'row',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
    },
    badgeText: {
        color: '#065F46',
        fontSize: 12,
        fontWeight: '700',
    },

    // STATS GRID
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        width: (width - 48 - 16) / 2, // 2 columns
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
    },

    // LIST SECTION
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: BRAND_GREEN,
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    listIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    listContent: {
        flex: 1,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    listSub: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },
    listRight: {
        alignItems: 'flex-end',
    },
    listAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    listStatus: {
        fontSize: 11,
        fontWeight: '600',
        color: BRAND_GREEN,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    }
});

export default OwnerDashboard;
