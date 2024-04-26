const express = require('express');
const bodyParser = require('body-parser');
const { Expo } = require('expo-server-sdk');
const db = require('./fireStore');
const router = express.Router();
const app = express();
const expo = new Expo();

router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const { token, userId } = req.body;
    console.log('Token:', token, 'UserId:', userId);
    if (!Expo.isExpoPushToken(token.data)) {
      return res.status(400).send({ error: 'Invalid push token' });
    }

    // Save the token to Firestore
    const userRef = db.collection('users').doc(userId);
    await userRef.set({ token: token.data }, { merge: true });
    
    // Log that the token was successfully sent to Firestore
    console.log('Token successfully sent to Firestore');

    const messages = [{
      to: token.data,
      sound: 'default',
      body: 'Welcome to GigGuide',
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