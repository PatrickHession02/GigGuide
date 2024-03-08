import React from 'react';
import { ScrollView, View, Button, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Settings = () => {
  const handleSpotifyConnect = () => {
    fetch('YOUR_SERVER_URL/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers if needed
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

  return (
    <LinearGradient colors={['#8E00FD', '#FF000F']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.buttonContainer}>
          {/* Green rounded rectangle background */}
          <View style={styles.greenBackground}>
            {/* White button */}
            <Button title="Spotify Connect" color="#FFFFFF" onPress={handleSpotifyConnect} />
          </View>
          {/* Red rectangle background */}
          <View style={styles.redBackground}>
            {/* Logout button */}
            <Button title="Logout" color="#FFFFFF" onPress={() => {}} />
          </View>
        </View>
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
