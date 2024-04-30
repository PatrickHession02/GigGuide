const express = require("express");
const bodyParser = require("body-parser");
const { Expo } = require("expo-server-sdk");
const db = require("./fireStore");
const router = express.Router();
const app = express();
const expo = new Expo();

router.use(bodyParser.json());

router.post("/", (req, res, next) => {
  console.log("Accessed realTimeListeners");
  const userId = req.body.userId;
  const token = req.body.token;
  console.log("UserId:", userId);
  console.log("Token:", token); // Logging  the token
  if (!userId) {
    console.error("User ID is not set in the session");
    return res.status(400).send({ error: "User ID is required" });
  }
  const usersCollectionRef = db.collection("users");
  const concertsFieldRef = usersCollectionRef
    .doc(userId)
    .collection("concerts");
  concertsFieldRef.onSnapshot((snapshot) => {
    console.log("Snapshot:", snapshot);
    snapshot.docChanges().forEach((change) => {
      console.log("Change:", change);
      if (change.type === "added") {
        console.log("New document added, sending notification...");
        // Create the message
        const message = {
          to: token,
          sound: "default",
          body: "New concert added!",
          data: { concert: change.doc.data() },
        };

        if (!Expo.isExpoPushToken(message.to)) {
          console.error(
            `Push token ${message.to} is not a valid Expo push token`,
          );
          return;
        }

        // Send the notification
        const chunks = expo.chunkPushNotifications([message]);
        (async () => {
          for (const chunk of chunks) {
            try {
              const receipts = await expo.sendPushNotificationsAsync(chunk);
              console.log(receipts);
            } catch (error) {
              console.error(error);
            }
          }
        })();
      }
    });
  });
});

module.exports = router;
