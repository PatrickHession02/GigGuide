import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import {
  useAutoDiscovery,
  useAuthRequest,
  makeRedirectUri,
} from "expo-auth-session";
import { SafeAreaView } from "react-native-safe-area-context";
import { SimpleLineIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
WebBrowser.maybeCompleteAuthSession();

const HomeScreen = ({ uid }) => {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const discovery = useAutoDiscovery("https://accounts.spotify.com");
  const [concertsData, setConcertsData] = useState([]);
  const [location, setLocation] = useState(null);

  const redirectUri = makeRedirectUri({
    scheme: "gigguide",
    path: "redirect",
    useProxy: true,
  }); //used to fix problem with redirect uri after signing in

  console.log("Redirect URI:", redirectUri); //debugging

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log("Location", location);
      } catch (error) {
        console.error("Error getting location", error);
      }
    })();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "736a5838698041a6bcfb852f8ee1a6ab",
      scopes: ["user-read-email", "playlist-modify-public", "user-top-read"],
      usePKCE: false,
      redirectUri,
    },
    discovery,
  );

  const [handleLogin, setHandleLogin] = useState(() => async () => {});

  useEffect(() => {
    setHandleLogin(() => async () => {
      setIsLoading(true);
      try {
        const result = await promptAsync();
        if (result.type === "success") {
          const code = result.params.code;
          console.log("Authorization Code: ", code);
          console.log("UID2: ", uid);
          const responseCallback = await fetch(
            "http://34.195.218.213:3050/redirect",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code, uid }),
            },
          );
          if (!responseCallback.ok) {
            console.error("Failed to send code to backend");
            return;
          }

          const dataCallback = await responseCallback.json();
          console.log("Received data from backend", dataCallback);
          const topArtists = dataCallback.topArtists;
          console.log("Top artists:", topArtists);
          // Then fetch to /concerts
          const responseConcerts = await fetch(
            "http://34.195.218.213:3050/concerts",
          );
          const dataConcerts = await responseConcerts.json();
          console.log("Fetched data:", dataConcerts);
          if (!dataConcerts || !dataConcerts.concerts) {
            console.error("Fetched data is undefined");
            return;
          }
          const groupedData = dataConcerts.concerts.reduce((acc, concert) => {
            console.log("Current concert:", concert);
            const artistIndex = acc.findIndex(
              (artist) => artist.name === concert.name,
            );
            if (artistIndex !== -1) {
              acc[artistIndex].concerts.push(concert);
            } else {
              acc.push({ name: concert.name, concerts: [concert] });
            }
            return acc;
          }, []);
          setConcertsData(groupedData);
        }
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
      setIsLoading(false);
    });
  }, [uid, promptAsync]);

  const handleConcertPress = (concert) => {
    navigation.navigate("Concertinfo", { concert, location });
  };

  const renderItem = ({ item: concert }) => {
    const firstConcert = concert.concerts[0];
    return (
      <TouchableOpacity onPress={() => handleConcertPress(concert)}>
        <View style={styles.concertContainer}>
          {firstConcert.images && firstConcert.images.length > 0 && (
            <View style={styles.imageContainer}>
              <Image
                style={styles.concertImage}
                source={{ uri: firstConcert.images[0].url }}
              />
              <Text style={styles.concertName}>{firstConcert.name}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  console.log("Concerts Data:", concertsData);

  return (
    <LinearGradient colors={["#fc4908", "#fc0366"]} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        {concertsData.length === 0 && (
          <View style={styles.loginContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <SimpleLineIcons
                  style={styles.spotifyLogo}
                  name="social-spotify"
                  size={24}
                  color="white"
                />
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              {isLoading && (
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  style={{ marginTop: 10 }}
                />
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
      {concertsData.length > 0 && (
        <Text style={styles.greetingText}>{getGreeting()}</Text>
      )}
      <FlatList
        contentContainerStyle={styles.scrollViewContainer}
        data={concertsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBarInputContainer: {
    backgroundColor: "#fff",
  },
  scrollViewContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  concertContainer: {
    width: 400,
    height: 300,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
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
    borderColor: "#f205e2",
  },
  concertName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 80,
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  concertImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: "#1DB954",
    borderRadius: 20,
    padding: 20,
    paddingVertical: 25,
    paddingHorizontal: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
  spotifyLogo: {
    position: "absolute",
    width: 30,
    height: 30,
    left: "50%",
  },
});

export default HomeScreen;
