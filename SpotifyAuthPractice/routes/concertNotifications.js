const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');
const db = require('./fireStore');

const { sendNotificationOnNewConcert } = require('./concertNotifications');
exports.sendNotificationOnNewConcert = functions.firestore
  .document('User/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if a new concert was added
    if (before.concert.length < after.concert.length) {
      const message = {
        to: after.token,
        sound: 'default',
        body: `New concert added: ${after.concert[after.concert.length - 1]}`,
      };

      const chunks = expo.chunkPushNotifications([message]);
      const sendPromises = chunks.map(chunk => expo.sendPushNotificationsAsync(chunk));
      await Promise.all(sendPromises);
    }
  });