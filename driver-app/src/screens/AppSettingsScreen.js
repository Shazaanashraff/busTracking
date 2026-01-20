import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppSettingsScreen = ({ navigation }) => {
    const [settings, setSettings] = useState({
        notifications: true,
        sounds: true,
        darkMode: false,
        autoUpdate: true,
        location: true
    });

    const toggleSwitch = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>App Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Ionicons name="notifications-outline" size={22} color="#4B5563" />
                            <Text style={styles.rowLabel}>Push Notifications</Text>
                        </View>
                        <Switch
                            value={settings.notifications}
                            onValueChange={() => toggleSwitch('notifications')}
                            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                            thumbColor={"#FFF"}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Ionicons name="volume-high-outline" size={22} color="#4B5563" />
                            <Text style={styles.rowLabel}>In-App Sounds</Text>
                        </View>
                        <Switch
                            value={settings.sounds}
                            onValueChange={() => toggleSwitch('sounds')}
                            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                            thumbColor={"#FFF"}
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Appearance</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Ionicons name="moon-outline" size={22} color="#4B5563" />
                            <Text style={styles.rowLabel}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={settings.darkMode}
                            onValueChange={() => toggleSwitch('darkMode')}
                            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                            thumbColor={"#FFF"}
                        />
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Ionicons name="language-outline" size={22} color="#4B5563" />
                            <Text style={styles.rowLabel}>Language</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={styles.valueText}>English</Text>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>System</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Ionicons name="location-outline" size={22} color="#4B5563" />
                            <Text style={styles.rowLabel}>Location Access</Text>
                        </View>
                        <Switch
                            value={settings.location}
                            onValueChange={() => toggleSwitch('location')}
                            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                            thumbColor={"#FFF"}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Ionicons name="cloud-download-outline" size={22} color="#4B5563" />
                            <Text style={styles.rowLabel}>Auto Update</Text>
                        </View>
                        <Switch
                            value={settings.autoUpdate}
                            onValueChange={() => toggleSwitch('autoUpdate')}
                            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                            thumbColor={"#FFF"}
                        />
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Ionicons name="trash-outline" size={22} color="#EF4444" />
                            <Text style={[styles.rowLabel, { color: '#EF4444' }]}>Clear Cache</Text>
                        </View>
                        <Text style={styles.valueText}>24 MB</Text>
                    </TouchableOpacity>
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
    content: { padding: 20, paddingTop: 0 },

    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 12, marginTop: 8, marginLeft: 4, textTransform: 'uppercase' },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 8, marginBottom: 16, elevation: 2 },

    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    labelContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    rowLabel: { fontSize: 16, fontWeight: '500', color: '#1F2937' },
    valueText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 16 }
});

export default AppSettingsScreen;
