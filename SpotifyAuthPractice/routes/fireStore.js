require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const sessionSecret = process.env.SESSION_KEY;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gigguide-b3d86.firebaseio.com' // Replace 'gigguide-b3d86' with your Firebase project ID
});

const db = admin.firestore();


module.exports = db;