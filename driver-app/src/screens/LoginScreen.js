import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { signInWithEmail, signInWithPhone, verifyOtp } from '../services/authService';

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('phone'); // 'phone' or 'email'

  // Phone OTP state
  const [phone, setPhone] = useState('+94');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // ==================== PHONE OTP HANDLERS ====================

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await signInWithPhone(phone);
      setOtpSent(true);
      Alert.alert('OTP Sent', 'Check your phone for the verification code');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(phone, otp);
      // Auth state change will be handled by AuthContext
    } catch (error) {
      Alert.alert('Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== EMAIL HANDLERS ====================

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // Auth state change will be handled by AuthContext
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🚌 Bus Partner</Text>
          <Text style={styles.subtitle}>Login to start tracking</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
            onPress={() => { setActiveTab('phone'); setOtpSent(false); }}
          >
            <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
              📱 Phone
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'email' && styles.activeTab]}
            onPress={() => setActiveTab('email')}
          >
            <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
              ✉️ Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* Phone OTP Form */}
        {activeTab === 'phone' && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number (+94...)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
              editable={!otpSent}
            />

            {otpSent && (
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor="#9CA3AF"
              />
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {otpSent ? 'Verify OTP' : 'Send OTP'}
                </Text>
              )}
            </TouchableOpacity>

            {otpSent && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => { setOtpSent(false); setOtp(''); }}
              >
                <Text style={styles.linkText}>Change phone number</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Email Form */}
        {activeTab === 'email' && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.hint}>
          {activeTab === 'phone'
            ? 'Sri Lanka: +94 followed by your number'
            : 'Use your registered email and password'
          }
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1F2937',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  button: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 24,
    fontSize: 12,
  },
});

export default LoginScreen;
