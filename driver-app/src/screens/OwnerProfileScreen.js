import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const OwnerProfileScreen = ({ navigation }) => {
    const { logout, user } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const menuItems = [
        {
            title: 'Driver Management',
            icon: 'people-outline',
            iconColor: '#3B82F6',
            bg: '#EFF6FF',
            action: () => navigation.navigate('DriverManagement')
        },
        {
            title: 'Reports & Analytics',
            icon: 'bar-chart-outline',
            iconColor: '#8B5CF6',
            bg: '#F5F3FF',
            action: () => navigation.navigate('Reports')
        },
    ];

    const generalItems = [
        { title: 'Business Info', icon: 'briefcase-outline' },
        { title: 'Bank Details', icon: 'card-outline' },
        { title: 'App Settings', icon: 'settings-outline' },
        { title: 'Help & Support', icon: 'help-circle-outline' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'O'}</Text>
                        </View>
                        <View style={styles.badge}>
                            <MaterialCommunityIcons name="check-decagram" size={16} color="#FFF" />
                        </View>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Bus Owner'}</Text>
                    <Text style={styles.userRole}>NTC Reg: 884-221-44</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Buses</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>4.8</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>3</Text>
                            <Text style={styles.statLabel}>Years</Text>
                        </View>
                    </View>
                </View>

                {/* Management Section */}
                <Text style={styles.sectionTitle}>Management</Text>
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
                            <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                                <Ionicons name={item.icon} size={22} color={item.iconColor} />
                            </View>
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* General Settings */}
                <Text style={styles.sectionTitle}>General</Text>
                <View style={styles.menuContainer}>
                    {generalItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                                <Ionicons name={item.icon} size={22} color="#6B7280" />
                            </View>
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>
                    ))}
                    <View style={styles.menuItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                            <Ionicons name="notifications-outline" size={22} color="#6B7280" />
                        </View>
                        <Text style={styles.menuText}>Notifications</Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                            thumbColor={"#FFF"}
                        />
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0 (Build 24)</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 24, paddingBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
    content: { padding: 24, paddingBottom: 100 },

    profileCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        elevation: 4
    },
    avatarContainer: { position: 'relative', marginBottom: 16 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarText: { color: '#FFF', fontSize: 40, fontWeight: '800' },
    badge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 4,
        borderWidth: 3,
        borderColor: '#FFF'
    },
    userName: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
    userRole: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 24 },

    statsRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
    statLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },
    statDivider: { width: 1, height: 24, backgroundColor: '#E5E7EB' },

    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#6B7280', marginBottom: 12, marginLeft: 8 },
    menuContainer: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 8,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 2
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1F2937' },

    logoutBtn: {
        backgroundColor: '#FEF2F2',
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24
    },
    logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
    versionText: { textAlign: 'center', color: '#D1D5DB', fontSize: 12 }
});

export default OwnerProfileScreen;
