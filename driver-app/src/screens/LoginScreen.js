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
  Dimensions,
  SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { signInWithPhone } from '../services/authService';

const { width, height } = Dimensions.get('window');
const BRAND_GREEN = '#10B981'; // FareGO-like green

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

  // ==================== HANDLERS ====================

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      await signInWithPhone(phone);
      setOtpSent(true);
      Alert.alert('Code Sent', 'Please check your messages.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code');
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
      Alert.alert('Missing Fields', 'Please fill in all fields');
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

  // ==================== RENDER ====================

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* HEADER / ILLUSTRATION SECTION */}
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="bus-side" size={64} color={BRAND_GREEN} />
            </View>
            <Text style={styles.welcomeText}>Welcome to FareGO</Text>
            <Text style={styles.subText}>Partner App</Text>
          </View>

          {/* TAB SWITCHER */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'phone' && styles.activeTabButton]}
              onPress={() => setActiveTab('phone')}
            >
              <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>Phone</Text>
            </TouchableOpacity>
            <View style={styles.tabDivider} />
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'email' && styles.activeTabButton]}
              onPress={() => setActiveTab('email')}
            >
              <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>Email</Text>
            </TouchableOpacity>
          </View>

          {/* FORM AREA */}
          <View style={styles.formSection}>
            {activeTab === 'phone' ? (
              // PHONE INPUT
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Feather name="smartphone" size={20} color="#9CA3AF" />
                  </View>
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
                  <View style={[styles.inputWrapper, { marginTop: 16 }]}>
                    <View style={styles.inputIcon}>
                      <Feather name="lock" size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                      style={styles.input}
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="Enter 6-digit Code"
                      keyboardType="number-pad"
                      maxLength={6}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                )}
              </>
            ) : (
              // EMAIL INPUT
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Feather name="mail" size={20} color="#9CA3AF" />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@company.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={[styles.inputWrapper, { marginTop: 16 }]}>
                  <View style={styles.inputIcon}>
                    <Feather name="lock" size={20} color="#9CA3AF" />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </>
            )}

            {/* MAIN BUTTON (Reference: Black "Get Started" Button) */}
            <TouchableOpacity
              style={styles.mainButton}
              onPress={
                activeTab === 'phone'
                  ? (otpSent ? handleVerifyOtp : handleSendOtp)
                  : handleEmailLogin
              }
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.mainButtonText}>
                  {activeTab === 'phone' && !otpSent ? 'Get Started' : 'Login'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Links / Help */}
            <View style={styles.footerLinks}>
              {activeTab === 'phone' && otpSent && (
                <TouchableOpacity onPress={() => { setOtpSent(false); setOtp(''); }}>
                  <Text style={styles.linkText}>Change Number</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    paddingVertical: 40,
  },

  // HEADER
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#6B7280',
  },

  // TABS
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    alignSelf: 'center',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: BRAND_GREEN,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#111827',
  },
  tabDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },

  // INPUTS
  formSection: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },

  // BUTTON
  mainButton: {
    backgroundColor: '#000000',
    borderRadius: 30, // Pill shape
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  // FOOTER
  footerLinks: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: BRAND_GREEN,
    fontWeight: '500',
    fontSize: 14,
  },
});

export default LoginScreen;
