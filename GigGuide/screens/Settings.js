import React from 'react';
import { ScrollView, View, Button, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { Notifications } from 'expo';

const Settings  = ({ triggerPushNotification }) => {
  const handleSpotifyConnect = () => {
    fetch('localhost:3050/login', {
      headers: {
        'Content-Type': 'application/json',
      },

    })
    .then(response => {

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

  const handleSendNotification = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification from your app!',
      },
      trigger: null, // Send immediately
    });
  };

  return (
    <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient}>
      <SafeAreaView contentContainerStyle={styles.container}>
      <Text style={styles.settingsText}>Settings</Text> 
      <View style={styles.lineStyle} />
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
          {/* Blue rectangle background */}
          <View style={styles.blueBackground}>
            {/* Send Notification button */}
            <Button title="Send Notification" color="#FFFFFF" onPress={triggerPushNotification} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  settingsText: {
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    paddingTop: 20, 
    paddingLeft: 20,  

  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    width: '100%',
    marginTop: 10,
    marginBottom: 70,
  },
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
    marginBottom: 10,
    overflow: 'hidden', // This is important to ensure the button stays within the rounded rectangle
  },
  blueBackground: {
    backgroundColor: '#0000FF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    overflow: 'hidden', // This is important to ensure the button stays within the rounded rectangle
  },
});

export default Settings;
