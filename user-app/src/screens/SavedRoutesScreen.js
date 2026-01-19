import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const SavedRoutesScreen = ({ navigation }) => {
    const savedRoutes = [
        { id: '1', routeNo: '138', name: 'Colombo - Homagama', type: 'Normal' },
        { id: '2', routeNo: '120', name: 'Colombo - Horana', type: 'AC' },
        { id: '3', routeNo: '177', name: 'Kollupitiya - Kaduwela', type: 'Luxury' },
    ];

    const renderRoute = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('LiveMap', { routeId: item.routeNo })}
        >
            <View style={styles.iconContainer}>
                <Ionicons name="bus" size={24} color="#FCD24A" />
            </View>
            <View style={styles.routeInfo}>
                <Text style={styles.routeNo}>Route {item.routeNo}</Text>
                <Text style={styles.routeName}>{item.name}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.type}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.deleteBtn}>
                <Feather name="trash-2" size={20} color="#EF4444" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Routes</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <FlatList
                    data={savedRoutes}
                    renderItem={renderRoute}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
    content: { flex: 1, paddingHorizontal: 24 },
    list: { paddingTop: 16 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#FFFBEB',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    routeInfo: { flex: 1 },
    routeNo: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
    routeName: { fontSize: 13, color: '#6B7280', marginVertical: 2 },
    badge: {
        backgroundColor: '#F3F4F6',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 4,
    },
    badgeText: { fontSize: 10, fontWeight: '600', color: '#4B5563' },
    deleteBtn: {
        padding: 8,
    },
});

export default SavedRoutesScreen;
