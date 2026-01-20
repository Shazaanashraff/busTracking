import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { connectSocket, emitLocation, stopTracking, disconnectSocket } from '../services/socket';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const DriverDashboard = ({ navigation }) => {
  const { user, token, logout } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [bus, setBus] = useState(null);
  const [stats, setStats] = useState({
    tripsToday: 0,
    bookings: 0,
    totalPassengers: 0,
    bookedSeats: []
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [crowdLevel, setCrowdLevel] = useState('Medium');
  const [refreshing, setRefreshing] = useState(false);
  const locationSubscription = useRef(null);

  useEffect(() => {
    loadData();
    connectSocket();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      disconnectSocket();
    };
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const busData = await api.getMyBus(token);
      setBus(busData);

      const dashboardStats = await api.getDashboardStats(token);
      setStats(dashboardStats);
    } catch (error) {
      console.log('Error loading data:', error);
      // Alert.alert('Info', 'Could not load updated stats.');
    } finally {
      setRefreshing(false);
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
        distanceInterval: 5
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

  const handleUpdateCrowd = async (level) => {
    setCrowdLevel(level);
    // await api.updateCrowdLevel(token, level); // Optimistic update
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout", onPress: () => {
          handleStopTracking();
          logout();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome,</Text>
          <Text style={styles.headerName}>{user?.name || 'Driver'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor="#FFF" />}
      >
        {/* Bus Info Card */}
        <View style={styles.busCard}>
          <View style={styles.busIconCircle}>
            <Ionicons name="bus" size={28} color="#1e3a8a" />
          </View>
          <View style={styles.busCardContent}>
            {bus ? (
              <>
                <Text style={styles.busRoute}>Route {bus.routeId}</Text>
                <Text style={styles.busPlate}>{bus.busName}</Text>
                <View style={styles.busRouteRow}>
                  <Text style={styles.routeText}>{bus.routeStart}</Text>
                  <Ionicons name="arrow-forward" size={14} color="#64748b" />
                  <Text style={styles.routeText}>{bus.routeEnd}</Text>
                </View>
              </>
            ) : (
              <Text style={styles.noBusText}>No bus assigned</Text>
            )}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Today's Trips</Text>
            <Text style={styles.statValue}>{stats.tripsToday}</Text>
            <MaterialCommunityIcons name="steering" size={20} color="#3b82f6" style={styles.statIcon} />
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Bookings</Text>
            <Text style={styles.statValue}>{stats.bookings}</Text>
            <Ionicons name="ticket-outline" size={20} color="#8b5cf6" style={styles.statIcon} />
          </View>
          <View style={[styles.statCard, { flexBasis: '100%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={styles.statLabel}>Total Passengers</Text>
                <Text style={styles.statValue}>{stats.totalPassengers}</Text>
              </View>
              <Ionicons name="people-outline" size={32} color="#10b981" style={{ opacity: 0.8 }} />
            </View>
          </View>
        </View>

        {/* Seat Numbers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Booked Seats</Text>
          <Text style={styles.countBadge}>{stats.bookedSeats.length}</Text>
        </View>
        <View style={styles.seatsContainer}>
          {stats.bookedSeats.length > 0 ? (
            stats.bookedSeats.map((seat, index) => (
              <View key={index} style={styles.seatBadge}>
                <Text style={styles.seatText}>{seat}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No seats booked yet.</Text>
          )}
        </View>

        {/* Ticket Scanner */}
        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => navigation.navigate('QRScanner')}
          activeOpacity={0.9}
        >
          <Ionicons name="qr-code-outline" size={24} color="#FFF" />
          <Text style={styles.scanBtnText}>Scan Ticket QR</Text>
        </TouchableOpacity>


        {/* Crowd Level Control */}
        <Text style={styles.sectionTitle}>Update Crowd Level</Text>
        <View style={styles.crowdControl}>
          <TouchableOpacity
            style={[styles.crowdBtn, crowdLevel === 'Low' && styles.crowdBtnActive, { borderColor: '#22c55e' }]}
            onPress={() => handleUpdateCrowd('Low')}
          >
            <View style={[styles.dot, { backgroundColor: '#22c55e' }]} />
            <Text style={[styles.crowdBtnText, crowdLevel === 'Low' && styles.crowdBtnTextActive]}>Low</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.crowdBtn, crowdLevel === 'Medium' && styles.crowdBtnActive, { borderColor: '#eab308' }]}
            onPress={() => handleUpdateCrowd('Medium')}
          >
            <View style={[styles.dot, { backgroundColor: '#eab308' }]} />
            <Text style={[styles.crowdBtnText, crowdLevel === 'Medium' && styles.crowdBtnTextActive]}>Med</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.crowdBtn, crowdLevel === 'High' && styles.crowdBtnActive, { borderColor: '#ef4444' }]}
            onPress={() => handleUpdateCrowd('High')}
          >
            <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
            <Text style={[styles.crowdBtnText, crowdLevel === 'High' && styles.crowdBtnTextActive]}>High</Text>
          </TouchableOpacity>
        </View>


        {/* Tracking Control (Moved to bottom for easy access) */}
        <View style={styles.trackerContainer}>
          {isTracking ? (
            <View style={styles.trackingActiveBox}>
              <Text style={styles.trackingStatusText}>Tracking is Active</Text>
              <TouchableOpacity style={styles.stopTrackingBtn} onPress={handleStopTracking}>
                <Text style={styles.stopTrackingText}>Stop Tracking</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.startTrackingBtn, !bus && { opacity: 0.5 }]}
              onPress={startTracking}
              disabled={!bus}
            >
              <Ionicons name="navigate-circle-outline" size={28} color="#FFF" />
              <Text style={styles.startTrackingText}>Start Journey & Track</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F3F4F6', // Match background
  },
  headerGreeting: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  headerName: { color: '#1F2937', fontSize: 24, fontWeight: '800' },
  logoutBtn: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2
  },
  scrollContent: { padding: 20, paddingBottom: 40 },
  busCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  busIconCircle: {
    width: 50,
    height: 50,
    backgroundColor: '#EFF6FF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  busCardContent: { flex: 1 },
  busRoute: { color: '#6B7280', fontSize: 13, textTransform: 'uppercase', fontWeight: '700' },
  busPlate: { color: '#1F2937', fontSize: 22, fontWeight: '800' },
  busRouteRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  routeText: { color: '#4B5563', fontSize: 14, fontWeight: '500' },
  noBusText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: { color: '#6B7280', fontSize: 12, marginBottom: 4, fontWeight: '600' },
  statValue: { color: '#1F2937', fontSize: 24, fontWeight: '800' },
  statIcon: { position: 'absolute', top: 16, right: 16, opacity: 0.2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  sectionTitle: { color: '#1F2937', fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 12 },
  countBadge: { backgroundColor: '#3B82F6', color: '#FFF', paddingHorizontal: 10, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden', paddingVertical: 4 },
  seatsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  seatBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatText: { color: '#1D4ED8', fontWeight: '700', fontSize: 13 },
  noDataText: { color: '#9CA3AF', fontStyle: 'italic' },
  scanBtn: {
    backgroundColor: '#1F2937', // Dark button
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginBottom: 24,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  scanBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  crowdControl: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  crowdBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FFF',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
    borderColor: '#E5E7EB',
  },
  crowdBtnActive: {
    backgroundColor: '#F3F4F6', // Slight highlight
    borderWidth: 2,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  crowdBtnText: { color: '#4B5563', fontWeight: '600' },
  crowdBtnTextActive: { color: '#1F2937', fontWeight: '800' },
  trackerContainer: {
    marginBottom: 20,
  },
  startTrackingBtn: {
    backgroundColor: '#059669', // Emerald
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  startTrackingText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  trackingActiveBox: {
    backgroundColor: '#059669',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  trackingStatusText: { color: '#FFF', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  stopTrackingBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  stopTrackingText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});

export default DriverDashboard;
