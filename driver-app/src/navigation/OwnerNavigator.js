import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Screens
import OwnerDashboard from '../screens/OwnerDashboard';
import MyBusesScreen from '../screens/MyBusesScreen';
import BookingsScreen from '../screens/BookingsScreen';
import RevenueScreen from '../screens/RevenueScreen';
import OwnerProfileScreen from '../screens/OwnerProfileScreen';

const Tab = createBottomTabNavigator();

const OwnerNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    height: 70, // Slightly taller
                    position: 'absolute',
                    bottom: 20,
                    marginHorizontal: 20,
                    borderRadius: 25,
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderWidth: 0, // Remove top border
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
                name="Overview"
                component={OwnerDashboard}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid-outline" size={24} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="My Buses"
                component={MyBusesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bus-outline" size={24} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Bookings"
                component={BookingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ticket-outline" size={24} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Revenue"
                component={RevenueScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet-outline" size={24} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="More"
                component={OwnerProfileScreen} // Will be Profile/Menu
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="menu-outline" size={24} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default OwnerNavigator;
