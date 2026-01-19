import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Image,
  Dimensions
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const { width } = Dimensions.get('window');

const RouteSelectionScreen = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      // Mock data for UI testing
      const mockRoutes = [
        { id: 'Route 101', name: 'Downtown Express', time: '10 min', price: '$2.50' },
        { id: 'Route 202', name: 'Airport Shuttle', time: '15 min', price: '$5.00' },
        { id: 'Route 303', name: 'City Loop', time: '5 min', price: '$1.50' },
        { id: 'Route 404', name: 'Suburb Connector', time: '20 min', price: '$3.00' },
        { id: 'Route 505', name: 'Night Owl', time: '8 min', price: '$2.00' }
      ];
      setRoutes(mockRoutes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setLoading(false);
    }
  };

  const handleSelectRoute = (routeId) => {
    navigation.navigate('LiveMap', { routeId });
  };

  const renderRoute = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelectRoute(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.cardIconContainer}>
        <Text style={styles.cardIcon}>🚌</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.id}</Text>
        <Text style={styles.cardSubtitle}>{item.name}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>⏱ {item.time}</Text>
          </View>
          <View style={[styles.tag, styles.priceTag]}>
            <Text style={[styles.tagText, styles.priceText]}>{item.price}</Text>
          </View>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCD24A" />

      {/* Decorative Background Elements */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}</Text>
          <Text style={styles.headerTitle}>Where to today?</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Available Routes</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#1F2937" style={styles.loader} />
        ) : (
          <FlatList
            data={routes}
            keyExtractor={(item) => item.id}
            renderItem={renderRoute}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCD24A', // Vibrant Yellow/Mustard
  },
  circle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  circle2: {
    position: 'absolute',
    top: 100,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#4B3621',
    fontWeight: '600',
    opacity: 0.8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray for content area
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  priceTag: {
    backgroundColor: '#ECFDF5',
  },
  tagText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  priceText: {
    color: '#059669',
  },
  arrowContainer: {
    marginLeft: 12,
  },
  arrow: {
    fontSize: 20,
    color: '#D1D5DB',
  },
  loader: {
    marginTop: 40,
  },
});

export default RouteSelectionScreen;
