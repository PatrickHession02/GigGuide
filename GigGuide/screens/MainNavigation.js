import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import Settings from './Settings';
import Profile from './Profile';
const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
