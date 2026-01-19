import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { connectSocket, emitLocation, stopTracking, disconnectSocket } from '../services/socket';

const DriverDashboard = () => {
  const { user, token, logout } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [bus, setBus] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    loadBusInfo();
    connectSocket();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      disconnectSocket();
    };
  }, []);

  const loadBusInfo = async () => {
    try {
      const busData = await api.getMyBus(token);
      setBus(busData);
    } catch (error) {
      Alert.alert('Info', 'No bus assigned. Contact admin to assign a bus.');
    }
  };

  const startTracking = async () => {
    if (!bus) {
      Alert.alert('Error', 'No bus assigned to you');
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }

    setIsTracking(true);

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 3
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        emitLocation(bus.busId, bus.routeId, latitude, longitude);
      }
    );
  };

  const handleStopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    if (bus) {
      stopTracking(bus.busId);
    }
    setIsTracking(false);
    setCurrentLocation(null);
  };

  const handleLogout = () => {
    handleStopTracking();
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.greeting}>Hello, {user?.name}!</Text>
        {bus ? (
          <View style={styles.busInfo}>
            <Text style={styles.busId}>🚌 {bus.busName}</Text>
            <Text style={styles.route}>Route: {bus.routeId}</Text>
          </View>
        ) : (
          <Text style={styles.noBus}>No bus assigned</Text>
        )}
      </View>

      <View style={styles.statusCard}>
        <View style={[styles.statusDot, isTracking && styles.statusDotActive]} />
        <Text style={styles.statusText}>
          {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
        </Text>
      </View>

      {currentLocation && (
        <View style={styles.locationCard}>
          <Text style={styles.locationLabel}>Current Location</Text>
          <Text style={styles.locationText}>
            Lat: {currentLocation.lat.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Lng: {currentLocation.lng.toFixed(6)}
          </Text>
        </View>
      )}

      <View style={styles.buttons}>
        {!isTracking ? (
          <TouchableOpacity 
            style={[styles.button, styles.startButton]}
            onPress={startTracking}
            disabled={!bus}
          >
            <Text style={styles.buttonText}>▶ Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.stopButton]}
            onPress={handleStopTracking}
          >
            <Text style={styles.buttonText}>⏹ Stop Tracking</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  busInfo: {
    gap: 4
  },
  busId: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '600'
  },
  route: {
    fontSize: 14,
    color: '#94a3b8'
  },
  noBus: {
    color: '#f87171',
    fontSize: 14
  },
  statusCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#64748b',
    marginRight: 12
  },
  statusDotActive: {
    backgroundColor: '#22c55e'
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500'
  },
  locationCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16
  },
  locationLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  buttons: {
    marginTop: 'auto',
    gap: 12
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  startButton: {
    backgroundColor: '#22c55e'
  },
  stopButton: {
    backgroundColor: '#ef4444'
  },
  logoutButton: {
    backgroundColor: '#475569'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});

export default DriverDashboard;
