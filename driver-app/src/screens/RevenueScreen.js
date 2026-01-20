import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const RevenueScreen = () => {
    // Mock Data
    const transactions = [
        { id: '1', method: 'PayHere', amount: '850', date: 'Today, 10:30 AM', status: 'Success' },
        { id: '2', method: 'LankaQR', amount: '450', date: 'Today, 09:15 AM', status: 'Success' },
        { id: '3', method: 'Card', amount: '1200', date: 'Yesterday', status: 'Failed' },
        { id: '4', method: 'PayHere', amount: '850', date: 'Yesterday', status: 'Refunded' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Revenue</Text>
                <TouchableOpacity style={styles.downloadBtn}>
                    <Ionicons name="download-outline" size={20} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Total Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Revenue (Today)</Text>
                    <Text style={styles.balanceValue}>LKR 45,200</Text>
                    <View style={styles.trendRow}>
                        <View style={styles.trendBadge}>
                            <Ionicons name="arrow-up" size={12} color="#03543F" />
                            <Text style={styles.trendText}>+12.5%</Text>
                        </View>
                        <Text style={styles.trendLabel}>vs yesterday</Text>
                    </View>
                </View>

                {/* Period Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statCardLabel}>Weekly</Text>
                        <Text style={styles.statCardValue}>285k</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statCardLabel}>Monthly</Text>
                        <Text style={styles.statCardValue}>1.2M</Text>
                    </View>
                </View>

                {/* Breakdown by Method */}
                <Text style={styles.sectionTitle}>Payment Methods</Text>
                <View style={styles.methodGrid}>
                    <View style={styles.methodCard}>
                        <MaterialCommunityIcons name="credit-card-outline" size={24} color="#3B82F6" />
                        <Text style={styles.methodValue}>65%</Text>
                        <Text style={styles.methodLabel}>Card</Text>
                    </View>
                    <View style={styles.methodCard}>
                        <MaterialCommunityIcons name="qrcode-scan" size={24} color="#10B981" />
                        <Text style={styles.methodValue}>25%</Text>
                        <Text style={styles.methodLabel}>LankaQR</Text>
                    </View>
                    <View style={styles.methodCard}>
                        <MaterialCommunityIcons name="hand-coin-outline" size={24} color="#F59E0B" />
                        <Text style={styles.methodValue}>10%</Text>
                        <Text style={styles.methodLabel}>Cash</Text>
                    </View>
                </View>

                {/* Recent Transactions */}
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                {transactions.map((tx) => (
                    <View key={tx.id} style={styles.txCard}>
                        <View style={styles.txLeft}>
                            <View style={[styles.iconBox, {
                                backgroundColor: tx.status === 'Success' ? '#DEF7EC' : tx.status === 'Refunded' ? '#FEF3C7' : '#FDE8E8'
                            }]}>
                                <Ionicons
                                    name={tx.status === 'Success' ? "arrow-down" : tx.status === 'Refunded' ? "refresh" : "alert"}
                                    size={18}
                                    color={tx.status === 'Success' ? "#03543F" : tx.status === 'Refunded' ? "#92400E" : "#9B1C1C"}
                                />
                            </View>
                            <View>
                                <Text style={styles.txMethod}>{tx.method}</Text>
                                <Text style={styles.txDate}>{tx.date}</Text>
                            </View>
                        </View>
                        <View style={styles.txRight}>
                            <Text style={[styles.txAmount, { color: tx.status === 'Success' ? '#1F2937' : '#9CA3AF' }]}>
                                {tx.status === 'Refunded' ? '-' : '+'} LKR {tx.amount}
                            </Text>
                            <Text style={[styles.txStatus, {
                                color: tx.status === 'Success' ? '#059669' : tx.status === 'Refunded' ? '#D97706' : '#EF4444'
                            }]}>{tx.status}</Text>
                        </View>
                    </View>
                ))}

            </ScrollView>
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
    downloadBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    scrollContent: { padding: 20, paddingTop: 0 },
    balanceCard: {
        backgroundColor: '#1F2937',
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#1F2937',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        elevation: 8,
    },
    balanceLabel: { color: '#9CA3AF', fontSize: 14, marginBottom: 8 },
    balanceValue: { color: '#FFF', fontSize: 32, fontWeight: '800', marginBottom: 12 },
    trendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DEF7EC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4
    },
    trendText: { color: '#03543F', fontSize: 12, fontWeight: '700' },
    trendLabel: { color: '#6B7280', fontSize: 12 },

    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 2,
    },
    statCardLabel: { color: '#6B7280', fontSize: 12, marginBottom: 4 },
    statCardValue: { color: '#1F2937', fontSize: 20, fontWeight: '800' },

    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16 },

    methodGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    methodCard: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    methodValue: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginTop: 8 },
    methodLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },

    txCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        elevation: 2,
    },
    txLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txMethod: { color: '#1F2937', fontWeight: '700', fontSize: 15 },
    txDate: { color: '#9CA3AF', fontSize: 12 },
    txRight: { alignItems: 'flex-end' },
    txAmount: { fontSize: 15, fontWeight: '800' },
    txStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 }
});

export default RevenueScreen;
