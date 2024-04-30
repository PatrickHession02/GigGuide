import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Modal, Button } from "react-native";

const ProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    fetch("https://acba-79-140-211-73.ngrok-free.app/topartists")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTopArtists(data);
        console.log("Top artists:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
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
      // Call the function to send the image to the backend
      sendImageToBackend(result.assets[0].uri);
    }
  };

  const sendImageToBackend = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      const response = await fetch(
        "https://5b9f-79-140-211-73.ngrok-free.app/profilePic",
        {
          method: "POST",
          body: formData,
          headers: {},
        },
      );

      if (response.ok) {
        console.log("Image uploaded successfully!");
      } else {
        console.error("Trouble uploading image:", response.status);
      }
    } catch (error) {
      console.error("Had trouble sending image to backend:", error);
    }
  };
  return (
    <LinearGradient colors={["#fc4908", "#fc0366"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.text}>Profile</Text>
        <View style={styles.imageView}>
          <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.addImageText}>Add Image</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.topArtistsText}>Your Top Artists</Text>
        <View style={styles.horizontalLine} />
        <FlatList
          data={topArtists}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItemContainer}>
              <Text style={styles.artistText}>{item}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalLine: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  listContainer: {
    padding: 10,
    marginTop: 5,
    width: "100%",
  },
  topArtistsText: {
    fontSize: 24,
    color: "#fff",
    paddingLeft: 15,
    paddingTop: 90,
    fontWeight: "bold",
  },

  listItemContainer: {
    backgroundColor: "#fff",
    padding: 30,
    marginVertical: 5,
    borderRadius: 5,
  },
  artistText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 30,
    color: "#fff",
    paddingLeft: 30,
    paddingTop: 20,
    fontWeight: "bold",
  },

  imageView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 50,
  },
  imageButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#fff2",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "#fff",
  },
  addImageText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
});

export default ProfileScreen;
