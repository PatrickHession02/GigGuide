import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const Concertinfo = ({ route }) => {
  const { concert } = route.params;
  console.log('CONCERT:', concert);
  const styles = StyleSheet.create({
    container: {
      padding: 10, // Add your desired padding or other styles
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
  });
  return (
    <>
      <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient} />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text> {concert.name}</Text>
          <Text>Concert Info</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default Concertinfo;