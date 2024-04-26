const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');

admin.initializeApp();
const expo = new Expo();

exports.sendNotificationOnNewConcert = functions.firestore
  .document('concerts/{concertId}')
  .onCreate(async (snap, context) => {
    const concert = snap.data();

    // Fetch all tokens from your database
    // This is just a placeholder, replace it with your actual code to fetch tokens
    const tokens = await fetchTokens();

    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      body: `New concert added: ${concert.name}`,
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const sendPromises = chunks.map(chunk => expo.sendPushNotificationsAsync(chunk));
    await Promise.all(sendPromises);
  });