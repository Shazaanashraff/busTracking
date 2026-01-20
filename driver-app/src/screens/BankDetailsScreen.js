import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BankDetailsScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        bankName: 'Commercial Bank',
        branch: 'Maharagama',
        accountNumber: '8800123456',
        holderName: 'Lanka Bus Lines Pvt Ltd'
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bank Details</Text>
                <TouchableOpacity style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.bankIcon}>
                            <Ionicons name="card" size={24} color="#FFF" />
                        </View>
                        <View>
                            <Text style={styles.bankTitle}>{formData.bankName}</Text>
                            <Text style={styles.bankSub}>{formData.accountNumber}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bank Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.bankName}
                            onChangeText={(t) => setFormData({ ...formData, bankName: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Branch Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.branch}
                            onChangeText={(t) => setFormData({ ...formData, branch: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Account Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.accountNumber}
                            keyboardType="numeric"
                            onChangeText={(t) => setFormData({ ...formData, accountNumber: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Account Holder Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.holderName}
                            onChangeText={(t) => setFormData({ ...formData, holderName: t })}
                        />
                    </View>
                </View>

                <View style={styles.secureBox}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#059669" />
                    <Text style={styles.secureText}>
                        Your bank details are encrypted and stored securely. Used for weekly payouts.
                    </Text>
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
    saveBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#1F2937', borderRadius: 8 },
    saveBtnText: { color: '#FFF', fontWeight: '700' },
    content: { padding: 20, paddingTop: 0 },

    card: { backgroundColor: '#1F2937', borderRadius: 20, padding: 20, marginBottom: 24, elevation: 4 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    bankIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center' },
    bankTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    bankSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 2 },

    formCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginBottom: 6, marginLeft: 4 },
    input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, fontSize: 16, color: '#1F2937' },

    secureBox: { flexDirection: 'row', backgroundColor: '#ECFDF5', padding: 16, borderRadius: 12, gap: 12, alignItems: 'center' },
    secureText: { flex: 1, fontSize: 13, color: '#047857', lineHeight: 18 }
});

export default BankDetailsScreen;
