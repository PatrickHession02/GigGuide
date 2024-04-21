import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';
import { FIREBASE_AUTH } from '../FirebaseConfig';
class Profile extends React.Component {
  state = {
    search: '',
    profilePicUrl: null,
  };

  componentDidMount() {
    FIREBASE_AUTH.onAuthStateChanged((user) => {
      console.log(user); // Add this line
      if (user) {
        this.setState({ profilePicUrl: user.photoURL });
      }
    });
  }


  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search, profilePicUrl } = this.state;

    return (
      <LinearGradient>
      <ScrollView>
        <View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.usernameText}>Username</Text>
            <Text style={styles.friendsText}>Friends</Text>
            <Text style={styles.followedText}>Artists Followed</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Concert Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Reviews</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separatorLine} />
      </ScrollView>
    </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 0,
    width: '100%',
  },
  searchBarInputContainer: {
    backgroundColor: '#fff',
  },
  horizontalLine: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    width: '100%',
    marginVertical: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profilePictureContainer: {
    marginRight: 125,
    alignItems: 'center',
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  usernameText: {
    color: '#fff',
    fontSize: 18,
  },
  friendsText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  followedText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  profileHeaderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#8E00FD',
    fontSize: 16,
  },
  separatorLine: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    width: '100%',
    marginVertical: 10,
  },
});

export default Profile;
