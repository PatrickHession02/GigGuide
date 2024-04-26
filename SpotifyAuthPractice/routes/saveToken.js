const express = require('express');
const bodyParser = require('body-parser');
const { Expo } = require('expo-server-sdk'); // Import Expo SDK
const router = express.Router();
const app = express();
const expo = new Expo();

router.use(bodyParser.json());

// Endpoint to save tokens
router.post('/', async (req, res) => {
  try {
    const { token, userId } = req.body; // Extract token and userId from request body
    console.log('Token:', token, 'UserId:', userId);
    if (!Expo.isExpoPushToken(token.data)) {
      return res.status(400).send({ error: 'Invalid push token' });
    }

    // Save the token here
    // You need to implement your own logic to save the token
    // For example, you can save it to a database
    const messages = [{
      to: token.data,
      sound: 'default',
      body: 'This is a test notification',
    }];

    const chunks = expo.chunkPushNotifications(messages);
    const sendPromises = chunks.map(chunk => expo.sendPushNotificationsAsync(chunk));
    await Promise.all(sendPromises);
    
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;