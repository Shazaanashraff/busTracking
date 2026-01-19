import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const TicketScreen = ({ navigation, route }) => {
    const { bus, seats, passenger, totalAmount } = route.params;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            <View style={styles.content}>
                <View style={styles.successIcon}>
                    <Text style={{ fontSize: 40 }}>✅</Text>
                </View>
                <Text style={styles.title}>Booking Confirmed!</Text>
                <Text style={styles.subtitle}>Your ticket has been saved.</Text>

                <View style={styles.ticket}>
                    <View style={styles.ticketHeader}>
                        <View>
                            <Text style={styles.operator}>{bus.operator}</Text>
                            <Text style={styles.route}>Route {bus.routeNo}</Text>
                        </View>
                        <View style={styles.plateBadge}>
                            <Text style={styles.plateText}>{bus.plate}</Text>
                        </View>
                    </View>

                    <View style={styles.dashedLine} />

                    <View style={styles.ticketBody}>
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.label}>Date</Text>
                                <Text style={styles.value}>19 Jan 2026</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.label}>Time</Text>
                                <Text style={styles.value}>{bus.depTime}</Text>
                            </View>
                        </View>

                        <View style={[styles.row, { marginTop: 16 }]}>
                            <View>
                                <Text style={styles.label}>Passenger</Text>
                                <Text style={styles.value}>{passenger.name}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.label}>Seat No(s)</Text>
                                <Text style={styles.value}>{seats.join(', ').replace(/R-|L-/g, '')}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.dashedLine} />

                    <View style={styles.ticketFooter}>
                        <View style={styles.qrPlaceholder}>
                            <Text style={styles.qrText}>QR CODE</Text>
                        </View>
                        <Text style={styles.ticketId}>Ref: #BK-{Math.floor(Math.random() * 10000)}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.homeButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCD24A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: width * 0.9,
        alignItems: 'center',
    },
    successIcon: {
        width: 80,
        height: 80,
        backgroundColor: '#ECFDF5',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
    subtitle: { fontSize: 16, color: '#4B3621', marginBottom: 32, opacity: 0.8 },
    ticket: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    ticketHeader: {
        padding: 24,
        backgroundColor: '#1F2937',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    operator: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    route: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
    plateBadge: {
        backgroundColor: '#FCD24A',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    plateText: { color: '#1F2937', fontWeight: '700', fontSize: 12 },
    dashedLine: {
        height: 1,
        width: '100%',
        backgroundColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    ticketBody: { padding: 24 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
    value: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    ticketFooter: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    qrPlaceholder: {
        width: 150,
        height: 150,
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    qrText: { fontWeight: '800', color: '#1F2937' },
    ticketId: { fontSize: 12, color: '#6B7280' },
    homeButton: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
    },
    homeButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});

export default TicketScreen;
