const express = require("express");
const bodyParser = require("body-parser");
const { Expo } = require("expo-server-sdk");
const db = require("./fireStore");
const router = express.Router();
const app = express();
const expo = new Expo();

router.use(bodyParser.json());
router.post("/", async (req, res) => {
  try {
    console.log("Accessed saveToken");
    const { token } = req.body;
    if (!Expo.isExpoPushToken(token)) {
      return res.status(400).send({ error: "Invalid push token" });
    }
    const messages = [
      {
        to: token,
        sound: "default",
        body: "New Gig Added",
        data: {
          imageUrl:
            "https://img.freepik.com/free-vector/red-live-neon-sign-vector_53876-61394.jpg?size=338&ext=jpg&ga=GA1.1.553209589.1714262400&semt=sph",
        },
      },
    ];

    const chunks = expo.chunkPushNotifications(messages);
    const sendPromises = chunks.map((chunk) =>
      expo.sendPushNotificationsAsync(chunk),
    );
    await Promise.all(sendPromises);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
//This is for demonstartion purposes as  expo push notifications are not consistent.

module.exports = router;
