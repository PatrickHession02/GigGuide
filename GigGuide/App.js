import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from './FirebaseConfig';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import Concertinfo from './screens/Concertinfo';
import Profile from './screens/Profile';
import Settings from './screens/Settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Initialize your Firebase app
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Renamed InfoLayout navigator to InfoStackNavigator
const InfoStackNavigator = createNativeStackNavigator();

function InfoLayout() {
  return (
    <InfoStackNavigator.Navigator>
      <InfoStackNavigator.Screen name="Home" component={HomeScreen} />
      <InfoStackNavigator.Screen name="Concertinfo" component={Concertinfo} />
    </InfoStackNavigator.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen options={{ headerShown: false }} name="Inside" component={InsideLayout} />
        ) : (
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function InsideLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={InfoLayout} /> {/* Changed to InfoLayout */}
      <Tab.Screen name='Profile' component={Profile} />
      <Tab.Screen name='Settings' component={Settings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
