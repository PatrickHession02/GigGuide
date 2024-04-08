import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-snap-carousel';

const Concertinfo = ({ route }) => {
  const { concert } = route.params;
  const carouselRef = useRef(null);
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    const timer = setInterval(() => {
      carouselRef.current.snapToNext();
    }, 2000); // Change images every 2 seconds
    return () => clearInterval(timer);
  }, []);

  const styles = StyleSheet.create({
    container: {
      padding: 10, // Add your desired padding or other styles
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
    image: {
      width: screenWidth - 60,
      height: 200,
    },
  });

  const renderItem = ({ item }) => {
    return (
      <Image style={styles.image} source={{ uri: item }} />
    );
  };

  return (
    <>
      <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient} />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text> {concert.name}</Text>
          <Carousel
            ref={carouselRef}
            data={concert.concerts[0].images}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth - 60}
            loop={true}
          />
          <Text>Concert Info</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Concertinfo;