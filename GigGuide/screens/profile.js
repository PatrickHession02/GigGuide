// Import necessary React and React Native components
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const profile = () => {
  const navigation = useNavigation();

  const handleEditProfile = () => {
    // Navigate to the EditProfile screen (assuming you have set it up)
    navigation.navigate('EditProfile');
  };

  return (
    <View style={styles.container}>
      {/* User Profile Picture */}
      <Image
        source={{ uri: 'https://placekitten.com/200/200' }} // Replace with your actual profile picture URL
        style={styles.profilePicture}
      />

      {/* User Information */}
      <View style={styles.userInfo}>
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  editProfileButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default profile;
