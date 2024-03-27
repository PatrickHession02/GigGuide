import React, { useState, useEffect } from 'react';
import { ScrollView, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import { Linking } from 'react-native';
const HomeScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [imagePaths, setImagePaths] = useState([]);
  const [concertsData, setConcertsData] = useState([]);

  //make a pressable button that calls the login endpoint in my backend
  // ...

  const handleLogin = () => {
    Linking.openURL('https://2a2d-79-140-211-73.ngrok-free.app/login')
      .catch((err) => console.error('Failed to open URL:', err));
  };


  async function login() {
    try {
      const response = await fetch('https://2a2d-79-140-211-73.ngrok-free.app/login');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Data received:', data);
    } catch (error) {
      console.error('Error fetching concert data:', error);
    }
  }

  const fetchConcertsData = async () => {
    try {
      const response = await fetch('https://e70d-193-1-57-3.ngrok-free.app/concerts');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Data received:', data);
      setConcertsData(data);
    } catch (error) {
      console.error('Error fetching concert data:', error);
    }
  };
  useEffect(() => {
    fetchConcertsData(); // Fetch concert data from backend
  }, []); // Empty dependency array ensures that the effect runs only once after the component mounts

  useEffect(() => {
    // Extract image URLs from concert data when concertsData changes
    const imageUrls = extractImageUrls(concertsData);
    setImagePaths(imageUrls);
  }, [concertsData]); // Re-run effect when concertsData changes

  const extractImageUrls = (concertsData) => {
    const imageUrls = [];
    if (Array.isArray(concertsData)) {
      concertsData.forEach(concert => {
        concert.images.forEach(image => {
          imageUrls.push(image.url);
        });
      });
    }
    return imageUrls;
  };

  const handleImagePress = () => {
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
        {imagePaths.map((path, index) => (
          <TouchableOpacity key={index} onPress={handleImagePress}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: path }} style={styles.image} />
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
  imageContainer: {
    width: '80%',
    aspectRatio: 16 / 10,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;