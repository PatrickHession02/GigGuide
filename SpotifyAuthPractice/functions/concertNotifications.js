const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');
const functions = require('firebase-functions');
admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();
exports.sendNotificationOnNewConcert = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if before and after data exist and concerts is an array
    if (before && after && Array.isArray(before.concerts) && Array.isArray(after.concerts) && before.concerts.length < after.concerts.length) {
      console.log(`Token: ${after.token}`); // Log the token

      const message = {
        to: after.token,
        sound: 'default',
        body: `New concert added: ${after.concerts[after.concerts.length - 1]}`,
      };

      const chunks = expo.chunkPushNotifications([message]);
      const sendPromises = chunks.map(chunk => expo.sendPushNotificationsAsync(chunk));
      await Promise.all(sendPromises);

      // Log a message when a new concert is added and a notification is sent
      console.log(`New concert ADDED FROM TEST: ${after.concerts[after.concerts.length - 1]}. Notification sent.`);
    }
  });