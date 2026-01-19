import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

const PaymentFailureScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#EF4444" />

            <View style={styles.iconBox}>
                <Feather name="x" size={64} color="#EF4444" />
            </View>

            <Text style={styles.title}>Payment Failed</Text>
            <Text style={styles.subtitle}>Something went wrong with your transaction.</Text>

            <View style={styles.card}>
                <Text style={styles.info}>
                    Please check your internet connection or try a different payment method. No money has been deducted from your account.
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.retryBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.9}
                >
                    <Text style={styles.retryBtnText}>Try Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.cancelBtnText}>Cancel Booking</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconBox: {
        width: 120,
        height: 120,
        backgroundColor: '#FFF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#FEE2E2', marginBottom: 40 },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    info: { color: '#FEE2E2', textAlign: 'center', fontSize: 14, lineHeight: 22 },
    actions: { width: '100%', gap: 16 },
    retryBtn: {
        backgroundColor: '#FFF',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryBtnText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
    cancelBtn: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    cancelBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default PaymentFailureScreen;
