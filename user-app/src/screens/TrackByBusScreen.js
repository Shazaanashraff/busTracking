import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="#1F2937" />
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
                            <View style={styles.inputContainer}>
                                <Ionicons name="git-network-outline" size={20} color="#6B7280" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: 138"
                                    value={routeNumber}
                                    onChangeText={setRouteNumber}
                                    keyboardType="numeric"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Bus Plate Number</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="bus-outline" size={20} color="#6B7280" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: ND-4567"
                                    value={busNumber}
                                    onChangeText={setBusNumber}
                                    autoCapitalize="characters"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.trackBtn, (!routeNumber || !busNumber) && styles.disabledBtn]}
                            onPress={handleTrack}
                            disabled={!routeNumber || !busNumber}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.trackBtnText}>Find & Track</Text>
                            <Feather name="navigation" size={20} color={!routeNumber || !busNumber ? "#D1D5DB" : "#FFF"} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.helpCard}>
                        <Ionicons name="information-circle" size={24} color="#2563EB" />
                        <Text style={styles.helpText}>
                            Use this if you are waiting for a specific bus or want to check where your friend's bus is.
                        </Text>
                    </View>

                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    screenTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    heading: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 8,
    },
    subHeading: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
    },
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 8,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '600',
    },
    trackBtn: {
        flexDirection: 'row',
        backgroundColor: '#FCD24A',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        gap: 12,
    },
    disabledBtn: {
        backgroundColor: '#F3F4F6',
    },
    trackBtnText: {
        color: '#1F2937',
        fontSize: 16,
        fontWeight: '700',
    },
    helpCard: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 20,
        borderRadius: 24,
        alignItems: 'center',
        gap: 16,
    },
    helpText: {
        flex: 1,
        fontSize: 14,
        color: '#1E40AF',
        lineHeight: 20,
        fontWeight: '500',
    },
});

export default TrackByBusScreen;
