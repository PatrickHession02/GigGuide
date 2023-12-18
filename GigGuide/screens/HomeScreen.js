import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { ScrollView, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const navigation = useNavigation();

  // Define an array of image paths
  const imagePaths = [
    require('../assets/concert.jpg'),
    require('../assets/concert2.jpg'),
    require('../assets/concert3.jpg'),
    require('../assets/concert4.jpg'),
    require('../assets/concert5.jpg'),
    require('../assets/concert6.jpg'),
    require('../assets/concert7.jpg'),
    require('../assets/concert8.jpg'),
    require('../assets/concert9.jpg'),
    require('../assets/concert10.jpg'),
    // Add more paths as needed
  ];

  return (
    <LinearGradient colors={['#8E00FD', '#FF000F']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {imagePaths.map((path, index) => (
          <TouchableOpacity key={index} onPress={() => console.log(`Picture ${index + 1} clicked`)}>
            <View style={styles.imageContainer}>
              <Image source={path} style={styles.image} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollViewContainer: {
    alignItems: 'center', // Center the images horizontally
    paddingVertical: 16, // Add space between images vertically
  },
  imageContainer: {
    width: '80%', // Set the desired width for each image container
    aspectRatio: 16 / 10, // Adjust aspect ratio for a slightly longer image
    borderRadius: 20, // Add slightly curved corners
    overflow: 'hidden',
    marginBottom: 20, // Add more space between images vertically
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
