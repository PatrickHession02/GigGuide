import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Settings = () => {
  return (
    <LinearGradient colors={['#8E00FD', '#FF000F']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Settings</Text>
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
});

export default Settings;
