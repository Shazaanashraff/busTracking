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
  SafeAreaView,
  Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { connectSocket, emitLocation, stopTracking, disconnectSocket } from '../services/socket';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BRAND_GREEN = '#10B981';

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
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => { handleStopTracking(); logout(); } }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.nameHeader}>{user?.name || 'Driver'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="power" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor={BRAND_GREEN} />}
        showsVerticalScrollIndicator={false}
      >

        {/* BUS CARD */}
        <View style={styles.busCard}>
          <View style={styles.busCardLeft}>
            <View style={styles.busIconCircle}>
              <MaterialCommunityIcons name="bus-side" size={24} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.busCardRight}>
            {bus ? (
              <>
                <Text style={styles.busPlate}>{bus.busName}</Text>
                <Text style={styles.busRoute}>Route {bus.routeId}</Text>
                <View style={styles.routeRow}>
                  <Text style={styles.routeLoc}>{bus.routeStart}</Text>
                  <Feather name="arrow-right" size={14} color="#9CA3AF" />
                  <Text style={styles.routeLoc}>{bus.routeEnd}</Text>
                </View>
              </>
            ) : (
              <Text style={styles.noBusText}>No Bus Assigned</Text>
            )}
          </View>
        </View>

        {/* METRICS ROW */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{stats.tripsToday}</Text>
            <Text style={styles.metricLabel}>Trips</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{stats.bookings}</Text>
            <Text style={styles.metricLabel}>Bookings</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{stats.totalPassengers}</Text>
            <Text style={styles.metricLabel}>Passengers</Text>
          </View>
        </View>

        {/* ACTION GRID */}
        <Text style={styles.sectionTitle}>Main Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#111827' }]} // Black like FareGO button
            onPress={() => navigation.navigate('QRScanner')}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={28} color="#FFF" />
            <Text style={[styles.actionText, { color: '#FFF' }]}>Scan Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('TripHistory')} // Assuming this exists or placeholder
          >
            <Feather name="list" size={28} color="#111827" />
            <Text style={styles.actionText}>Trip List</Text>
          </TouchableOpacity>
        </View>

        {/* SEATS SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Booked Seats</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{stats.bookedSeats.length}</Text>
          </View>
        </View>

        <View style={styles.seatsContainer}>
          {stats.bookedSeats.length > 0 ? (
            stats.bookedSeats.map((seat, i) => (
              <View key={i} style={styles.seatBadge}>
                <Text style={styles.seatText}>{seat}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyStateText}>No active bookings</Text>
          )}
        </View>

        {/* CROWD LEVEL */}
        <Text style={styles.sectionTitle}>Current Crowd</Text>
        <View style={styles.crowdRow}>
          {['Low', 'Medium', 'High'].map((level) => {
            const isActive = crowdLevel === level;
            let color = '#10B981'; // Green
            if (level === 'Medium') color = '#F59E0B';
            if (level === 'High') color = '#EF4444';

            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.crowdPill,
                  isActive && { backgroundColor: color, borderColor: color }
                ]}
                onPress={() => handleUpdateCrowd(level)}
              >
                <Text style={[
                  styles.crowdText,
                  isActive ? { color: '#FFF' } : { color: '#6B7280' }
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} /> {/* Spacing for floating button */}

      </ScrollView>

      {/* FLOATING ACTION BUTTON FOR TRACKING */}
      <View style={styles.floatContainer}>
        {isTracking ? (
          <TouchableOpacity style={styles.stopBtn} onPress={handleStopTracking}>
            <Text style={styles.stopText}>Stop Journey</Text>
            <View style={styles.pulseDot} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.startBtn, !bus && { opacity: 0.8 }]}
            onPress={startTracking}
            disabled={!bus}
          >
            <Text style={styles.startText}>Start Journey</Text>
            <Feather name="navigation" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  greeting: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  nameHeader: { color: '#111827', fontSize: 24, fontWeight: 'bold' },
  logoutBtn: {
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // BUS CARD
  busCard: {
    backgroundColor: '#111827', // Dark Card
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    elevation: 8,
  },
  busCardLeft: {
    marginRight: 16,
  },
  busIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busCardRight: { flex: 1 },
  busPlate: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  busRoute: { color: BRAND_GREEN, fontSize: 14, fontWeight: '700', marginTop: 2, marginBottom: 8 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeLoc: { color: '#D1D5DB', fontSize: 13 },
  noBusText: { color: '#F87171', fontWeight: 'bold' },

  // METRICS
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  metricItem: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  metricLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  verticalDivider: { width: 1, height: '80%', backgroundColor: '#E5E7EB' },

  // ACTIONS
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 20,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12 },

  // SEATS
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' },
  countBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  countText: { color: '#3B82F6', fontWeight: '700' },
  seatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  seatBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  seatText: { color: '#065F46', fontWeight: '700' },
  emptyStateText: { color: '#9CA3AF', fontStyle: 'italic' },

  // CROWD
  crowdRow: { flexDirection: 'row', gap: 12 },
  crowdPill: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  crowdText: { fontWeight: '600' },

  // FLOATING BUTTON
  floatContainer: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  startBtn: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 30,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    elevation: 8,
  },
  startText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  stopBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 30,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    elevation: 8,
  },
  stopText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  }
});

export default DriverDashboard;
