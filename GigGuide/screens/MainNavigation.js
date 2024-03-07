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

export const MainNavigator = () => {
  const tabBarOptions = {
    style: {
      backgroundColor: '', // Set the background color of the tab bar
    },
    activeTintColor: '#000000', // Set the text color for active tabs
    inactiveTintColor: '#A9A9A9', // Set the text color for inactive tabs
  };

  return (
    <Tab.Navigator
      tabBarOptions={tabBarOptions}
    >
      <Tab.Screen
        name="Home"
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
};


export default MainNavigator;
