import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const PassengerDetailsScreen = ({ navigation, route }) => {
    const { bus, seats } = route.params;
    const [name, setName] = useState('');
    const [nic, setNic] = useState('');
    const [phone, setPhone] = useState('');

    const isValid = name && nic && phone;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Passenger Info</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.summaryTitle}>Journey Summary</Text>
                            <Feather name="map-pin" size={16} color="#4B5563" />
                        </View>
                        <View style={styles.dashedLine} />
                        <View style={styles.row}>
                            <Text style={styles.label}>Route</Text>
                            <Text style={styles.value}>Colombo ➔ Kandy</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Bus</Text>
                            <Text style={styles.value}>{bus.operator}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Seat(s)</Text>
                            <Text style={styles.value}>{seats.join(', ').replace(/R-|L-/g, '')}</Text>
                        </View>
                        <View style={styles.totalBlock}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>Rs. {seats.length * parseInt(bus.price.replace(/\D/g, ''))}</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Enter Details</Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="user" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Kasun Perera"
                                    placeholderTextColor="#D1D5DB"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>NIC / Passport Number</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="credit-card" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="951234567V"
                                    placeholderTextColor="#D1D5DB"
                                    value={nic}
                                    onChangeText={setNic}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Mobile Number</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="smartphone" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="077 123 4567"
                                    placeholderTextColor="#D1D5DB"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payButton, !isValid && styles.disabledButton]}
                    disabled={!isValid}
                    onPress={() => navigation.navigate('Payment', { bus, seats, passenger: { name, nic, phone } })}
                >
                    <Text style={styles.payButtonText}>Proceed to Payment</Text>
                    <Feather name="arrow-right" size={20} color={isValid ? "#FFF" : "#9CA3AF"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
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
        elevation: 2,
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    summaryCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 4,
    },
    summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    summaryTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    dashedLine: { width: '100%', height: 1, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', marginBottom: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    label: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
    value: { color: '#1F2937', fontWeight: '700', fontSize: 14 },
    totalBlock: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: { fontSize: 14, fontWeight: '700', color: '#374151' },
    totalValue: { fontSize: 18, fontWeight: '800', color: '#059669' },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
    form: { marginBottom: 24 },
    inputGroup: { marginBottom: 20 },
    inputLabel: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 8, textTransform: 'uppercase' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '600',
    },
    footer: {
        backgroundColor: '#FFF',
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    payButton: {
        backgroundColor: '#1F2937',
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    payButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    disabledButton: { backgroundColor: '#F3F4F6' },
});

export default PassengerDetailsScreen;
