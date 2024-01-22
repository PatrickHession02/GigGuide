import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = () => {
  return (
    <LinearGradient colors={['#8E00FD', '#FF000F']} style={styles.gradient}>
      <ScrollView>
        <Text>Profile</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default Profile;
