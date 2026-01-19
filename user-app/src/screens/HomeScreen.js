import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [routeSearch, setRouteSearch] = useState('');

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Ayubowan! 🙏</Text>
                    <Text style={styles.title}>Find your bus</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
                    <Text style={{ fontSize: 20 }}>👤</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Main Search - By Route - "Langa Bus Eka Hoyanna" style */}
                <View style={styles.searchCard}>
                    <Text style={styles.cardHeader}>🔢 Search by Route</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 138, 177, 120..."
                            value={routeSearch}
                            onChangeText={setRouteSearch}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('RouteBuses', { route: routeSearch || '138' })}>
                            <Text style={styles.searchBtnText}>Go</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.nearestBtn}>
                        <Text style={styles.nearestBtnText}>📍 Langa Bus Eka Hoyanna (Nearest Bus)</Text>
                    </TouchableOpacity>
                </View>

                {/* Journey Plan - From / To */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>🗺️ Plan Journey</Text>
                    <View style={styles.journeyInputs}>
                        <View style={styles.journeyInputWrapper}>
                            <Text style={styles.label}>From</Text>
                            <TextInput style={styles.journeyInput} placeholder="Colombo Fort" />
                        </View>
                        <View style={styles.switchIcon}>
                            <Text>⬇️</Text>
                        </View>
                        <View style={styles.journeyInputWrapper}>
                            <Text style={styles.label}>To</Text>
                            <TextInput style={styles.journeyInput} placeholder="Kandy" />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.planBtn} onPress={() => navigation.navigate('SearchResults')}>
                        <Text style={styles.planBtnText}>Search Buses</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions Grid */}
                <View style={styles.grid}>
                    <TouchableOpacity
                        style={styles.gridCard}
                        onPress={() => navigation.navigate('TrackByBus')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                            <Text style={{ fontSize: 24 }}>🚍</Text>
                        </View>
                        <Text style={styles.gridTitle}>Track Bus</Text>
                        <Text style={styles.gridDesc}>By Plate No.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.gridCard}
                        onPress={() => navigation.navigate('MyBookings')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                            <Text style={{ fontSize: 24 }}>🧾</Text>
                        </View>
                        <Text style={styles.gridTitle}>My Bookings</Text>
                        <Text style={styles.gridDesc}>Tickets & History</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Promo or Tip */}
                <View style={styles.promoCard}>
                    <Text style={styles.promoTitle}>💡 Did you know?</Text>
                    <Text style={styles.promoText}>You can now book seats on Luxury and Intercity buses directly through the app!</Text>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCD24A',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B3621',
        opacity: 0.8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
    },
    profileBtn: {
        width: 44,
        height: 44,
        backgroundColor: '#FFF',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 2,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    searchCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 4,
    },
    cardHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
        color: '#1F2937',
    },
    searchBtn: {
        width: 50,
        backgroundColor: '#1F2937',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBtnText: {
        color: '#FFF',
        fontWeight: '700',
    },
    nearestBtn: {
        backgroundColor: '#FEF3C7',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    nearestBtnText: {
        color: '#92400E',
        fontWeight: '700',
        fontSize: 14,
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 16,
    },
    journeyInputs: {
        gap: 0,
    },
    journeyInputWrapper: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    label: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    journeyInput: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    switchIcon: {
        alignSelf: 'center',
        marginVertical: -10,
        zIndex: 10,
        backgroundColor: '#FFF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    planBtn: {
        backgroundColor: '#1F2937',
        marginTop: 16,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    planBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    gridCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        shadowOpacity: 0.05,
        elevation: 2,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    gridDesc: {
        fontSize: 10,
        color: '#6B7280',
    },
    promoCard: {
        backgroundColor: '#1E40AF',
        borderRadius: 20,
        padding: 20,
    },
    promoTitle: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 6,
    },
    promoText: {
        color: '#BFDBFE',
        fontSize: 12,
        lineHeight: 18,
    },
});

export default HomeScreen;
