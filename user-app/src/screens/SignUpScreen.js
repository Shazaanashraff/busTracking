import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SignUpScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = () => {
        // Mock Signup logic
        navigation.replace('Home');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Feather name="arrow-left" size={24} color="#1F2937" />
                        </TouchableOpacity>
                        <View style={styles.logoBox}>
                            <Feather name="user-plus" size={32} color="#000" />
                        </View>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us and start journey today</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="user" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor="#D1D5DB"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

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

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="phone" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="077 123 4567"
                                    placeholderTextColor="#D1D5DB"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="lock" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#D1D5DB"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="check-circle" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#D1D5DB"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.signupBtn}
                            onPress={handleSignUp}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.signupBtnText}>Sign Up</Text>
                            <Feather name="arrow-right" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    content: { flex: 1 },
    scrollContent: {
        padding: 32,
        paddingTop: 60,
    },
    header: { alignItems: 'center', marginBottom: 32 },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 2,
    },
    logoBox: {
        width: 64,
        height: 64,
        backgroundColor: '#FCD24A',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#FCD24A',
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
    form: { width: '100%' },
    inputGroup: { marginBottom: 16 },
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
    signupBtn: {
        backgroundColor: '#1F2937',
        height: 60,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    signupBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 32,
        marginBottom: 20,
    },
    footerText: { color: '#6B7280', fontSize: 14 },
    loginText: { color: '#1F2937', fontSize: 14, fontWeight: '800' },
});

export default SignUpScreen;
