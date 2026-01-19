import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const NotificationsScreen = ({ navigation }) => {
    const notifications = [
        {
            id: '1',
            title: 'Booking Confirmed',
            body: 'Your booking for Colombo to Kandy (BK-8821) has been confirmed.',
            time: '2 mins ago',
            type: 'success',
            icon: 'check-circle'
        },
        {
            id: '2',
            title: 'Bus Arriving Soon',
            body: 'Your bus ND-4567 is 5 minutes away from your pickup point.',
            time: '1 hour ago',
            type: 'info',
            icon: 'clock'
        },
        {
            id: '3',
            title: 'Delay Alert',
            body: 'Bus NC-1234 is delayed by 15 minutes due to heavy traffic at Peliyagoda.',
            time: 'Yesterday',
            type: 'warning',
            icon: 'alert-triangle'
        }
    ];

    const getIconColor = (type) => {
        switch (type) {
            case 'success': return '#059669';
            case 'warning': return '#D97706';
            default: return '#2563EB';
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'success': return '#ECFDF5';
            case 'warning': return '#FFFBEB';
            default: return '#EFF6FF';
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: getBgColor(item.type) }]}>
                <Feather name={item.icon} size={20} color={getIconColor(item.type)} />
            </View>
            <View style={styles.contentBox}>
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.body}>{item.body}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
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
    list: { paddingHorizontal: 24, paddingBottom: 40 },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        elevation: 2,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentBox: { flex: 1 },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        alignItems: 'center',
    },
    title: { fontSize: 16, fontWeight: '700', color: '#1F2937', flex: 1, marginRight: 8 },
    time: { fontSize: 12, color: '#9CA3AF' },
    body: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
});

export default NotificationsScreen;
