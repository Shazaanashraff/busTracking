import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import LiveMapScreen from '../screens/LiveMapScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import HomeScreen from '../screens/HomeScreen';
import RouteBusesScreen from '../screens/RouteBusesScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import PassengerDetailsScreen from '../screens/PassengerDetailsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import TicketScreen from '../screens/TicketScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import TrackByBusScreen from '../screens/TrackByBusScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FCD24A' }
      }}
      initialRouteName="LanguageSelect"
    >
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Feature Screens */}
      <Stack.Screen name="RouteBuses" component={RouteBusesScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
      <Stack.Screen name="PassengerDetails" component={PassengerDetailsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Ticket" component={TicketScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="TrackByBus" component={TrackByBusScreen} />

      {/* Existing Screens (Recycled) */}
      <Stack.Screen name="LiveMap" component={LiveMapScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
