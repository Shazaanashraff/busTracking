import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock login logic
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Feather name="navigation" size={40} color="#000" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to track your journey</Text>
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

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.9}
          >
            <Text style={styles.loginBtnText}>Sign In</Text>
            <Feather name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.signupText}>Create Account</Text>
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
    justifyContent: 'center',
    padding: 32,
  },
  header: { alignItems: 'center', marginBottom: 48 },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FCD24A',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FCD24A',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
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
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 32 },
  forgotText: { color: '#4B5563', fontSize: 14, fontWeight: '600' },
  loginBtn: {
    backgroundColor: '#1F2937',
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 48,
  },
  footerText: { color: '#6B7280', fontSize: 14 },
  signupText: { color: '#1F2937', fontSize: 14, fontWeight: '800' },
});

export default LoginScreen;
