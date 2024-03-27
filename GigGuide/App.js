import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import LoginScreen from './screens/LoginScreen';
import MainNavigator from './screens/MainNavigation';
import { firebase, auth } from './FirebaseConfig';
import * as Linking from 'expo-linking';
import { signOut } from 'firebase/auth';
import HomeScreen from './screens/HomeScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      console.log('user', user);
      setUser(user);
    });
  
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH); // Sign out the user
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const linking = {
    prefixes: ['gigguide://', 'http://localhost:3050/callback', Linking.createURL()],
    config: {
      screens: {
        Home: 'home',
        // other screens...
      },
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen options={{ headerShown: false }} name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        )}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}