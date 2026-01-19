import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

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

    const PaymentOption = ({ id, label, iconComponent }) => (
        <TouchableOpacity
            style={[styles.option, method === id && styles.selectedOption]}
            onPress={() => setMethod(id)}
            activeOpacity={0.8}
        >
            <View style={styles.optionLeft}>
                <View style={[styles.iconBox, method === id ? { backgroundColor: '#1F2937' } : { backgroundColor: '#F3F4F6' }]}>
                    {iconComponent}
                </View>
                <Text style={[styles.optionLabel, method === id && styles.selectedLabel]}>{label}</Text>
            </View>
            {method === id && <Feather name="check-circle" size={24} color="#059669" />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Make Payment</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Total to Pay</Text>
                    <Text style={styles.amountValue}>Rs. {totalAmount}</Text>
                    <View style={styles.secureBadge}>
                        <Feather name="shield" size={12} color="#059669" />
                        <Text style={styles.secureText}>Secure Transaction</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Select Method</Text>

                <PaymentOption
                    id="card"
                    label="Credit / Debit Card"
                    iconComponent={<Feather name="credit-card" size={24} color={method === 'card' ? '#FFF' : '#374151'} />}
                />
                <PaymentOption
                    id="payhere"
                    label="PayHere"
                    iconComponent={<Feather name="lock" size={24} color={method === 'payhere' ? '#FFF' : '#374151'} />}
                />
                <PaymentOption
                    id="lankaqr"
                    label="LankaQR"
                    iconComponent={<MaterialCommunityIcons name="qrcode-scan" size={24} color={method === 'lankaqr' ? '#FFF' : '#374151'} />}
                />
                <PaymentOption
                    id="ezcash"
                    label="eZ Cash / mCash"
                    iconComponent={<FontAwesome name="money" size={24} color={method === 'ezcash' ? '#FFF' : '#374151'} />}
                />

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payButton, !method && styles.disabledButton]}
                    disabled={!method}
                    onPress={handlePayment}
                >
                    <Feather name="lock" size={20} color={method ? "#FFF" : "#9CA3AF"} />
                    <Text style={styles.payButtonText}>Pay & Confirm</Text>
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
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    amountCard: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 8,
    },
    amountLabel: { fontSize: 14, color: '#6B7280', marginBottom: 8, fontWeight: '600', textTransform: 'uppercase' },
    amountValue: { fontSize: 40, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
    secureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    secureText: { color: '#059669', fontSize: 12, fontWeight: '700' },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        elevation: 2,
    },
    selectedOption: {
        borderColor: '#1F2937',
        backgroundColor: '#FFF',
    },
    optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLabel: { fontSize: 16, fontWeight: '700', color: '#374151' },
    selectedLabel: { color: '#1F2937' },
    footer: {
        backgroundColor: '#FFF',
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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

export default PaymentScreen;
