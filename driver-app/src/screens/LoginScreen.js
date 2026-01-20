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
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { signInWithPhone } from '../services/authService';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const { login, verifyPhoneLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('phone'); // 'phone' or 'email'

  // Phone OTP state
  const [phone, setPhone] = useState('+94');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // ==================== HANDLERS (Unchanged Logic) ====================

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
      await verifyPhoneLogin(phone, otp);
    } catch (error) {
      Alert.alert('Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== NEW RENDER ====================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* TOP SECTION: BRANDING */}
        <View style={styles.topSection}>
          {/* Placeholder for Logo - Using Text Icon for now */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🚌</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome to FareGO</Text>
          <Text style={styles.subText}>Partner App</Text>
        </View>

        {/* MIDDLE SECTION: INTERACTION AREA */}
        <View style={styles.middleSection}>

          {/* Tab Switcher (Subtle) */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
              onPress={() => setActiveTab('phone')}
            >
              <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'email' && styles.activeTab]}
              onPress={() => setActiveTab('email')}
            >
              <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>Email</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'phone' ? (
            // PHONE INPUTS
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+94 77 123 4567"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                  editable={!otpSent}
                />
              </View>

              {otpSent && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Verification Code</Text>
                  <View style={styles.otpContainer}>
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="• • • • • •"
                      keyboardType="number-pad"
                      maxLength={6}
                      placeholderTextColor="#9CA3AF"
                      textAlign="center"
                    />
                  </View>
                </View>
              )}
            </>
          ) : (
            // EMAIL INPUTS
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="driver@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </>
          )}

          {/* PRIMARY ACTION BUTTON */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={
              activeTab === 'phone'
                ? (otpSent ? handleVerifyOtp : handleSendOtp)
                : handleEmailLogin
            }
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {activeTab === 'phone'
                  ? (otpSent ? 'Verify & Login' : 'Get Started')
                  : 'Login'}
              </Text>
            )}
          </TouchableOpacity>

        </View>

        {/* BOTTOM SECTION: SECONDARY ACTIONS */}
        <View style={styles.bottomSection}>
          {activeTab === 'phone' && otpSent && (
            <TouchableOpacity onPress={() => { setOtpSent(false); setOtp(''); }}>
              <Text style={styles.linkText}>Change Number</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => Alert.alert('Support', 'Please contact admin for help.')}>
            <Text style={styles.secondaryText}>Need Help?</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark Theme Request from "Visual Hierarchy" usually implies premium dark/light
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // TOP SECTION
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#9CA3AF',
  },

  // MIDDLE SECTION
  middleSection: {
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#2D2D2D',
  },
  tabText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },

  // INPUTS
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#D1D5DB',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16, // Pill shape-ish
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  otpContainer: {
    alignItems: 'center',
  },
  otpInput: {
    width: '100%',
    letterSpacing: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },

  // BUTTONS
  primaryButton: {
    backgroundColor: '#FFFFFF', // High Contrast
    borderRadius: 30, // Full Pill
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // BOTTOM SECTION
  bottomSection: {
    marginTop: 40,
    alignItems: 'center',
    gap: 16,
  },
  linkText: {
    color: '#60A5FA', // Blue-400
    fontWeight: '600',
  },
  secondaryText: {
    color: '#6B7280',
    fontSize: 14,
  },
});

export default LoginScreen;
