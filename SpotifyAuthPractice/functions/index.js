/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { Expo } = require("expo-server-sdk");
const expo = new Expo();
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const { sendNotificationOnNewConcert } = require("./concertNotifications");

exports.sendNotificationOnNewConcert = sendNotificationOnNewConcert;
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
