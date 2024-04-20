import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { LinearGradient } from 'expo-linear-gradient';

const AI = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    fetch('https://4ee5-79-140-211-73.ngrok-free.app/AI')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched AI data:', data);
        if (data) {
          setData(data);
        }
      })
      .catch(error => console.error(error));
  }, []);
  const renderItem = ({ item: concert }) => {
    if (concert && concert.images && concert.images.length > 0) {
      return (
        <TouchableOpacity onPress={() => handleConcertPress(concert)}>
          <View style={styles.concertContainer}>
            <View style={styles.imageContainer}>
              <Image style={styles.concertImage} source={{ uri: concert.images[0].url }} />
              <Text style={styles.concertName}>{concert.name}</Text>
              <Text style={styles.concertVenue}>{concert.venue}</Text>
              <Text style={styles.concertDate}>{concert.date}</Text>
              <Text style={styles.concertCity}>{concert.city}</Text>
              <Text style={styles.concertCountry}>{concert.country}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };
  const handleConcertPress = (concert) => {
    navigation.navigate('Concertinfo', { concert });
  };

  console.log('Concerts Data:', data);
  return (
    <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={styles.scrollViewContainer}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

// Styles go here...
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
    height: 300,
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
    borderWidth: 2,
    borderColor: '#f205e2',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  concertImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
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

export default AI;