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
  Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login(email, password);

      if (response.role !== 'driver' && response.role !== 'owner') {
        Alert.alert('Error', 'This app is for drivers and owners only');
        return;
      }

      await login(
        { _id: response._id, name: response.name, email: response.email, role: response.role },
        response.token
      );
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🚌 Bus Partner</Text>
        <Text style={styles.subtitle}>Login to start tracking</Text>
      </View>

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
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        Test: driver@test.com / password123
      </Text>

      {/* Dev Mode Quick Login */}
      <View style={styles.devContainer}>
        <Text style={styles.devTitle}>🚧 Dev Mode Quick Login</Text>
        <View style={styles.devBtnRow}>
          <TouchableOpacity
            style={[styles.devBtn, { backgroundColor: '#059669' }]}
            onPress={() => {
              login(
                { _id: 'driver_dev', name: 'Dev Driver', email: 'driver@dev.com', role: 'driver' },
                'mock_token_driver'
              );
            }}
          >
            <Text style={styles.devBtnText}>Driver View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.devBtn, { backgroundColor: '#7c3aed' }]}
            onPress={() => {
              login(
                { _id: 'owner_dev', name: 'Dev Owner', email: 'owner@dev.com', role: 'owner' },
                'mock_token_owner'
              );
            }}
          >
            <Text style={styles.devBtnText}>Owner View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background
    justifyContent: 'center',
    padding: 24
  },
  header: {
    alignItems: 'center',
    marginBottom: 48
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937', // Dark gray text
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280' // Medium gray text
  },
  form: {
    gap: 16
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
    elevation: 2
  },
  button: {
    backgroundColor: '#1F2937', // Dark primary button
    borderRadius: 16,
    padding: 18, // Slightly taller
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  },
  hint: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 24,
    fontSize: 12
  },
  devContainer: {
    marginTop: 40,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed'
  },
  devTitle: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600'
  },
  devBtnRow: {
    flexDirection: 'row',
    gap: 12
  },
  devBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2
  },
  devBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14
  }
});

export default LoginScreen;
