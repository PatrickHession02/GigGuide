import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import LoginScreen from './screens/LoginScreen';
import MainNavigator from './screens/MainNavigation';
import { firebase, auth } from './FirebaseConfig';
import { signOut } from 'firebase/auth';
import HomeScreen from './screens/HomeScreen';
import { usePushNotifications } from './Notifications/Notifications'; // Import the hook
import Settings from './screens/Settings';
const Stack = createNativeStackNavigator();

export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { expoPushToken, notification, triggerNotification } = usePushNotifications(); // Use the hook

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      console.log('user', user);
      if (user) {
        console.log('UID1', user.uid);  // Log the UID to the console
      }
      setUser(user);
      setLoading(false);
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
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      console.log('user', user);
      if (user) {
        setUser(user);
        // Send the token to your server
        fetch('https://aa5c-193-1-57-3.ngrok-free.app/saveToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: expoPushToken,
            userId: user.uid,
          }),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  
    return unsubscribe;
  }, [expoPushToken]);
  // Function to trigger a notification
  const triggerPushNotification = async () => {
    if (expoPushToken) {
      try {
        const response = await fetch('https://aa5c-193-1-57-3.ngrok-free.app/saveToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pushTokens: [expoPushToken],
            message: 'Test message',
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        console.log('Notification triggered:', data);
      } catch (error) {
        console.error('Failed to trigger notification:', error);
      }
    } else {
      console.error('Expo push token is not available.');
    }
  };
<Settings triggerPushNotification={triggerPushNotification} />
  if (loading) {
    return null; // Or return a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen 
            options={{ headerShown: false }} 
            name="Main"
            children={props => <MainNavigator {...props} uid={user.uid} />}
          />
        ) : (
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
