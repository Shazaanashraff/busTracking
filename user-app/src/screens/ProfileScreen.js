import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, ScrollView, Alert } from 'react-native';

const ProfileScreen = ({ navigation }) => {
    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", onPress: () => navigation.replace('Login') }
        ]);
    };

    const menuItems = [
        { icon: '🗺️', label: 'Saved Routes', action: () => { } },
        { icon: '🌐', label: 'Language', value: 'English', action: () => navigation.navigate('LanguageSelect') },
        { icon: '🔔', label: 'Notifications', action: () => navigation.navigate('Notifications') },
        { icon: '📜', label: 'Terms & Conditions', action: () => { } },
        { icon: '📞', label: 'Support', action: () => { } },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Text style={styles.logoutIcon}>🚪</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={{ fontSize: 40 }}>👤</Text>
                    </View>
                    <Text style={styles.name}>Kasun Perera</Text>
                    <Text style={styles.phone}>077 123 4567</Text>
                    <TouchableOpacity style={styles.editBtn}>
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
                            <View style={styles.menuLeft}>
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.menuRight}>
                                {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                                <Text style={styles.chevron}>›</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FCD24A' },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: { fontSize: 24, color: '#1F2937' },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
    logoutBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
    },
    logoutIcon: { fontSize: 20 },
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    profileCard: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    name: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
    phone: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    editBtn: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#1F2937',
        borderRadius: 20,
    },
    editBtnText: { color: '#FFF', fontWeight: '600', fontSize: 12 },
    menu: { flex: 1 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 1,
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center' },
    menuIcon: { fontSize: 20, marginRight: 16 },
    menuLabel: { fontSize: 16, fontWeight: '600', color: '#374151' },
    menuRight: { flexDirection: 'row', alignItems: 'center' },
    menuValue: { fontSize: 14, color: '#9CA3AF', marginRight: 8 },
    chevron: { fontSize: 20, color: '#D1D5DB', fontWeight: '800' },
});

export default ProfileScreen;
