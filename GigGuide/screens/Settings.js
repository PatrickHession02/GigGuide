import React from 'react';
import { ScrollView, View, Button, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
const Settings = () => {
  const handleSpotifyConnect = () => {
    fetch('localhost:3050/login', {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add any body data if needed
    })
    .then(response => {
      // Handle response as needed
    })
    .catch(error => {
      console.error('Error connecting to Spotify:', error);
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH); // Sign out the user
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };
  
  return (
    <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient}>
      <SafeAreaView contentContainerStyle={styles.container}>
        <View style={styles.buttonContainer}>
          {/* Green rounded rectangle background */}
          <View style={styles.greenBackground}>
            {/* White button */}
            <Button title="Spotify ReScan" color="#FFFFFF" onPress={handleSpotifyConnect} />
          </View>
          {/* Red rectangle background */}
          <View style={styles.redBackground}>
            {/* Logout button */}
            <Button title="Logout" color="#FFFFFF" onPress={handleLogout} />
          </View>
        </View>
      </SafeAreaView>
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
  buttonContainer: {
    alignItems: 'center',
  },
  greenBackground: {
    backgroundColor: '#00FF00',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    overflow: 'hidden', // This is important to ensure the white button stays within the rounded rectangle
  },
  redBackground: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    overflow: 'hidden', // This is important to ensure the button stays within the rounded rectangle
  },
});

export default Settings;
