import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import { Linking } from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [concertsData, setConcertsData] = useState([]);

  const fetchTopArtistData = async (accessToken) => {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    console.log('Top artist data:', data);
    return data.items.map(artist => artist.name);
  };

  const fetchConcertsData = async (topArtistData, accessToken) => {
    try {
      const response = await fetch('https://783b-79-140-211-73.ngrok-free.app/concerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // use the access token
        },
        body: JSON.stringify({ artists: topArtistData }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Concert data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching concert data:', error);
    }
  }

  const handleLogin = async () => {
    try {
      console.log('handleLogin called'); 
      // Step 1: Log the user into Spotify
      Linking.openURL('https://783b-79-140-211-73.ngrok-free.app/login');
  
      // Listen for the url event
      Linking.addEventListener('url', handleOpenURL);
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };
  
  const handleOpenURL = (event) => {
    // Extract the access token from the URL
    console.log('handleOpenURL called');
    const accessToken = event.url.split('=')[1];
  
    // Fetch the top artist data from the Spotify API
    fetchTopArtistData(accessToken).then(topArtistData => {
      // Use the top artist data as the search parameter to fetch concert data from the Ticketmaster API
      fetchConcertsData(topArtistData, accessToken).then(concertsData => {
        // Update state with the fetched concert data
        console.log('Fetched concert data:', concertsData);
        setConcertsData(concertsData);
  
        // Remove the event listener
        Linking.removeEventListener('url', handleOpenURL);
      });
    });
  };


/*
  useEffect(() => {
    fetchTopArtistData().then(topArtistData => {
      fetchConcertsData(topArtistData);
    });
  }, []); ; // Empty dependency array ensures that the effect runs only once after the component mounts
*/
  const handleConcertPress = () => {
    navigation.navigate('Concertinfo');
  };

  return (
    <LinearGradient colors={['#8E00FD', '#FF000F']} style={styles.gradient}>
      <View>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={(text) => setSearch(text)}
          value={search}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
        />
      </View>
      <Button title="Login" onPress={handleLogin} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {concertsData.map((concert, index) => (
          <TouchableOpacity key={index} onPress={handleConcertPress}>
            <View style={styles.concertContainer}>
              <Text style={styles.concertName}>{concert.name}</Text>
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
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBarInputContainer: {
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  concertContainer: {
    width: '80%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  concertName: {
    fontSize: 16,
  },
});

export default HomeScreen;