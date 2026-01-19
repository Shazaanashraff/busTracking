import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

const LanguageSelectScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <View style={styles.iconContainer}>
                <Feather name="globe" size={64} color="#1F2937" />
            </View>

            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Select your preferred language to continue</Text>

            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText}>සිංහල</Text>
                    <Feather name="chevron-right" size={20} color="#1F2937" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText}>English</Text>
                    <Feather name="chevron-right" size={20} color="#1F2937" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText}>தமிழ்</Text>
                    <Feather name="chevron-right" size={20} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <Text style={styles.footer}>Sri Lankan Bus Tracker App</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        padding: 32,
    },
    iconContainer: {
        alignSelf: 'center',
        marginBottom: 32,
        width: 120,
        height: 120,
        backgroundColor: '#FFF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 24,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 8,
    },
    button: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
    }
});

export default LanguageSelectScreen;
