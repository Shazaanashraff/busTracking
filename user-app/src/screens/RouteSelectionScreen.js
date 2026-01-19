import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RouteSelectionScreen = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await api.getRoutes();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = (routeId) => {
    navigation.navigate('LiveMap', { routeId });
  };

  const renderRoute = ({ item }) => (
    <TouchableOpacity
      style={styles.routeCard}
      onPress={() => handleSelectRoute(item)}
    >
      <View style={styles.routeIcon}>
        <Text style={styles.routeIconText}>🚌</Text>
      </View>
      <View style={styles.routeInfo}>
        <Text style={styles.routeId}>{item}</Text>
        <Text style={styles.routeDescription}>Tap to view live buses</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}!</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Select a Route</Text>  
      <Text style={styles.subtitle}>
        Choose a bus route to track in real-time
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
      ) : routes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No routes available</Text>
          <Text style={styles.emptySubtext}>Run the seed script to add sample data</Text>
        </View>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item) => item}
          renderItem={renderRoute}
          contentContainerStyle={styles.list}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b'
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  logout: {
    color: '#f87171',
    fontSize: 14
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  list: {
    padding: 16
  },
  routeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  routeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center'
  },
  routeIconText: {
    fontSize: 24
  },
  routeInfo: {
    flex: 1,
    marginLeft: 16
  },
  routeId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff'
  },
  routeDescription: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2
  },
  arrow: {
    fontSize: 20,
    color: '#64748b'
  },
  loader: {
    marginTop: 48
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18,
    color: '#94a3b8'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8
  }
});

export default RouteSelectionScreen;
