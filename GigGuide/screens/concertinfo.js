import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, Dimensions, Image, View ,TouchableOpacity,Linking} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import  MapView ,{ Marker } from 'react-native-maps';
const Concertinfo = ({ route }) => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, name: 'Default Location' });
  const [loading, setLoading] = useState(true); 
 const { concert } = route.params;
 const insets = useSafeAreaInsets(); // Get the safe area insets
 const lineup = concert.concerts[0].lineup;

 console.log(concert.concerts[0].venue);
 useEffect(() => {
  fetch('https://5b9f-79-140-211-73.ngrok-free.app/places', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      venue: concert.concerts[0].venue ? concert.concerts[0].venue : 'Default Location',
    }),
  })
  .then(response => response.json())
  .then(data => {
    setLocation({
      latitude: data.latitude,
      longitude: data.longitude,
      name: data.name,
    });
    setLoading(false); // Set loading to false after location state is updated
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}, []);

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
    mapCard: {
      width: '100%', // Add this line
    },
    map: {
      width: '100%', // This is already set to 100%
      height: 200,
      borderRadius: 20, // Add this line to make the map view rounded
    },
    ticketCard: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 30,
      margin: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 2,
      width: '98%',
    },
    ticketButtonText: {
      color: '#8d4fbd',
      textAlign: 'center', // Center the text
      fontSize: 20, // Increase the size
      fontWeight: 'bold', // Make it bold
    },
 });

 const allImages = concert && Array.isArray(concert.concerts) ? concert.concerts.flatMap(concert => concert.images) : [];

 const nonFallbackImages = allImages.filter(image => !image.fallback);

 nonFallbackImages.sort((a, b) => b.quality - a.quality);

 const highestQualityImage = nonFallbackImages[0];
 
 return (
  <>
    <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient} />
    <ScrollView contentContainerStyle={{width: '100%'}} style={styles.scrollView}>
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
    <View key={index}>
      <View style={styles.dateCard}>
        <Text style={styles.dateText}>
          {concertItem.date ? new Date(concertItem.date).toLocaleDateString() : 'Date not available'}
        </Text>
      </View>
    </View>
  );
})}
 {lineup.map((artist, index) => (
          <Text key={index} style={styles.artistText}>{artist}</Text>
        ))}
        
     <View style={styles.ticketCard}>
  <TouchableOpacity onPress={() => Linking.openURL(concert.concerts[0].ticketLink)}>
    <View style={styles.ticketButton}>
      <Text style={styles.ticketButtonText}>Purchase Tickets:</Text>
    </View>
  </TouchableOpacity>
</View>
        <View style={styles.mapCard}>
          {loading ? (
            <Text>Loading...</Text> 
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              scrollEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.name}
              />
            </MapView>
          )}
        </View>
      </View>
    </ScrollView>
  </>
);
};

export default Concertinfo;