import React from "react";
import { ScrollView, View, Button, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { usePushNotifications } from "../Notifications/Notifications";
const Settings = ({ triggerPushNotification }) => {
  const { expoPushToken, notification, triggerNotification } =
    usePushNotifications(); // Using the hook here

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH); // Sign out the user
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };
  console.log("expoPushTokenSETTINGS", expoPushToken);
  const sendNotification = async () => {
    if (!expoPushToken) {
      console.error("Token is not yet available");
      return;
    }

    await fetch("https://acba-79-140-211-73.ngrok-free.app/Demonstration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: expoPushToken.data,
      }),
    });
  };

  return (
    <LinearGradient colors={["#fc4908", "#fc0366"]} style={styles.gradient}>
      <SafeAreaView contentContainerStyle={styles.container}>
        <Text style={styles.settingsText}>Settings</Text>
        <View style={styles.lineStyle} />
        <View style={styles.buttonContainer}>
          <View style={styles.redBackground}>
            {/* Logout button */}
            <Button title="Logout" color="#FFFFFF" onPress={handleLogout} />
          </View>
          {/* Blue rectangle background */}
          <View style={styles.blueBackground}>
            {/* Send Notification button */}
            <Button
              title="Send Notification"
              color="#FFFFFF"
              onPress={sendNotification}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  settingsText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingTop: 20,
    paddingLeft: 20,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
    width: "100%",
    marginTop: 10,
    marginBottom: 70,
  },
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    alignItems: "center",
  },

  redBackground: {
    backgroundColor: "#FF0000",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  blueBackground: {
    backgroundColor: "#0000FF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
});

export default Settings;
