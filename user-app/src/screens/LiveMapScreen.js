import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { connectSocket, joinRoute, leaveRoute, onBusUpdate, offBusUpdate, disconnectSocket } from '../services/socket';

const LiveMapScreen = ({ route }) => {
  const { routeId } = route.params;
  const [busLocations, setBusLocations] = useState({});
  const [connected, setConnected] = useState(false);
  const animatedValues = useRef({});

  // Default region (can be updated based on first bus location)
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  });

  useEffect(() => {
    // Connect to socket and join route
    const socket = connectSocket();
    
    socket.on('connect', () => {
      setConnected(true);
      joinRoute(routeId);
    });

    socket.on('joined-route', (data) => {
      console.log('Joined route:', data);
    });

    // Listen for bus updates
    onBusUpdate((data) => {
      const { busId, lat, lng, timestamp } = data;
      
      // Animate marker movement
      if (!animatedValues.current[busId]) {
        animatedValues.current[busId] = {
          latitude: new Animated.Value(lat),
          longitude: new Animated.Value(lng)
        };
      } else {
        // Smooth animation to new position
        Animated.parallel([
          Animated.timing(animatedValues.current[busId].latitude, {
            toValue: lat,
            duration: 1000,
            useNativeDriver: false
          }),
          Animated.timing(animatedValues.current[busId].longitude, {
            toValue: lng,
            duration: 1000,
            useNativeDriver: false
          })
        ]).start();
      }

      setBusLocations(prev => ({
        ...prev,
        [busId]: { lat, lng, timestamp, busId }
      }));

      // Center map on first bus received
      if (Object.keys(busLocations).length === 0) {
        setRegion(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));
      }
    });

    return () => {
      leaveRoute(routeId);
      offBusUpdate();
    };
  }, [routeId]);

  const buses = Object.values(busLocations);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.routeLabel}>Route: {routeId}</Text>
        <View style={[styles.statusDot, connected && styles.statusConnected]} />
        <Text style={styles.statusText}>
          {connected ? 'Live' : 'Connecting...'}
        </Text>
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {buses.map((bus) => (
          <Marker
            key={bus.busId}
            coordinate={{ latitude: bus.lat, longitude: bus.lng }}
            title={bus.busId}
            description={`Last update: ${new Date(bus.timestamp).toLocaleTimeString()}`}
          >
            <View style={styles.busMarker}>
              <Text style={styles.busEmoji}>🚌</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.busCount}>
          {buses.length} {buses.length === 1 ? 'bus' : 'buses'} active
        </Text>
        {buses.length === 0 && (
          <Text style={styles.waitingText}>
            Waiting for bus location updates...
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1e293b'
  },
  routeLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
    marginRight: 6
  },
  statusConnected: {
    backgroundColor: '#22c55e'
  },
  statusText: {
    color: '#94a3b8',
    fontSize: 12
  },
  map: {
    flex: 1
  },
  busMarker: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff'
  },
  busEmoji: {
    fontSize: 20
  },
  footer: {
    backgroundColor: '#1e293b',
    padding: 16,
    alignItems: 'center'
  },
  busCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  waitingText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4
  }
});

export default LiveMapScreen;
