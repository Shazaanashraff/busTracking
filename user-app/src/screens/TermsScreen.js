import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

const TermsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms & Privacy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.lastUpdated}>Last Updated: Jan 2026</Text>

                <Text style={styles.heading}>1. Introduction</Text>
                <Text style={styles.paragraph}>
                    Welcome to BusTrack. By accessing or using our mobile application, you agree to be bound by these Terms of Service and our Privacy Policy.
                </Text>

                <Text style={styles.heading}>2. Booking & Cancellation</Text>
                <Text style={styles.paragraph}>
                    All bookings are subject to availability. Cancellations made 2 hours prior to departure are eligible for a refund, subject to a 10% processing fee.
                </Text>

                <Text style={styles.heading}>3. User Conduct</Text>
                <Text style={styles.paragraph}>
                    You agree to use the application only for lawful purposes. Any fraudulent activity or misuse of the tracking system will result in immediate account termination.
                </Text>

                <Text style={styles.heading}>4. Data Privacy</Text>
                <Text style={styles.paragraph}>
                    We collect location data to provide real-time tracking services. Your data is encrypted and never shared with third parties without your consent.
                </Text>

                <View style={styles.divider} />

                <Text style={styles.footerNote}>
                    For more details, please contact our legal team at legal@bustrack.com
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
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
        elevation: 1,
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    content: { padding: 32 },
    lastUpdated: { fontSize: 12, color: '#9CA3AF', marginBottom: 24, fontStyle: 'italic' },
    heading: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 8, marginTop: 16 },
    paragraph: { fontSize: 14, color: '#4B5563', lineHeight: 22, textAlign: 'justify' },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 32 },
    footerNote: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
});

export default TermsScreen;
