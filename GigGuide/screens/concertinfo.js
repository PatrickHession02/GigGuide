import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, Dimensions, Image, View ,TouchableOpacity,Linking, FlatList} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import  MapView ,{ Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Concertinfo = ({ route }) => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, name: 'Default Location' });
  const [loading, setLoading] = useState(true); 
 const { concert } = route.params;
 const lineupSet = new Set(concert.concerts[0].lineup); //prevents duplicate artists
 const lineup = Array.from(lineupSet);

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
      marginTop: 10,
      backgroundColor: 'white', // Make the card background white
      borderRadius: 10, // Add some border radius to make the card rounded
      padding: 15, // Add some padding to the card
      margin: 10, // Add some margin around the card
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
      marginBottom: 10,
    },
    ticketButtonText: {
      color: '#8d4fbd',
      textAlign: 'center', // Center the text
      fontSize: 20, // Increase the size
      fontWeight: 'bold', // Make it bold
    },
    lineupText: {
      color: '#000',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 10,
    },
    lineupCard: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      margin: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 2,
      marginTop: 10,
      width:'97%'
    },
    lineupTitle: {
      fontSize: 20, // Increase the font size
      fontWeight: 'bold', // Make the text bold
      textAlign: 'center', // Center the text
    },
    venueCard: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 2,
      marginBottom: 10,
      marginLeft: 6,
      width:'97%',
      flexDirection: 'row', // Add this line
      alignItems: 'center', // Add this line
    },
    venueTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    venueText: {
      color: '#000',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 10,
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
  <View style={styles.lineupCard}>
    <Text style={styles.lineupTitle}>Lineup:</Text>
    <Text style={styles.lineupText}>{lineup.join(', ')}</Text>
  </View>
  <FlatList
    data={lineup}
    renderItem={({ item, index }) => (
      <Text key={index} style={styles.lineupText}>{item}</Text>
    )}
    horizontal={true}
  />
</View>

<View style={styles.ticketCard}>
      <TouchableOpacity onPress={() => Linking.openURL(concert.concerts[0].ticketLink)}>
        <View style={styles.ticketButton}>
          <Text style={styles.ticketButtonText}>Purchase Tickets:</Text>
        </View>
      </TouchableOpacity>
    </View>

    <View style={{ ...styles.venueCard, flexDirection: 'row', alignItems: 'center', paddingLeft:30 }}>
  <MaterialCommunityIcons name="stadium-variant" size={30} color="orange" style={{ marginRight: 26 }} />
  <View style={{ flex: 1, alignItems: 'center', paddingRight: 80 }}>
    <Text style={styles.venueTitle}>Venue:</Text>
    <Text style={styles.venueText}>{concert.concerts[0].venue}</Text>
  </View>
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
</ScrollView>
</>
);
};

export default Concertinfo;