import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Alert } from 'react-native';

const PaymentScreen = ({ navigation, route }) => {
    const { bus, seats, passenger } = route.params;
    const [method, setMethod] = useState(null);
    const totalAmount = seats.length * parseInt(bus.price.replace(/\D/g, ''));

    const handlePayment = () => {
        Alert.alert(
            "Processing Payment",
            "Connecting to secure gateway...",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Authorize",
                    onPress: () => {
                        // Simulate success
                        setTimeout(() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }, { name: 'Ticket', params: { bus, seats, passenger, totalAmount } }],
                            });
                        }, 1000);
                    }
                }
            ]
        );
    };

    const PaymentOption = ({ id, label, icon }) => (
        <TouchableOpacity
            style={[styles.option, method === id && styles.selectedOption]}
            onPress={() => setMethod(id)}
        >
            <Text style={styles.optionIcon}>{icon}</Text>
            <Text style={[styles.optionLabel, method === id && styles.selectedLabel]}>{label}</Text>
            {method === id && <Text style={styles.checkIcon}>✅</Text>}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Payment</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Total to Pay</Text>
                    <Text style={styles.amountValue}>Rs. {totalAmount}</Text>
                </View>

                <Text style={styles.sectionTitle}>Payment Method</Text>

                <PaymentOption id="card" label="Credit / Debit Card" icon="💳" />
                <PaymentOption id="payhere" label="PayHere" icon="🔒" />
                <PaymentOption id="lankaqr" label="LankaQR" icon="📱" />
                <PaymentOption id="ezcash" label="eZ Cash / mCash" icon="💸" />

            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payButton, !method && styles.disabledButton]}
                    disabled={!method}
                    onPress={handlePayment}
                >
                    <Text style={styles.payButtonText}>Pay & Confirm</Text>
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
    amountCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 2,
    },
    amountLabel: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
    amountValue: { fontSize: 32, fontWeight: '800', color: '#059669' },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedOption: {
        borderColor: '#1F2937',
        backgroundColor: '#F9FAFB',
    },
    optionIcon: { fontSize: 24, marginRight: 16 },
    optionLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#374151' },
    selectedLabel: { color: '#1F2937', fontWeight: '700' },
    checkIcon: { fontSize: 16 },
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

export default PaymentScreen;
