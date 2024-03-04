import React, { useState } from 'react';
import { ScrollView, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const imagePaths = [
    require('../assets/concert.jpg'),
    require('../assets/concert2.jpg'),
    require('../assets/concert3.jpg'),
    require('../assets/concert4.jpg'),
    require('../assets/concert5.jpg'),
    require('../assets/concert6.jpg'),
    require('../assets/concert7.jpg'),
    require('../assets/concert8.jpg'),
    require('../assets/concert9.jpg'),
    require('../assets/concert10.jpg'),
  ];

  const handleImagePress = (index) => {
    console.log(`Picture ${index + 1} clicked`);
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
          <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
            <View style={styles.imageContainer}>
              <Image source={path} style={styles.image} />
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
