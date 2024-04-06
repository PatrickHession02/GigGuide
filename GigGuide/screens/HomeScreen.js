import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAutoDiscovery, useAuthRequest,  makeRedirectUri} from 'expo-auth-session';
WebBrowser.maybeCompleteAuthSession();

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const discovery = useAutoDiscovery('https://accounts.spotify.com');
  const [concertsData, setConcertsData] = useState([]);
  
  const redirectUri = makeRedirectUri({ scheme: 'gigguide' });
  console.log("Redirect URI: ", redirectUri);
  
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '736a5838698041a6bcfb852f8ee1a6ab',
      scopes: ['user-read-email', 'playlist-modify-public'],
      usePKCE: false,
      redirectUri: redirectUri,
    },
    discovery
  );

  const handleLogin = async () => {
    const result = await promptAsync();
    if (result.type === 'success') {
      // The user authenticated successfully, you can get the authorization code like this:
      const code = result.params.code;
      // Now you can send the code to your backend to get an access token and refresh token
      console.log("Authorization Code: ", code);
  
      // Send the code to your backend
      const response = await fetch('https://3302-93-89-250-119.ngrok-free.app/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
  
      if (!response.ok) {
        console.error('Failed to send code to backend');
        return;
      }
      const data = await response.json();
      console.log('Received data from backend', data);
    }
  };

  const handleConcertPress = () => {
    navigation.navigate('Concertinfo');
  };


  return (
    <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient}>
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