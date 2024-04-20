import React from 'react';
import { Text, ScrollView, StyleSheet, Dimensions, Image, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const Concertinfo = ({ route }) => {
 const { concert } = route.params;
 const insets = useSafeAreaInsets(); // Get the safe area insets
 console.log("routes",route.params);
 const styles = StyleSheet.create({
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
    scrollView: {
      width: "100%" // Make the ScrollView take up the full width of the screen
    },
    image: {
      width: '100%', // Ensure the image takes the full width
      height: 400, // Set the desired height
      resizeMode: 'cover', // Cover the area without stretching
    },
    overlay: {
      position: 'absolute', // Position the text absolutely
      bottom: 10, // Position it 10px from the bottom
      left: 10, // Position it 10px from the left
      color: 'white', // Make the text color white so it's visible on the image
      fontSize: 24, // Increase the font size
      fontWeight: 'bold', // Make the text bold
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent black background to the text
      padding: 10, // Add some padding so the background doesn't hug the text too tightly
      borderRadius: 5, // Add some border radius to make the background rounded
    },
 });

 const allImages = Array.isArray(concert.concerts) ? concert.concerts.flatMap(concert => concert.images) : [];
 // Filter out fallback images
 const nonFallbackImages = allImages.filter(image => !image.fallback);
 // Sort in descending order of quality
 nonFallbackImages.sort((a, b) => b.quality - a.quality);
 // Get the highest quality image
 const highestQualityImage = nonFallbackImages[0];
 console.log(concert);
 return (
    <>
      <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient} />
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
        <View>
          {highestQualityImage && (
            <Image
              source={{ uri: highestQualityImage.url }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <Text style={styles.overlay}> {concert.name}</Text>
        </View>
        <Text>Concert Info</Text>
        <Text>{concert.date ? new Date(concert.date).toLocaleDateString() : 'Date not available'}</Text>
      </ScrollView>
    </>
 );
};

export default Concertinfo;