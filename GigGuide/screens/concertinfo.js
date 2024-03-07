import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const Concertinfo = () => {
  const fetchMessageFromServer = async () => {
    try {
      const res = await fetch('https://21d8-79-140-211-73.ngrok-free.app/Concerts', {
        method: 'GET',
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };


  return (
    <LinearGradient colors={['#8E00FD', '#FF000F']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Concert Info</Text>
      </ScrollView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
export default Concertinfo;