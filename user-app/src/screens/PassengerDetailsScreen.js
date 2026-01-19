import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';

const PassengerDetailsScreen = ({ navigation, route }) => {
    const { bus, seats } = route.params;
    const [name, setName] = useState('');
    const [nic, setNic] = useState('');
    const [phone, setPhone] = useState('');

    const isValid = name && nic && phone;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Passenger Info</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Journey Summary</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Route</Text>
                            <Text style={styles.value}>Colombo ➔ Kandy</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Bus</Text>
                            <Text style={styles.value}>{bus.operator} ({bus.plate})</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Seats</Text>
                            <Text style={styles.value}>{seats.join(', ').replace(/R-|L-/g, '')}</Text>
                        </View>
                        <View style={[styles.row, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>
                                Rs. {seats.length * parseInt(bus.price.replace(/\D/g, ''))}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Enter Details</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Kasun Perera"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>NIC / Passport Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="951234567V"
                            value={nic}
                            onChangeText={setNic}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="077 123 4567"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
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
                </TouchableOpacity>
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
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
    },
    summaryCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 2,
    },
    summaryTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    label: { color: '#6B7280', fontSize: 14 },
    value: { color: '#1F2937', fontWeight: '600', fontSize: 14 },
    totalRow: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12, marginTop: 4 },
    totalLabel: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    totalValue: { fontSize: 18, fontWeight: '800', color: '#059669' },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 8, textTransform: 'uppercase' },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
        color: '#1F2937',
    },
    footer: {
        backgroundColor: '#FFF',
        padding: 24,
        paddingBottom: 40,
    },
    payButton: {
        backgroundColor: '#1F2937',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    payButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    disabledButton: { backgroundColor: '#9CA3AF' },
});

export default PassengerDetailsScreen;
