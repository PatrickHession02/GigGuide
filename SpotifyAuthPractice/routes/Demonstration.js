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
    console.log('Accessed saveToken');  
    const { token } = req.body;
    if (!Expo.isExpoPushToken(token)) {
        return res.status(400).send({ error: 'Invalid push token' });
      }
      const messages = [{
        to: token,
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