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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';

const { width } = Dimensions.get('window');

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
            console.log('Error loading detailed owner stats:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerGreeting}>Business Overview</Text>
                    <Text style={styles.headerName}>{user?.name || 'Owner'}</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#FFF" />}
            >
                {/* Daily Revenue - Hero Card */}
                <View style={[styles.revenueCard, { backgroundColor: '#10b981', marginBottom: 20 }]}>
                    <Text style={styles.revenueLabel}>Today's Revenue</Text>
                    <Text style={styles.revenueValue}>{stats?.dailyRevenue || '...'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="trending-up" size={16} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.revenueSub}>+12% vs yesterday</Text>
                    </View>
                </View>

                {/* Quick Overview Grid */}
                <View style={styles.metricsGrid}>
                    {/* Today's Bookings */}
                    <View style={styles.metricCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                            <Ionicons name="ticket-outline" size={22} color="#3B82F6" />
                        </View>
                        <Text style={styles.metricValue}>{stats?.todaysBookings || 0}</Text>
                        <Text style={styles.metricLabel}>Today's Bookings</Text>
                    </View>

                    {/* Active Buses */}
                    <View style={styles.metricCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="bus-outline" size={22} color="#F59E0B" />
                        </View>
                        <Text style={styles.metricValue}>{stats?.activeBuses || 0}/{stats?.totalBuses || 0}</Text>
                        <Text style={styles.metricLabel}>Active Buses</Text>
                    </View>

                    {/* Seats Sold */}
                    <View style={styles.metricCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
                            <MaterialCommunityIcons name="seat-passenger" size={22} color="#10B981" />
                        </View>
                        <Text style={styles.metricValue}>{stats?.seatsSold || 0}</Text>
                        <Text style={styles.metricLabel}>Seats Sold</Text>
                    </View>

                    {/* Cancellation Count */}
                    <View style={styles.metricCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FEF2F2' }]}>
                            <Ionicons name="alert-circle-outline" size={22} color="#EF4444" />
                        </View>
                        <Text style={styles.metricValue}>{stats?.cancellations || 0}</Text>
                        <Text style={styles.metricLabel}>Cancellations</Text>
                    </View>
                </View>

                {/* Progress Bar for Occupancy */}
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${stats?.seatUtilization || 0}%` }]} />
                </View>
                <Text style={styles.progressText}>{stats?.seatUtilization || 0}% Occupancy Average</Text>

                {/* Transactions / Payments */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Payments</Text>
                    {stats?.payments?.map((payment, index) => (
                        <View key={index} style={styles.paymentRow}>
                            <View style={styles.paymentIcon}>
                                <Ionicons name="card-outline" size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentName}>{payment.passengerName}</Text>
                                <Text style={styles.paymentPhone}>{payment.phone}</Text>
                            </View>
                            <View style={styles.paymentRight}>
                                <Text style={styles.paymentAmount}>{payment.amount}</Text>
                                <Text style={styles.paymentStatus}>{payment.status}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Light Gray
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#F3F4F6',
    },
    headerGreeting: { color: '#6B7280', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
    headerName: { color: '#1F2937', fontSize: 24, fontWeight: '800' },
    logoutBtn: {
        padding: 8,
        backgroundColor: '#FFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 2
    },
    scrollContent: { padding: 20 },
    revenueContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 24,
    },
    revenueCard: {
        flex: 1,
        padding: 20,
        borderRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
    },
    revenueLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 8, fontWeight: '600' },
    revenueValue: { color: '#FFF', fontSize: 26, fontWeight: '800', marginBottom: 4 },
    revenueSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '500' },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12
    },
    metricCard: {
        width: (width - 52) / 2, // 2 columns with padding
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    metricValue: { color: '#1F2937', fontSize: 22, fontWeight: '800' },
    metricLabel: { color: '#6B7280', fontSize: 12, fontWeight: '600', marginTop: 4 },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    sectionTitle: {
        color: '#1F2937',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 20,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 8
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 5
    },
    progressText: {
        color: '#6B7280',
        fontSize: 13,
        textAlign: 'right',
        fontWeight: '600'
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 12
    },
    paymentIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    paymentInfo: { flex: 1 },
    paymentName: { color: '#1F2937', fontSize: 15, fontWeight: '700' },
    paymentPhone: { color: '#9CA3AF', fontSize: 13, fontWeight: '500' },
    paymentRight: { alignItems: 'flex-end' },
    paymentAmount: { color: '#1F2937', fontSize: 15, fontWeight: '800' },
    paymentStatus: { color: '#10B981', fontSize: 11, textTransform: 'uppercase', fontWeight: '700', marginTop: 2 }
});

export default OwnerDashboard;
