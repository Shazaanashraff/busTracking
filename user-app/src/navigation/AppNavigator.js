import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RouteSelectionScreen from '../screens/RouteSelectionScreen';
import LiveMapScreen from '../screens/LiveMapScreen';

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
      ) : (
        <>
          <Stack.Screen 
            name="SelectRoute" 
            component={RouteSelectionScreen}
            options={{ title: 'Select Route' }}
          />
          <Stack.Screen 
            name="LiveMap" 
            component={LiveMapScreen}
            options={{ title: 'Live Bus Tracking' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
