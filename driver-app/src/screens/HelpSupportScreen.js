import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpSupportScreen = ({ navigation }) => {
    const [expandedId, setExpandedId] = useState(null);

    const faqs = [
        { id: '1', q: 'How do I add a new bus?', a: 'Go to the "My Buses" tab and tap the + icon in the top right corner. Fill in the bus details and registration documents.' },
        { id: '2', q: 'How are payouts calculated?', a: 'Payouts are calculated based on the total ticket sales minus the platform fee (5%). Payments are processed weekly on Mondays.' },
        { id: '3', q: 'Can I change my driver?', a: 'Yes, go to Profile > Driver Management. You can reassign drivers to different buses or add new ones.' },
        { id: '4', q: 'What if a passenger cancels?', a: 'If a passenger cancels 24h before the trip, seats are released automatically. You will see the update in your dashboard.' },
    ];

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleCall = () => {
        Linking.openURL(`tel:1919`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Contact Hero */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroTitle}>Need Help?</Text>
                    <Text style={styles.heroText}>Our support team is available 24/7 to assist you with any issues.</Text>
                    <View style={styles.contactRow}>
                        <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
                            <Ionicons name="call" size={20} color="#FFF" />
                            <Text style={styles.contactBtnText}>Call Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#FFF' }]}>
                            <Ionicons name="mail" size={20} color="#1F2937" />
                            <Text style={[styles.contactBtnText, { color: '#1F2937' }]}>Email Us</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FAQ Section */}
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                <View style={styles.faqList}>
                    {faqs.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.faqItem}
                            activeOpacity={0.8}
                            onPress={() => toggleExpand(item.id)}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={styles.question}>{item.q}</Text>
                                <Ionicons
                                    name={expandedId === item.id ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#6B7280"
                                />
                            </View>
                            {expandedId === item.id && (
                                <View style={styles.answerBox}>
                                    <Text style={styles.answer}>{item.a}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
    backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF' },
    content: { padding: 20, paddingTop: 0 },

    heroCard: { backgroundColor: '#1F2937', borderRadius: 24, padding: 24, marginBottom: 32, elevation: 4 },
    heroTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', marginBottom: 8 },
    heroText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 20, lineHeight: 20 },
    contactRow: { flexDirection: 'row', gap: 12 },
    contactBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#3B82F6', padding: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
    contactBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
    faqList: { gap: 12 },
    faqItem: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, elevation: 1 },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
    question: { fontSize: 15, fontWeight: '600', color: '#1F2937', flex: 1 },
    answerBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    answer: { fontSize: 14, color: '#6B7280', lineHeight: 20 }
});

export default HelpSupportScreen;
