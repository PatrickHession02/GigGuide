import React, { useState, useEffect } from 'react';
import { ScrollView, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    fetchImagePaths();
  }, []);

  const fetchImagePaths = async () => {
    try {
      const response = await fetch('YOUR_EXPRESS_SERVER_URL');
      const data = await response.json();
      setImagePaths(data.imagePaths);
    } catch (error) {
      console.error('Error fetching image paths:', error);
    }
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