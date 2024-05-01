import React, { useState, useEffect } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Linking,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Concertinfo = ({ route }) => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    name: "Default Location",
  });
  const [loading, setLoading] = useState(true);
  const { concert } = route.params;
  const lineupSet = new Set(concert.concerts[0].lineup);
  const lineup = Array.from(lineupSet);

  console.log(concert.concerts[0].venue);
  useEffect(() => {
    fetch("http://34.195.218.213:3050/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        venue: concert.concerts[0].venue
          ? concert.concerts[0].venue
          : "Default Location",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          name: data.name,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const styles = StyleSheet.create({
    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: "100%",
    },
    scrollView: {
      width: "100%",
    },
    image: {
      width: "100%",
      height: 400,
      resizeMode: "cover",
    },
    overlay: {
      position: "absolute",
      bottom: 10,
      left: 10,
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 10,
      borderRadius: 5,
    },
    dateContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dateCard: {
      marginTop: 10,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 15,
      margin: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 2,
    },
    dateText: {
      color: "black",
    },
    mapCard: {
      width: "100%",
    },
    map: {
      width: "100%",
      height: 200,
      borderRadius: 20,
    },
    ticketCard: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 30,
      margin: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 2,
      width: "98%",
      marginBottom: 10,
    },
    ticketButtonText: {
      color: "#8d4fbd",
      textAlign: "center",
      fontSize: 20,
      fontWeight: "bold",
    },
    lineupText: {
      color: "#000",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
    },
    lineupCard: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 10,
      margin: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 2,
      marginTop: 10,
      width: "97%",
    },
    lineupTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    venueCard: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 2,
      marginBottom: 10,
      marginLeft: 6,
      width: "97%",
      flexDirection: "row",
      alignItems: "center",
    },
    venueTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    venueText: {
      color: "#000",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 10,
    },
  });

  const allImages =
    concert && Array.isArray(concert.concerts)
      ? concert.concerts.flatMap((concert) => concert.images)
      : [];

  const nonFallbackImages = allImages.filter((image) => !image.fallback);

  nonFallbackImages.sort((a, b) => b.quality - a.quality);

  const highestQualityImage = nonFallbackImages[0];

  return (
    <>
      <LinearGradient colors={["#fc4908", "#fc0366"]} style={styles.gradient} />
      <ScrollView
        contentContainerStyle={{ width: "100%" }}
        style={styles.scrollView}
      >
        <View>
          {!highestQualityImage && (
            <Image
              source={require("../assets/concert9.jpg")}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          {highestQualityImage && (
            <Image
              source={{ uri: highestQualityImage.url }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <Text style={styles.overlay}> {concert.name}</Text>
        </View>
        <View style={styles.dateContainer}>
          {concert.concerts.map((concertItem, index) => {
            return (
              <View key={index}>
                <View style={styles.dateCard}>
                  <Text style={styles.dateText}>
                    {concertItem.date
                      ? new Date(concertItem.date).toLocaleDateString()
                      : "Date not available"}
                  </Text>
                </View>
              </View>
            );
          })}
          <View style={styles.lineupCard}>
            <Text style={styles.lineupTitle}>Lineup:</Text>
            <Text style={styles.lineupText}>{lineup.join(", ")}</Text>
          </View>
          <FlatList
            data={lineup}
            renderItem={({ item, index }) => (
              <Text key={index} style={styles.lineupText}>
                {item}
              </Text>
            )}
            horizontal={true}
          />
        </View>

        <View style={styles.ticketCard}>
          <TouchableOpacity
            onPress={() => Linking.openURL(concert.concerts[0].ticketLink)}
          >
            <View style={styles.ticketButton}>
              <Text style={styles.ticketButtonText}>Purchase Tickets:</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            ...styles.venueCard,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 30,
          }}
        >
          <MaterialCommunityIcons
            name="stadium-variant"
            size={30}
            color="#f55516"
            style={{ marginRight: 26 }}
          />
          <View style={{ flex: 1, alignItems: "center", paddingRight: 80 }}>
            <Text style={styles.venueTitle}>Venue:</Text>
            <Text style={styles.venueText}>{concert.concerts[0].venue}</Text>
          </View>
        </View>
        <View style={styles.mapCard}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              scrollEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.name}
              />
            </MapView>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Concertinfo;
