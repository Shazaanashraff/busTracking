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

import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SavedRoutesScreen from '../screens/SavedRoutesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SupportScreen from '../screens/SupportScreen';
import TermsScreen from '../screens/TermsScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import PaymentFailureScreen from '../screens/PaymentFailureScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

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
      initialRouteName="Onboarding"
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />

      {/* Auth */}
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* Main */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Feature Screens */}
      <Stack.Screen name="RouteBuses" component={RouteBusesScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
      <Stack.Screen name="PassengerDetails" component={PassengerDetailsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />

      {/* Payment Status */}
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="PaymentFailure" component={PaymentFailureScreen} />

      <Stack.Screen name="Ticket" component={TicketScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />

      {/* Profile & Settings */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="SavedRoutes" component={SavedRoutesScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />

      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="TrackByBus" component={TrackByBusScreen} />

      {/* Existing Screens (Recycled) */}
      <Stack.Screen name="LiveMap" component={LiveMapScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
