import React, { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          console.log('Initial url is: ' + url);
          // Here you can handle the initial URL
          // For example, you can parse it and extract the code parameter
          const initialUrl = new URL(url);
          const code = initialUrl.searchParams.get('code');
          if (code) {
            // Handle the code parameter
            // For example, you can call your handleOpenURL function
            handleOpenURL({ url });
          }
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }, []);


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
      const response = await fetch('https://dda5-80-233-56-154.ngrok-free.app/concerts', {
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
      Linking.openURL('https://dda5-80-233-56-154.ngrok-free.app/login');
  
      // Listen for the url event
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };
  
  const handleOpenURL = useCallback((event) => {
    console.log('handleOpenURL called');
    console.log('App opened with URL:', event.url);
    const parsedUrl = url.parse(event.url, true); // Parse the URL and its query parameters
    const code = parsedUrl.query.code;
  
    // Exchange the code for an access token
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3050/callback&client_id=736a5838698041a6bcfb852f8ee1a6ab&client_secret=7a3d54e2e5534693a116dc4847ed92b0`,
    })
      .then(response => response.json())
      .then(data => {
        const accessToken = data.access_token;
  
        // Now you can use the access token to fetch the top artist data
        fetchTopArtistData(accessToken)
          .then(topArtistData => {
            fetchConcertsData(topArtistData, accessToken)
              .then(concertsData => {
                console.log('Fetched concert data:', concertsData);
                setConcertsData(concertsData);
              })
              .catch(error => console.error('Error fetching concert data:', error));
          })
          .catch(error => console.error('Error fetching top artist data:', error));
      })
      .catch(error => console.error('Error getting access token:', error));
  }, []);

  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleOpenURL);

  
    return () => {
      return () => subscription.remove();
    };
  }, [handleOpenURL]);


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