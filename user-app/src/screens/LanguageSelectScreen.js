import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const LanguageSelectScreen = ({ navigation }) => {
    const selectLanguage = (lang) => {
        // In a real app, save this preference
        navigation.replace('Home');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>🚌</Text>
                    <Text style={styles.appName}>Sri Bus Tracker</Text>
                </View>

                <Text style={styles.title}>Select Language</Text>
                <Text style={styles.subtitle}>භාෂාව තෝරන්න</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.languageButton}
                        onPress={() => selectLanguage('si')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.sinhalaText}>සිංහල</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.languageButton, styles.englishButton]}
                        onPress={() => selectLanguage('en')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.englishText}>English</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCD24A', // Primary Yellow
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: width * 0.85,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 64,
        marginBottom: 8,
    },
    appName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 18,
        color: '#4B5563',
        marginBottom: 32,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    languageButton: {
        backgroundColor: '#1F2937',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    englishButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sinhalaText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    englishText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
});

export default LanguageSelectScreen;
