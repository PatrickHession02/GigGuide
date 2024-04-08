import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, Image, FlatList, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { useAutoDiscovery, useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { SafeAreaView } from 'react-native-safe-area-context';
WebBrowser.maybeCompleteAuthSession();

const HomeScreen = ({ uid }) => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const discovery = useAutoDiscovery('https://accounts.spotify.com');
  const [concertsData, setConcertsData] = useState([]);

  const redirectUri = makeRedirectUri({ scheme: 'gigguide' });
  console.log("Redirect URI: ", redirectUri);
  
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning!';
    } else if (currentHour < 18) {
      return 'Good Afternoon!';
    } else {
      return 'Good Evening!';
    }
  };
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '736a5838698041a6bcfb852f8ee1a6ab',
      scopes: ['user-read-email', 'playlist-modify-public', 'user-top-read'],
      usePKCE: false,
      redirectUri: redirectUri,
    },
    discovery
  );

  const [handleLogin, setHandleLogin] = useState(() => async () => {});

  useEffect(() => {
    setHandleLogin(() => async () => {
      const result = await promptAsync();
      if (result.type === 'success') {
        const code = result.params.code;
        console.log("Authorization Code: ", code);
        console.log("UID2: ", uid);
        const response = await fetch('https://bfab-79-140-211-73.ngrok-free.app/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, uid }),
        });

        if (!response.ok) {
          console.error('Failed to send code to backend');
          return;
        }
        const data = await response.json();
        console.log('Received data from backend', data);
      }
    });
  }, [uid, promptAsync]);

  useEffect(() => {
    fetch('https://bfab-79-140-211-73.ngrok-free.app/concerts')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data);
        if (!data) {
          console.error('Fetched data is undefined');
          return;
        }
        const groupedData = data.reduce((acc, concert) => {
          console.log('Current concert:', concert);
          const artistIndex = acc.findIndex(artist => artist.name === concert.name); // Changed concert.artist to concert.name
          if (artistIndex !== -1) {
            acc[artistIndex].concerts.push(concert);
          } else {
            acc.push({ name: concert.name, concerts: [concert] }); // Changed concert.artist to concert.name
          }
          return acc;
        }, []);
        setConcertsData(groupedData);
      })
      .catch((error) => {
        console.error('Error fetching concerts:', error);
      });
  }, []);

  const handleConcertPress = (concert) => {
    navigation.navigate('Concertinfo', { concert });
  };

  const renderItem = ({ item: concert }) => {
    const firstConcert = concert.concerts[0];
    return (
      <TouchableOpacity onPress={() => handleConcertPress(concert)}>
        <View style={styles.concertContainer}>
          {firstConcert.images && firstConcert.images.length > 0 && (
            <View style={styles.imageContainer}>
              <Image style={styles.concertImage} source={{ uri: firstConcert.images[0].url }} />
              <Text style={styles.concertName}>{firstConcert.name}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  console.log('Concerts Data:', concertsData);
  return (
    <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient}>
      <SafeAreaView>
        {concertsData.length === 0 && <Button title="Login" onPress={handleLogin} />}
      </SafeAreaView>
      {concertsData.length > 0 && <Text style={styles.greetingText}>{getGreeting()}</Text>}
      <FlatList
        contentContainerStyle={styles.scrollViewContainer}
        data={concertsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
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
    width: 400, 
    height: 300,// This sets the width to 300 pixels
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2, // This sets the width of the border
    borderColor: '#f205e2', // This sets the color of the border
  },
  concertName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 80,
    fontWeight: 'bold', // Make the text bold
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent black background to the text
    padding: 10, // Add some padding so the background doesn't hug the text too tightly
    borderRadius: 5, // Add some border radius to make the background rounded

  },
  concertImage: {
    width: '100%', // make the image fill the width of the container
    height: '100%', // adjust the height as needed
    resizeMode: 'cover', // make the image cover the whole width while maintaining its aspect ratio
    borderRadius: 10, // add this line to make the image corners rounded
  },
  greetingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginTop: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 20, 
  },
});

export default HomeScreen;
