import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { connectSocket, joinRoute, leaveRoute, onBusUpdate, offBusUpdate, disconnectSocket } from '../services/socket';

// Conditionally import MapView to prevent crashes in Expo Go
let MapView, Marker;
try {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
} catch (e) {
  console.log('react-native-maps not available, using fallback');
}

const { width } = Dimensions.get('window');

const LiveMapScreen = ({ route, navigation }) => {
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
    // Mock socket connection and data
    setConnected(true);

    // Simulate bus updates
    const interval = setInterval(() => {
      const mockBuses = [
        { busId: 'Bus-101', lat: 28.6139 + (Math.random() * 0.002 - 0.001), lng: 77.2090 + (Math.random() * 0.002 - 0.001) },
        { busId: 'Bus-102', lat: 28.6200 + (Math.random() * 0.002 - 0.001), lng: 77.2100 + (Math.random() * 0.002 - 0.001) },
        { busId: 'Bus-103', lat: 28.6100 + (Math.random() * 0.002 - 0.001), lng: 77.2000 + (Math.random() * 0.002 - 0.001) }
      ];

      mockBuses.forEach(bus => {
        const { busId, lat, lng } = bus;
        const timestamp = Date.now();

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
      });

      // Center map on first update if needed
      setBusLocations(prev => {
        if (Object.keys(prev).length === 0 && mockBuses.length > 0) {
          setRegion(curr => ({
            ...curr,
            latitude: mockBuses[0].lat,
            longitude: mockBuses[0].lng
          }));
        }
        return prev;
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [routeId]);

  const buses = Object.values(busLocations);

  // Fallback UI when MapView is not available (Expo Go)
  const renderFallbackMap = () => (
    <View style={styles.fallbackMap}>
      <Text style={styles.fallbackTitle}>📍 Tracking {buses.length} Buses</Text>
      <Text style={styles.fallbackSubtitle}>
        Map view requires a development build.
      </Text>
      {buses.length > 0 ? (
        <View style={styles.busList}>
          {buses.map((bus) => (
            <View key={bus.busId} style={styles.busItem}>
              <View style={styles.busItemIconContainer}>
                <Text style={styles.busItemIcon}>🚌</Text>
              </View>
              <View style={styles.busItemInfo}>
                <Text style={styles.busItemId}>{bus.busId}</Text>
                <Text style={styles.busItemCoords}>
                  Inside City Limits
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>Active</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.fallbackWaiting}>
          Connecting to fleet...
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{routeId || 'Live Map'}</Text>
          <View style={styles.liveBadge}>
            <View style={[styles.statusDot, connected && styles.statusConnected]} />
            <Text style={styles.statusText}>{connected ? 'LIVE' : 'CONNECTING'}</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mapContainer}>
        {MapView ? (
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            customMapStyle={[
              {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#747474" }]
              }
            ]}
          >
            {buses.map((bus) => (
              <Marker
                key={bus.busId}
                coordinate={{ latitude: bus.lat, longitude: bus.lng }}
                title={bus.busId}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.markerPin}>
                    <Text style={styles.markerIcon}>🚌</Text>
                  </View>
                  <View style={styles.markerSeeThrough} />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          renderFallbackMap()
        )}
      </View>

      {/* Floating Bottom Card */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Trip Details</Text>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Active Buses</Text>
            <Text style={styles.statValue}>{buses.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Est. Arrival</Text>
            <Text style={styles.statValue}>5 min</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>1.2 km</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Refresh Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCD24A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FCD24A',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  backIcon: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  statusConnected: {
    backgroundColor: '#059669',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    marginTop: -10,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerPin: {
    width: 44,
    height: 44,
    backgroundColor: '#FCD24A',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 20,
  },
  // Fallback styles
  fallbackMap: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 24,
    alignItems: 'center',
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 20,
  },
  fallbackSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  busList: {
    width: '100%',
  },
  busItem: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  busItemIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  busItemIcon: {
    fontSize: 24,
  },
  busItemInfo: {
    flex: 1,
  },
  busItemId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  busItemCoords: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  // Bottom Sheet Style
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
  },
  actionButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LiveMapScreen;
