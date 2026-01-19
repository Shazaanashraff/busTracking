import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

const PaymentSuccessScreen = ({ navigation, route }) => {
    const { ticketId } = route.params || { ticketId: 'T-12345' };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#059669" />

            <View style={styles.iconBox}>
                <Feather name="check" size={64} color="#059669" />
            </View>

            <Text style={styles.title}>Payment Successful!</Text>
            <Text style={styles.subtitle}>Your booking has been confirmed.</Text>

            <View style={styles.ticketCard}>
                <Text style={styles.label}>Ticket ID</Text>
                <Text style={styles.ticketId}>{ticketId}</Text>
                <View style={styles.divider} />
                <Text style={styles.info}>A confirmation email has been sent to your registered email address.</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.viewTicketBtn}
                    onPress={() => navigation.navigate('Ticket')}
                    activeOpacity={0.9}
                >
                    <Text style={styles.viewTicketText}>View Ticket</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.homeBtn}
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    })}
                >
                    <Text style={styles.homeBtnText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#059669',
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
    subtitle: { fontSize: 16, color: '#D1FAE5', marginBottom: 40 },
    ticketCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    label: { color: '#D1FAE5', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
    ticketId: { color: '#FFF', fontSize: 28, fontWeight: '800', letterSpacing: 2 },
    divider: { width: '100%', height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginVertical: 16 },
    info: { color: '#D1FAE5', textAlign: 'center', fontSize: 13, lineHeight: 20 },
    actions: { width: '100%', gap: 16 },
    viewTicketBtn: {
        backgroundColor: '#FFF',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewTicketText: { color: '#059669', fontSize: 16, fontWeight: '700' },
    homeBtn: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    homeBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default PaymentSuccessScreen;
