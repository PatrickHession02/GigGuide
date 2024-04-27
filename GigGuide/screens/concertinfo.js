import React from 'react';
import { Text, ScrollView, StyleSheet, Dimensions, Image, View ,TouchableOpacity,Linking} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {MapView} from 'react-native-maps';
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
    dateCard: {
      backgroundColor: 'white', // Make the card background white
      borderRadius: 10, // Add some border radius to make the card rounded
      padding: 10, // Add some padding to the card
      margin: 5, // Add some margin around the card
      shadowColor: '#000', // Set the shadow color to black
      shadowOffset: { width: 0, height: 1 }, // Set the shadow offset
      shadowOpacity: 0.2, // Set the shadow opacity
      shadowRadius: 1, // Set the shadow radius
      elevation: 2, // Set the elevation to create a shadow on Android
    },
    dateText: {
      color: 'black', // Make the text color black so it's visible on the white card
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
  {!highestQualityImage && (
    <Image
      source={require('../assets/concert9.jpg')}
      style={styles.image}
      resizeMode="cover"
    />
  )}
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
    <View style={styles.dateCard} key={index}>
      <Text style={styles.dateText}>
        {concertItem.date ? new Date(concertItem.date).toLocaleDateString() : 'Date not available'}
      </Text>
      <TouchableOpacity style={styles.ticketButton} onPress={() => Linking.openURL(concertItem.ticketLink)}>
        <Text style={styles.ticketButtonText}>Purchase Tickets</Text>
      </TouchableOpacity>
      {concertItem.location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: concertItem.location.latitude,
            longitude: concertItem.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: concertItem.location.latitude,
              longitude: concertItem.location.longitude,
            }}
            title={concertItem.location.name}
          />
        </MapView>
      )}
    </View>
  );
})}
        </View>
      </ScrollView>
    </>
 );
};

export default Concertinfo;