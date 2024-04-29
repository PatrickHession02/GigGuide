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
    const { token,userId} = req.body;

    if (!userId) {
      return res.status(400).send({ error: 'User ID is undefined' });
    }
    console.log('TOKEN TEST User ID:', userId);
    console.log('Actual Token:', token); // Log the actual token
    console.log('Token Data:', token.data, 'UserId:', userId);
    if (!Expo.isExpoPushToken(token.data)) {
      return res.status(400).send({ error: 'Invalid push token' });
    }

    const userRef = db.collection('users').doc(userId);
    await userRef.set({ token: token.data }, { merge: true });
    req.session.token = token.data;
    // Log that the token was successfully sent to Firestore
    console.log('Token successfully sent to Firestore');
    console.log('Token:', token.data);
    const messages = [{
      to: token.data,
      sound: 'default',
      body: 'New Gig Added',
    }];

    const chunks = expo.chunkPushNotifications(messages);
    const sendPromises = chunks.map(chunk => expo.sendPushNotificationsAsync(chunk));
    await Promise.all(sendPromises);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});
module.exports = router;