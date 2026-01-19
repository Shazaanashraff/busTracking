import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const LiveMapScreen = ({ route, navigation }) => {
  const { routeId, busId, directTrack } = route.params || {};
  const mapRef = useRef(null);

  // Mock data
  const [busLocation, setBusLocation] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const busDetails = {
    plate: busId || 'ND-4567',
    route: routeId || '138',
    speed: '45 km/h',
    nextHalt: 'Town Hall',
    eta: '10 mins',
    crowd: 'High',
    status: 'On Time'
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Platform specific Map View or Fallback */}
      {Platform.OS === 'web' ? (
        <View style={styles.webMapFallback}>
          <Feather name="map" size={64} color="#D1D5DB" />
          <Text style={styles.webFallbackText}>Map View is not available on Web</Text>
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={busLocation}
        >
          <Marker coordinate={busLocation}>
            <View style={styles.busMarker}>
              <Ionicons name="bus" size={20} color="#FFF" />
            </View>
          </Marker>
        </MapView>
      )}

      {/* Floating Header */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.routeText}>Route {busDetails.route}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Live</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Detail Card Overlay */}
      <View style={styles.bottomCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.busPlate}>{busDetails.plate}</Text>
            <Text style={styles.busStatus}>{busDetails.status} • {busDetails.speed}</Text>
          </View>
          <View style={styles.etaBox}>
            <Text style={styles.etaLabel}>ETA</Text>
            <Text style={styles.etaValue}>{busDetails.eta}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="bus-stop" size={24} color="#4B5563" />
            <View>
              <Text style={styles.statLabel}>Next Halt</Text>
              <Text style={styles.statValue}>{busDetails.nextHalt}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people" size={24} color="#4B5563" />
            <View>
              <Text style={styles.statLabel}>Crowd</Text>
              <Text style={styles.statValue}>{busDetails.crowd}</Text>
            </View>
          </View>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6'
  },
  webFallbackText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  headerInfo: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  routeText: { fontWeight: '800', color: '#1F2937' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  statusText: { fontSize: 12, color: '#22C55E', fontWeight: '700' },

  busMarker: {
    backgroundColor: '#FCD24A',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  bottomCard: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  busPlate: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
  busStatus: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  etaBox: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  etaLabel: { color: '#9CA3AF', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  etaValue: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 12, color: '#9CA3AF' },
  statValue: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
});

export default LiveMapScreen;
