require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const sessionSecret = process.env.SESSION_KEY;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gigguide-b3d86.firebaseio.com", //here is the config for my firebase config fro my database
});

const db = admin.firestore();

module.exports = db;
