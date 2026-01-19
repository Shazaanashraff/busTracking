import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [routeSearch, setRouteSearch] = useState('');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            {/* Premium Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning,</Text>
                    <Text style={styles.username}>Kasun Perera</Text>
                </View>
                <TouchableOpacity style={styles.notificationBtn} onPress={() => navigation.navigate('Notifications')}>
                    <Ionicons name="notifications-outline" size={24} color="#1F2937" />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Main Search Card */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroTitle}>Where do you want to go?</Text>

                    {/* Route Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Search by route (e.g., 138, 177)"
                            placeholderTextColor="#9CA3AF"
                            value={routeSearch}
                            onChangeText={setRouteSearch}
                            keyboardType="numeric"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.primaryBtn}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('RouteBuses', { route: routeSearch || '138' })}
                    >
                        <Text style={styles.primaryBtnText}>Find Buses</Text>
                        <Feather name="arrow-right" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Quick Actions Grid */}
                <Text style={styles.sectionHeader}>Quick Actions</Text>
                <View style={styles.grid}>
                    <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('SearchResults')}>
                        <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                            <MaterialCommunityIcons name="map-marker-path" size={28} color="#D97706" />
                        </View>
                        <Text style={styles.actionLabel}>Plan Journey</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('TrackByBus')}>
                        <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                            <MaterialCommunityIcons name="radar" size={28} color="#059669" />
                        </View>
                        <Text style={styles.actionLabel}>Track Bus</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('MyBookings')}>
                        <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                            <Ionicons name="ticket-outline" size={28} color="#4F46E5" />
                        </View>
                        <Text style={styles.actionLabel}>My Tickets</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Profile')}>
                        <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                            <Feather name="user" size={28} color="#1F2937" />
                        </View>
                        <Text style={styles.actionLabel}>Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent / Nearest Promo */}
                <Text style={styles.sectionHeader}>Nearby</Text>
                <View style={styles.nearbyCard}>
                    <View style={styles.nearbyInfo}>
                        <View style={styles.nearbyIconContainer}>
                            <Ionicons name="location" size={24} color="#FCD24A" />
                        </View>
                        <View>
                            <Text style={styles.nearbyTitle}>Nearest Halt: Pettah</Text>
                            <Text style={styles.nearbySubtitle}>12 buses arriving in 10 mins</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.arrowBtn}>
                        <Feather name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Lighter background for premium feel
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    username: {
        fontSize: 24,
        color: '#1F2937',
        fontWeight: '800',
        marginTop: 4,
    },
    notificationBtn: {
        width: 48,
        height: 48,
        backgroundColor: '#FFF',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        elevation: 2,
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 14,
        width: 8,
        height: 8,
        backgroundColor: '#EF4444',
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    heroCard: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
        marginBottom: 32,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: { marginRight: 12 },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
    },
    primaryBtn: {
        flexDirection: 'row',
        backgroundColor: '#1F2937', // Dark button from reference 1
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    primaryBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 16,
    },
    actionItem: {
        width: (width - 48 - 16) / 2, // 2 column grid
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 24,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        elevation: 2,
        marginBottom: 8,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
    },
    nearbyCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 2,
    },
    nearbyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    nearbyIconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#1F2937',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nearbyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    nearbySubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    arrowBtn: {
        padding: 8,
    }
});

export default HomeScreen;
