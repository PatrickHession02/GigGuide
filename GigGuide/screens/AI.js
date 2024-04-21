import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { LinearGradient } from 'expo-linear-gradient';

const AI = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [concertsData, setConcertsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseConcerts = await fetch('https://8cbc-79-140-211-73.ngrok-free.app/AI');
        const dataConcerts = await responseConcerts.json();
        console.log('Fetched data:', dataConcerts);
        if (!dataConcerts) {
          console.error('Fetched data is undefined');
          return;
        }
        const groupedData = dataConcerts.reduce((acc, concert) => {
          console.log('Current AI concert:', concert);
          const artistIndex = acc.findIndex(artist => artist.name === concert.name);
          if (artistIndex !== -1) {
            acc[artistIndex].concerts.push(concert);
          } else {
            acc.push({ name: concert.name, concerts: [concert] });
          }
          return acc;
        }, []);
        setData(groupedData);
      } catch (error) {
        console.error('Error fetching concerts:', error);
      }
    };
    fetchData();
  }, []);

  const handleConcertPress = (concert) => {
    navigation.navigate('Concertinfo', { concert });
  };

  const renderItem = ({ item: concert }) => {
    const firstConcert = concert.concerts[0];
    return (
      <TouchableOpacity onPress={() => handleConcertPress(concert)}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.concertContainer}
        >
          <Image source={{ uri: firstConcert.image }} style={styles.concertImage} />
          <Text style={styles.concertName}>{firstConcert.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
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

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default AI;