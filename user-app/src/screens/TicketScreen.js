import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TicketScreen = ({ navigation, route }) => {
    const { bus, seats, passenger, totalAmount } = route.params;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.successIcon}>
                    <Feather name="check-circle" size={48} color="#059669" />
                </View>
                <Text style={styles.title}>Booking Confirmed!</Text>
                <Text style={styles.subtitle}>Your ticket has been booked successfully.</Text>

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

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <View>
                                <Text style={styles.label}>Passenger</Text>
                                <Text style={styles.value}>{passenger.name || 'Guest'}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.label}>Seat No(s)</Text>
                                <Text style={styles.value}>{seats.join(', ').replace(/R-|L-/g, '')}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Perforated Line Effect */}
                    <View style={styles.perforationContainer}>
                        <View style={styles.circleLeft} />
                        <View style={styles.dashedLine} />
                        <View style={styles.circleRight} />
                    </View>

                    <View style={styles.ticketFooter}>
                        <View style={styles.qrPlaceholder}>
                            <Ionicons name="qr-code-outline" size={100} color="#1F2937" />
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
    },
    successIcon: {
        width: 80,
        height: 80,
        backgroundColor: '#ECFDF5',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#059669',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32, textAlign: 'center' },
    ticket: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
    },
    ticketHeader: {
        padding: 24,
        backgroundColor: '#1F2937',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    operator: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    route: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
    plateBadge: {
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    plateText: { color: '#1F2937', fontWeight: '800', fontSize: 14 },
    ticketBody: { padding: 24 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
    label: { fontSize: 12, color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase', fontWeight: '600' },
    value: { fontSize: 16, fontWeight: '700', color: '#1F2937' },

    perforationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 20,
        backgroundColor: '#FFF',
        overflow: 'hidden',
    },
    circleLeft: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        marginLeft: -10,
    },
    circleRight: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        marginRight: -10,
    },
    dashedLine: {
        flex: 1,
        height: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        marginHorizontal: 16,
    },

    ticketFooter: {
        padding: 32,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    qrPlaceholder: {
        padding: 16,
        borderWidth: 2,
        borderColor: '#1F2937',
        borderRadius: 16,
        marginBottom: 16,
    },
    ticketId: { fontSize: 14, color: '#6B7280', fontFamily: 'monospace' },
    homeButton: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 32,
        paddingVertical: 18,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 4,
    },
    homeButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});

export default TicketScreen;
