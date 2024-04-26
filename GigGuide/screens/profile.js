import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
  return (
    <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.text}>Profile</Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-start', // Align items to the start of the main axis
    alignItems: 'flex-start', // Align items to the start of the cross axis
    paddingLeft: 10, // Add some padding to the left
  },
  text: {
    fontSize: 30,
    color: '#fff',
    paddingLeft: 30,
    paddingTop: 20,
    fontWeight: 'bold', 
  },
});

export default ProfileScreen;