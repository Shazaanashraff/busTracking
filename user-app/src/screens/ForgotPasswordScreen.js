import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleReset = () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }
        // Mock Reset Logic
        Alert.alert("Link Sent", "A password reset link has been sent to your email.", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        <Feather name="key" size={32} color="#000" />
                    </View>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>Don't worry! It happens. Please enter the email associated with your account.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Feather name="mail" size={20} color="#9CA3AF" />
                            <TextInput
                                style={styles.input}
                                placeholder="hello@example.com"
                                placeholderTextColor="#D1D5DB"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.resetBtn}
                        onPress={handleReset}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.resetBtnText}>Send Reset Code</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Remember Password?</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.loginText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    content: {
        flex: 1,
        padding: 32,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        width: 40,
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 2,
        zIndex: 10,
    },
    header: { alignItems: 'center', marginBottom: 40 },
    logoBox: {
        width: 64,
        height: 64,
        backgroundColor: '#FCD24A',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#FCD24A',
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
    form: { width: '100%' },
    inputGroup: { marginBottom: 24 },
    label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 8, textTransform: 'uppercase' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 12,
    },
    input: { flex: 1, fontSize: 16, color: '#1F2937', fontWeight: '600' },
    resetBtn: {
        backgroundColor: '#1F2937',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    resetBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 32,
    },
    footerText: { color: '#6B7280', fontSize: 14 },
    loginText: { color: '#1F2937', fontSize: 14, fontWeight: '800' },
});

export default ForgotPasswordScreen;
