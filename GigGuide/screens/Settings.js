import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { authorize } from 'react-native-app-auth';
import axios from 'axios';
import {AuthSession} from 'expo'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      // You can navigate to the login screen or perform any other action after logout
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };




  return (
    <LinearGradient colors={['#8E00FD', '#FF000F']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8E00FD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  connectButton: {
    backgroundColor: '#80C904', // Light green color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Settings;
