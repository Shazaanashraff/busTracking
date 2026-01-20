import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BusinessInfoScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        businessName: 'Lanka Bus Lines Pvt Ltd',
        regNumber: 'NTC-884-221',
        ownerName: 'Kamal Perera',
        email: 'kamal.bus@example.com',
        phone: '077 123 4567',
        address: 'No 12, High Level Road, Maharagama'
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Business Info</Text>
                <TouchableOpacity style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Business Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.businessName}
                            onChangeText={(t) => setFormData({ ...formData, businessName: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Registration Number (NTC)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.regNumber}
                            onChangeText={(t) => setFormData({ ...formData, regNumber: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Owner Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.ownerName}
                            onChangeText={(t) => setFormData({ ...formData, ownerName: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            keyboardType="email-address"
                            onChangeText={(t) => setFormData({ ...formData, email: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            keyboardType="phone-pad"
                            onChangeText={(t) => setFormData({ ...formData, phone: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Business Address</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            value={formData.address}
                            multiline
                            numberOfLines={3}
                            onChangeText={(t) => setFormData({ ...formData, address: t })}
                        />
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
                    <Text style={styles.infoText}>
                        Updating critical information like Registration Number requires verification by NTC.
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
    formCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },

    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginBottom: 6, marginLeft: 4 },
    input: {
        backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
        padding: 12, fontSize: 15, color: '#1F2937'
    },

    infoBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, gap: 12 },
    infoText: { flex: 1, fontSize: 13, color: '#1E40AF', lineHeight: 18 }
});

export default BusinessInfoScreen;
