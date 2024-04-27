import React from 'react';
import { Text, ScrollView, StyleSheet, Dimensions, Image, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const Concertinfo = ({ route }) => {
 const { concert } = route.params;

 const insets = useSafeAreaInsets(); // Get the safe area insets

    const styles = StyleSheet.create({
    gradient: {
      position: 'absolute',
      left: 0, 
      right: 0,
      top: 0,
      height: '100%',
    },
    scrollView: {
      width: "100%" 
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
    dateContainer: {
      flexDirection: 'row', // Add this to make the dates display side by side
      flexWrap: 'wrap', // Add this to wrap the dates to the next line if they overflow
    },
    dateText: {
      marginRight: 10, // Add some margin to the right of each date
    },
 });

 const allImages = concert && Array.isArray(concert.concerts) ? concert.concerts.flatMap(concert => concert.images) : [];

 const nonFallbackImages = allImages.filter(image => !image.fallback);

 nonFallbackImages.sort((a, b) => b.quality - a.quality);

 const highestQualityImage = nonFallbackImages[0];
 
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
        <View style={styles.dateContainer}>
          {concert.concerts.map((concertItem, index) => {
            return (
              <View key={index}>
                <Text style={styles.dateText}>
                  {concertItem.date ? new Date(concertItem.date).toLocaleDateString() : 'Date not available'}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
 );
};

export default Concertinfo;