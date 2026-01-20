import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, StatusBar, SafeAreaView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const MyBusesScreen = () => {
    // Mock Data
    const [buses, setBuses] = useState([
        { id: '1', plate: 'ND-4567', route: '138', routeName: 'Pettah - Homagama', status: 'Active', bookings: 12, revenue: '8,500' },
        { id: '2', plate: 'NC-1122', route: '177', routeName: 'Kollupitiya - Kaduwela', status: 'Offline', bookings: 0, revenue: '0' },
        { id: '3', plate: 'NB-9988', route: '138', routeName: 'Pettah - Homagama', status: 'Active', bookings: 24, revenue: '15,200' },
    ]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const renderBusItem = ({ item }) => (
        <TouchableOpacity style={styles.busCard} activeOpacity={0.9}>
            <View style={styles.cardHeader}>
                <View style={styles.plateContainer}>
                    <MaterialCommunityIcons name="bus" size={24} color="#1F2937" />
                    <View>
                        <Text style={styles.plateNumber}>{item.plate}</Text>
                        <Text style={styles.routeInfo}>Route {item.route}: {item.routeName}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#DEF7EC' : '#F3F4F6' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'Active' ? '#03543F' : '#6B7280' }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardStats}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Today's Bookings</Text>
                    <Text style={styles.statValue}>{item.bookings}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Est. Revenue</Text>
                    <Text style={styles.statValue}>LKR {item.revenue}</Text>
                </View>
                <TouchableOpacity style={styles.detailsBtn}>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Buses</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={buses}
                renderItem={renderBusItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
        backgroundColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
    },
    addBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#1F2937',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 2,
    },
    listContent: {
        padding: 20,
        paddingTop: 0
    },
    busCard: {
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
        alignItems: 'flex-start',
        marginBottom: 16
    },
    plateContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center'
    },
    plateNumber: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937'
    },
    routeInfo: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500'
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase'
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 16
    },
    cardStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    statItem: {
        gap: 4
    },
    statLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600'
    },
    statValue: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '700'
    },
    detailsBtn: {
        padding: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 8
    }
});

export default MyBusesScreen;
