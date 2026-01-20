import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DriverManagementScreen = ({ navigation }) => {

    // Mock Data
    const [drivers, setDrivers] = useState([
        { id: '1', name: 'Kamal Perera', phone: '077****321', status: 'On Trip', bus: 'ND-4567', tripsToday: 4 },
        { id: '2', name: 'Sunil Dias', phone: '071****554', status: 'Idle', bus: 'NB-1122', tripsToday: 2 },
        { id: '3', name: 'Nimal Silva', phone: '076****882', status: 'Off Duty', bus: 'None', tripsToday: 0 },
    ]);

    const renderDriverItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                    <View style={[styles.statusDot, {
                        backgroundColor: item.status === 'On Trip' ? '#10B981' : item.status === 'Idle' ? '#F59E0B' : '#9CA3AF'
                    }]} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.phone}>{item.phone}</Text>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Ionicons name="bus-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.bus}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="analytics-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.tripsToday} Trips Today</Text>
                </View>
                <View style={[styles.statusBadge, {
                    backgroundColor: item.status === 'On Trip' ? '#ECFDF5' : item.status === 'Idle' ? '#FFFBEB' : '#F3F4F6'
                }]}>
                    <Text style={[styles.statusText, {
                        color: item.status === 'On Trip' ? '#047857' : item.status === 'Idle' ? '#B45309' : '#4B5563'
                    }]}>{item.status}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Driver Management</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={drivers}
                renderItem={renderDriverItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
    backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF' },
    addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' },

    list: { padding: 20, paddingTop: 0 },

    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    avatarText: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
    statusDot: { width: 12, height: 12, borderRadius: 6, position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: '#FFF' },

    info: { flex: 1, marginLeft: 12 },
    name: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    phone: { fontSize: 13, color: '#9CA3AF' },
    moreBtn: { padding: 4 },

    divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },

    detailsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '700' }
});

export default DriverManagementScreen;
