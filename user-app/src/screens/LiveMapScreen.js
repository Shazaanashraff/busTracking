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
  const { routeId, busId: initialBusId, directTrack } = route.params;
  const [busLocations, setBusLocations] = useState({});
  const [connected, setConnected] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null); // Track selected bus for details
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
      // Mock data for specific buses
      const mockBuses = [
        {
          busId: 'ND-4567',
          lat: 28.6139 + (Math.random() * 0.002 - 0.001),
          lng: 77.2090 + (Math.random() * 0.002 - 0.001),
          speed: '45 km/h',
          stage: 'Kiribathgoda',
          nextStage: 'Kelaniya',
          eta: '10 min',
          crowd: 'medium'
        },
        {
          busId: 'NC-1234',
          lat: 28.6200 + (Math.random() * 0.002 - 0.001),
          lng: 77.2100 + (Math.random() * 0.002 - 0.001),
          speed: '30 km/h',
          stage: 'Mahara',
          nextStage: 'Ragama',
          eta: '5 min',
          crowd: 'low'
        },
        {
          busId: 'NB-9876',
          lat: 28.6100 + (Math.random() * 0.002 - 0.001),
          lng: 77.2000 + (Math.random() * 0.002 - 0.001),
          speed: '60 km/h',
          stage: 'Kadawatha',
          nextStage: 'Kandy Turn',
          eta: '15 min',
          crowd: 'high'
        }
      ];

      // If direct tracking, filter only that bus
      const busesToUpdate = directTrack
        ? mockBuses.filter(b => b.busId === initialBusId)
        : mockBuses;

      busesToUpdate.forEach(bus => {
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
          [busId]: { ...bus, timestamp }
        }));
      });

      // Select the first bus automatically if none selected or if direct tracking
      if (!selectedBus && busesToUpdate.length > 0) {
        setSelectedBus(busesToUpdate[0]);
      } else if (selectedBus) {
        // Update selected bus data
        const updated = busesToUpdate.find(b => b.busId === selectedBus.busId);
        if (updated) setSelectedBus(updated);
      }

      // Center map on first update if needed
      setBusLocations(prev => {
        if (Object.keys(prev).length === 0 && busesToUpdate.length > 0) {
          setRegion(curr => ({
            ...curr,
            latitude: busesToUpdate[0].lat,
            longitude: busesToUpdate[0].lng
          }));
        }
        return prev;
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [routeId, directTrack, initialBusId, selectedBus]);

  const buses = Object.values(busLocations);
  const activeBus = selectedBus || buses[0];

  const getCrowdColor = (level) => {
    switch (level) {
      case 'low': return '#22C55E';
      case 'medium': return '#EAB308';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Fallback UI when MapView is not available (Expo Go)
  const renderFallbackMap = () => (
    <View style={styles.fallbackMap}>
      <Text style={styles.fallbackTitle}>📍 Tracking {directTrack ? activeBus?.busId : `${buses.length} Buses`}</Text>
      <Text style={styles.fallbackSubtitle}>
        Map view requires a development build.
      </Text>
      {buses.length > 0 ? (
        <View style={styles.busList}>
          {buses.map((bus) => (
            <TouchableOpacity
              key={bus.busId}
              style={[styles.busItem, selectedBus?.busId === bus.busId && styles.selectedBusItem]}
              onPress={() => setSelectedBus(bus)}
            >
              <View style={styles.busItemIconContainer}>
                <Text style={styles.busItemIcon}>🚌</Text>
              </View>
              <View style={styles.busItemInfo}>
                <Text style={styles.busItemId}>{bus.busId}</Text>
                <Text style={styles.busItemStage}>Current: {bus.stage}</Text>
                <View style={styles.statusBadge}>
                  <Text style={[styles.statusBadgeText, { color: getCrowdColor(bus.crowd) }]}>
                    {bus.crowd?.toUpperCase()} CROWD
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
          <Text style={styles.headerTitle}>{directTrack ? initialBusId : `Route ${routeId}`}</Text>
          <View style={styles.liveBadge}>
            <View style={[styles.statusDot, connected && styles.statusConnected]} />
            <Text style={styles.statusText}>{connected ? 'LIVE TRACKING' : 'CONNECTING'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => { }}>
          <Text style={styles.backIcon}>🔔</Text>
        </TouchableOpacity>
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
                onPress={() => setSelectedBus(bus)}
              >
                <View style={styles.markerContainer}>
                  <View style={[styles.markerPin, selectedBus?.busId === bus.busId && styles.selectedMarker]}>
                    <Text style={styles.markerIcon}>🚌</Text>
                  </View>
                  <View style={styles.markerArrow} />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          renderFallbackMap()
        )}
      </View>

      {/* Sri Lankan Style Bottom Sheet */}
      {activeBus && (
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{activeBus.busId}</Text>
              <Text style={styles.sheetSubtitle}>Route {routeId} • Normal Service</Text>
            </View>
            <View style={styles.speedBadge}>
              <Text style={styles.speedText}>{activeBus.speed}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Current Stage</Text>
              <Text style={styles.infoValue}>{activeBus.stage}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Next Stage</Text>
              <Text style={styles.infoValue}>{activeBus.nextStage}</Text>
              <Text style={styles.etaValue}>~ {activeBus.eta}</Text>
            </View>
          </View>

          <View style={styles.crowdBar}>
            <Text style={styles.crowdLabel}>Crowd Level</Text>
            <View style={styles.crowdIndicators}>
              <View style={[styles.crowdDotIndicator, { backgroundColor: getCrowdColor('low'), opacity: activeBus.crowd === 'low' ? 1 : 0.3 }]} />
              <View style={[styles.crowdDotIndicator, { backgroundColor: getCrowdColor('medium'), opacity: activeBus.crowd === 'medium' ? 1 : 0.3 }]} />
              <View style={[styles.crowdDotIndicator, { backgroundColor: getCrowdColor('high'), opacity: activeBus.crowd === 'high' ? 1 : 0.3 }]} />
            </View>
            <Text style={[styles.crowdText, { color: getCrowdColor(activeBus.crowd) }]}>
              {activeBus.crowd?.toUpperCase()}
            </Text>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Get Off Alerts 🔔</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontWeight: '800',
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
  selectedMarker: {
    backgroundColor: '#1F2937',
    borderColor: '#FCD24A',
    transform: [{ scale: 1.1 }],
  },
  markerIcon: {
    fontSize: 20,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFF',
    marginTop: -2,
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBusItem: {
    borderColor: '#FCD24A',
    backgroundColor: '#FFFBEB',
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
  busItemStage: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  fallbackWaiting: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 20,
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
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  speedBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  speedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
  },
  infoLabel: {
    fontSize: 10,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  etaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },
  crowdBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
  },
  crowdLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  crowdIndicators: {
    flexDirection: 'row',
    gap: 6,
  },
  crowdDotIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  crowdText: {
    fontSize: 12,
    fontWeight: '800',
    width: 60,
    textAlign: 'right',
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
