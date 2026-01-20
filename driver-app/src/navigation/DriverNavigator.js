import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import TripScreen from '../screens/TripScreen';
import DriverBookingsScreen from '../screens/DriverBookingsScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import DriverProfileScreen from '../screens/DriverProfileScreen';

const Tab = createBottomTabNavigator();

const DriverNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    height: 70,
                    position: 'absolute',
                    bottom: 20,
                    marginHorizontal: 20,
                    borderRadius: 25,
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderWidth: 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 10,
                },
                tabBarActiveTintColor: '#1F2937', // Dark Gray
                tabBarInactiveTintColor: '#9CA3AF', // Light Gray
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginBottom: 4
                }
            }}
        >
            <Tab.Screen
                name="Trip"
                component={TripScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="navigate-circle-outline" size={28} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Bookings"
                component={DriverBookingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={24} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Scan"
                component={QRScannerScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="qr-code-outline" size={24} color={color} />
                    ),
                    tabBarStyle: { display: 'none' } // Hide tab bar when scanning
                }}
            />

            <Tab.Screen
                name="Profile"
                component={DriverProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={24} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default DriverNavigator;
