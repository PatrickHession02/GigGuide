import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import Settings from './Settings';
import Profile from './Profile';
import Concertinfo from './Concertinfo'; 
import AI from './AI';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      } else if (route.name === 'AI') {
        iconName = focused ? 'robot-happy' : 'robot-outline';
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#f55516',
    tabBarInactiveTintColor: '#8d4fbd',
  })}
>
<Tab.Screen
  name="Home"
  children={props => <HomeStack {...props} uid={uid} />}
  options={{
    headerShown: false,
  }}
/>
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen
      name='AI'
      component={AI}
      options={{
        headerShown: false,
      }}
      />
       <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};


export default MainNavigator;
