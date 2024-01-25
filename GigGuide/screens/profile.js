import React from 'react';
import { ScrollView, Text, StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from 'react-native-elements';

class Profile extends React.Component {
  state = {
    search: '',
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <LinearGradient colors={['#8E00FD', '#FF000F']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <SearchBar
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            value={search}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
          />
          <Text>Profile</Text>
          <View style={styles.horizontalLine} />
          <View style={styles.profileContainer}>
            <View style={styles.profilePictureContainer}>
              <Image
                source={require('../assets/ProfilePicExample.png')} // Replace with the actual path to your profile picture
                style={styles.profilePicture}
              />
            </View>
            <Text style={styles.usernameText}>Username</Text>
          </View>
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
    marginRight: 20,
    alignItems: 'center',
  },
  profilePicture: {
    width: 80, // Adjust the size of the profile picture
    height: 80,
    borderRadius: 40, // Make it circular
  },
  usernameText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Profile;
