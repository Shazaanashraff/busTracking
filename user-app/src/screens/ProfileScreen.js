import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ScrollView, Alert } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", onPress: () => navigation.replace('Login') }
        ]);
    };

    const menuItems = [
        { icon: <Ionicons name="map-outline" size={22} color="#4B5563" />, label: 'Saved Routes', action: () => { } },
        { icon: <Ionicons name="globe-outline" size={22} color="#4B5563" />, label: 'Language', value: 'English', action: () => navigation.navigate('LanguageSelect') },
        { icon: <Ionicons name="notifications-outline" size={22} color="#4B5563" />, label: 'Notifications', action: () => navigation.navigate('Notifications') },
        { icon: <Ionicons name="document-text-outline" size={22} color="#4B5563" />, label: 'Terms & Conditions', action: () => { } },
        { icon: <Ionicons name="headset-outline" size={22} color="#4B5563" />, label: 'Support', action: () => { } },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Feather name="log-out" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Feather name="user" size={40} color="#9CA3AF" />
                    </View>
                    <Text style={styles.name}>Kasun Perera</Text>
                    <Text style={styles.phone}>077 123 4567</Text>
                    <TouchableOpacity style={styles.editBtn}>
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    {menuItems.slice(0, 3).map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
                            <View style={styles.menuLeft}>
                                <View style={styles.iconBox}>{item.icon}</View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.menuRight}>
                                {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                                <Feather name="chevron-right" size={20} color="#D1D5DB" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>More</Text>
                    {menuItems.slice(3).map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
                            <View style={styles.menuLeft}>
                                <View style={styles.iconBox}>{item.icon}</View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#D1D5DB" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
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
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    logoutBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    profileCard: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 32,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 4,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
    phone: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    editBtn: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: '#1F2937',
        borderRadius: 20,
    },
    editBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
    menuSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        elevation: 2,
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
    menuLabel: { fontSize: 16, fontWeight: '600', color: '#374151' },
    menuRight: { flexDirection: 'row', alignItems: 'center' },
    menuValue: { fontSize: 14, color: '#9CA3AF', marginRight: 8 },
});

export default ProfileScreen;
