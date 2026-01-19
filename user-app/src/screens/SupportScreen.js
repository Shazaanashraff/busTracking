import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const SupportScreen = ({ navigation }) => {
    const [expandedId, setExpandedId] = useState(null);

    const faqs = [
        {
            id: 1,
            question: "How do I book a ticket?",
            answer: "Select your destination, choose a bus, pick your seat, and proceed to payment."
        },
        {
            id: 2,
            question: "Can I cancel my booking?",
            answer: "Yes, you can cancel your booking up to 2 hours before departure from the 'My Bookings' section."
        },
        {
            id: 3,
            question: "Is my payment secure?",
            answer: "Absolutely. We use industry-standard encryption to process all payments securely."
        }
    ];

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Support Center</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.banner}>
                    <Ionicons name="headset" size={48} color="#FFF" />
                    <Text style={styles.bannerTitle}>How can we help you?</Text>
                </View>

                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                <View style={styles.faqList}>
                    {faqs.map((faq) => (
                        <View key={faq.id} style={styles.faqItem}>
                            <TouchableOpacity
                                style={styles.faqHeader}
                                onPress={() => toggleExpand(faq.id)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.question}>{faq.question}</Text>
                                <Feather
                                    name={expandedId === faq.id ? "minus" : "plus"}
                                    size={20}
                                    color="#4B5563"
                                />
                            </TouchableOpacity>
                            {expandedId === faq.id && (
                                <View style={styles.faqBody}>
                                    <Text style={styles.answer}>{faq.answer}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>Still need help?</Text>
                    <TouchableOpacity style={styles.contactBtn}>
                        <Feather name="mail" size={20} color="#FFF" />
                        <Text style={styles.contactBtnText}>Contact Support</Text>
                    </TouchableOpacity>
                </View>
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
    content: { padding: 24 },
    banner: {
        backgroundColor: '#1F2937',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 32,
    },
    bannerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    faqList: { marginBottom: 32 },
    faqItem: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    question: { fontSize: 14, fontWeight: '600', color: '#374151', flex: 1 },
    faqBody: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    answer: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
    contactBtn: {
        backgroundColor: '#FCD24A',
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    contactBtnText: { color: '#1F2937', fontSize: 16, fontWeight: '700' },
});

export default SupportScreen;
