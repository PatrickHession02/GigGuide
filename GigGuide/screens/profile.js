import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Modal, Button } from 'react-native';
const ProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    
      fetch('https://5b9f-79-140-211-73.ngrok-free.app/profilePic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUri: result.assets[0].uri,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };
  return (
    <LinearGradient colors={['#fc4908', '#fc0366']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.text}>Profile</Text>
        <View style={styles.imageView}>
          <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Text style={styles.addImageText}>Add Image</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center', // Center items along the cross axis
    paddingLeft: 10,
  },
  text: {
    fontSize: 30,
    color: '#fff',
    paddingLeft: 30,
    paddingTop: 20,
    fontWeight: 'bold',
  },
  imageView: {
    flex: 1,
    justifyContent: 'center', // Center items along the main axis
  },
  imageButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#fff',
  },
  addImageText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center', // Center the text
  },
});

export default ProfileScreen;