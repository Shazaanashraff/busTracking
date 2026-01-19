import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';

const TrackByBusScreen = ({ navigation }) => {
    const [routeNumber, setRouteNumber] = useState('');
    const [busNumber, setBusNumber] = useState('');

    const handleTrack = () => {
        if (routeNumber && busNumber) {
            navigation.navigate('LiveMap', {
                routeId: routeNumber,
                busId: busNumber,
                directTrack: true
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Track Bus</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <Text style={styles.heading}>Know your bus?</Text>
                <Text style={styles.subHeading}>Enter details to track it directly.</Text>

                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Route Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 138"
                            value={routeNumber}
                            onChangeText={setRouteNumber}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bus Plate Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: ND-4567"
                            value={busNumber}
                            onChangeText={setBusNumber}
                            autoCapitalize="characters"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.trackBtn, (!routeNumber || !busNumber) && styles.disabledBtn]}
                        onPress={handleTrack}
                        disabled={!routeNumber || !busNumber}
                    >
                        <Text style={styles.trackBtnText}>Find & Track</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.helpCard}>
                    <Text style={styles.helpIcon}>💡</Text>
                    <Text style={styles.helpText}>
                        Use this if you are waiting for a specific bus or want to check where your friend's bus is.
                    </Text>
                </View>

            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCD24A',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    screenTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
    },
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
    },
    heading: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 4,
    },
    subHeading: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
    },
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 4,
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '600',
    },
    trackBtn: {
        backgroundColor: '#1F2937',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    disabledBtn: {
        backgroundColor: '#9CA3AF',
    },
    trackBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    helpCard: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    helpIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    helpText: {
        flex: 1,
        fontSize: 12,
        color: '#1E40AF',
        lineHeight: 18,
    },
});

export default TrackByBusScreen;
