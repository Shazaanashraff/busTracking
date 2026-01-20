import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const DriverProfileScreen = () => {
    const { logout, user } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'D'}</Text>
                </View>
                <Text style={styles.name}>{user?.name || 'Driver'}</Text>
                <Text style={styles.role}>Bus Driver</Text>
            </View>

            <View style={styles.infoCard}>
                <View style={styles.row}>
                    <Ionicons name="bus" size={20} color="#6B7280" />
                    <View style={styles.col}>
                        <Text style={styles.label}>Assigned Bus</Text>
                        <Text style={styles.value}>ND-4567</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Ionicons name="map" size={20} color="#6B7280" />
                    <View style={styles.col}>
                        <Text style={styles.label}>Current Route</Text>
                        <Text style={styles.value}>138: Pettah - Homagama</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', padding: 24, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 40 },
    avatar: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#1F2937',
        justifyContent: 'center', alignItems: 'center', marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, elevation: 4
    },
    avatarText: { color: '#FFF', fontSize: 32, fontWeight: '800' },
    name: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
    role: { fontSize: 16, color: '#6B7280', fontWeight: '500' },

    infoCard: {
        backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 40,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    col: { flex: 1 },
    label: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
    value: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },

    logoutBtn: {
        backgroundColor: '#FEF2F2', padding: 18, borderRadius: 16,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10
    },
    logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16 }
});

export default DriverProfileScreen;
