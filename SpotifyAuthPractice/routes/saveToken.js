
const express = require('express');
const bodyParser = require('body-parser');
const { Expo } = require('expo-server-sdk'); // Import Expo SDK
const router = express.Router();
const app = express();
const expo = new Expo();

router.use(bodyParser.json());

// Endpoint to send notifications
router.post('/', async (req, res) => {
  try {
    const { pushTokens, message } = req.body; // Extract push tokens and message from request body
    console.log('Push Tokens:', pushTokens);
    if (!Expo.isExpoPushToken(pushTokens)) {
      return res.status(400).send({ error: 'Invalid push tokens' });
    }

    const messages = [];
    for (const pushToken of pushTokens) {
      // Construct message for each recipient
      messages.push({
        to: pushToken,
        sound: 'default',
        body: message,
      });
    }

    const chunks = expo.chunkPushNotifications(messages);

    const sendPromises = [];
    for (const chunk of chunks) {
      sendPromises.push(expo.sendPushNotificationsAsync(chunk));
    }

    await Promise.all(sendPromises);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;