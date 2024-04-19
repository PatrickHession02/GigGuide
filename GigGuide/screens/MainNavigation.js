import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import Settings from './Settings';
import Profile from './Profile';
import Concertinfo from './Concertinfo'; 
import AI from './AI';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator(); 
const Stack = createStackNavigator();

export const HomeStack = ({uid}) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="HomeStackScreen"
      children={props => <HomeScreen {...props} uid={uid} />}
    />
    <Stack.Screen
      name="Concertinfo"
      component={Concertinfo}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export const MainNavigator = ({uid}) => {
  const tabBarOptions = {
    style: {
      backgroundColor: '', // Set the background color of the tab bar
    },
    activeTintColor: '#000000', // Set the text color for active tabs
    inactiveTintColor: '#A9A9A9', // Set the text color for inactive tabs
  };

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
  
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }
  
        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#fc0366',
      inactiveTintColor: '#f27e44',
    }}
  >

<Tab.Screen
  name="Home"
  children={props => <HomeStack {...props} uid={uid} />}
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
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
      name='AI'
      component={AI}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" color={color} size={size} />
        ),
      }}
      />
       <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


export default MainNavigator;
