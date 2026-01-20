import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const ReportsScreen = ({ navigation }) => {

    const reports = [
        { id: '1', title: 'Daily Sales Report', type: 'Sales', date: 'Oct 24, 2025', icon: 'cash-outline', color: '#10B981' },
        { id: '2', title: 'Weekly Performance', type: 'Performance', date: 'Oct 18 - 24', icon: 'bar-chart-outline', color: '#3B82F6' },
        { id: '3', title: 'Driver Attendance', type: 'HR', date: 'October 2025', icon: 'people-outline', color: '#F59E0B' },
        { id: '4', title: 'Monthly Revenue', type: 'Finance', date: 'September 2025', icon: 'pie-chart-outline', color: '#8B5CF6' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reports</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Text style={styles.sectionTitle}>Available Reports</Text>

                {reports.map((item) => (
                    <View key={item.id} style={styles.reportCard}>
                        <View style={[styles.iconBox, { backgroundColor: `${item.color}20` }]}>
                            <Ionicons name={item.icon} size={24} color={item.color} />
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.reportTitle}>{item.title}</Text>
                            <Text style={styles.reportDate}>{item.date}</Text>
                        </View>
                        <TouchableOpacity style={styles.downloadBtn}>
                            <Ionicons name="download-outline" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={styles.customSection}>
                    <Text style={styles.sectionTitle}>Custom Report</Text>
                    <View style={styles.customCard}>
                        <Text style={styles.customText}>Generate a custom report by selecting a date range and category.</Text>
                        <TouchableOpacity style={styles.generateBtn}>
                            <Text style={styles.generateBtnText}>Create New Report</Text>
                        </TouchableOpacity>
                    </View>
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

    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#6B7280', marginBottom: 16 },

    reportCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 12, elevation: 2
    },
    iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    info: { flex: 1 },
    reportTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
    reportDate: { fontSize: 13, color: '#9CA3AF' },
    downloadBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 12 },

    customSection: { marginTop: 24 },
    customCard: { backgroundColor: '#E5E7EB', borderRadius: 20, padding: 20, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#D1D5DB' },
    customText: { textAlign: 'center', color: '#6B7280', marginBottom: 16, lineHeight: 20 },
    generateBtn: { backgroundColor: '#1F2937', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    generateBtnText: { color: '#FFF', fontWeight: '700' }
});

export default ReportsScreen;
