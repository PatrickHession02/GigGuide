import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import Settings from './Settings';
import Profile from './Profile';
import Concertinfo from './Concertinfo'; 
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator(); 
const Stack = createStackNavigator();

export const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
    />
    <Stack.Screen
      name="Concertinfo"
      component={Concertinfo}
    />
  </Stack.Navigator>
);

export const MainNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="HomeStack"
      component={HomeStack} 
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
      }}
    />
   
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" color={color} size={size} />
        ),
      }}
    />
     <Tab.Screen
      name="Settings"
      component={Settings}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainNavigator;
