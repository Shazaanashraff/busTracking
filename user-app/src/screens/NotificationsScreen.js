import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';

const NotificationsScreen = ({ navigation }) => {
    const notifications = [
        {
            id: '1',
            title: 'Booking Confirmed ✅',
            body: 'Your booking for Colombo to Kandy (BK-8821) has been confirmed.',
            time: '2 mins ago',
            type: 'success'
        },
        {
            id: '2',
            title: 'Bus Arriving Soon 🚌',
            body: 'Your bus ND-4567 is 5 minutes away from your pickup point.',
            time: '1 hour ago',
            type: 'info'
        },
        {
            id: '3',
            title: 'Delay Alert ⚠️',
            body: 'Bus NC-1234 is delayed by 15 minutes due to heavy traffic at Peliyagoda.',
            time: 'Yesterday',
            type: 'warning'
        }
    ];

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.body}>{item.body}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FCD24A' },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
    content: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
    },
    list: { paddingBottom: 20 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    time: { fontSize: 12, color: '#9CA3AF' },
    body: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
});

export default NotificationsScreen;
