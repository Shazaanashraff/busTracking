import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import DriverNavigator from './DriverNavigator';
import OwnerNavigator from './OwnerNavigator';
import QRScannerScreen from '../screens/QRScannerScreen';
import BusDetailsScreen from '../screens/BusDetailsScreen';
import DriverManagementScreen from '../screens/DriverManagementScreen';
import ReportsScreen from '../screens/ReportsScreen';

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
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : user.role === 'owner' ? (
        <>
          <Stack.Screen
            name="OwnerApp"
            component={OwnerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BusDetails"
            component={BusDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DriverManagement"
            component={DriverManagementScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Reports"
            component={ReportsScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name="DriverApp"
          component={DriverNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
