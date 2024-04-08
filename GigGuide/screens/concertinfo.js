import React from 'react';
import { Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import FullWidthImage from 'react-native-fullwidth-image';

const Concertinfo = ({ route }) => {
 const { concert } = route.params;
 const insets = useSafeAreaInsets(); // Get the safe area insets

 const styles = StyleSheet.create({

    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
    scrollView: {
      width: "100%" // Make the ScrollView take up the full width of the screen

    },
 });

 const nonFallbackImages = concert.concerts[0].images.filter(image => !image.fallback);
 const highestQualityImage = nonFallbackImages[nonFallbackImages.length - 1]; // Get the highest quality image

 return (
    <>
      <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.gradient} />
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
        {highestQualityImage && (
     <FullWidthImage
     source={{ uri: highestQualityImage.url }}
     resizeMode="cover"
   />
        )}
        <Text> {concert.name}</Text>
        <Text>Concert Info</Text>
      </ScrollView>
    </>
 );
};

export default Concertinfo;