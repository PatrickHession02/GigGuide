import { initializeApp } from 'firebase/app';
import {getDatabase, ref, set,get, child} from 'firebase/database';



require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const sessionSecret = process.env.SESSION_KEY;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gigguide-b3d86.firebaseio.com' // Replace 'gigguide-b3d86' with your Firebase project ID
});

const db = admin.firestore();

export const saveToken = async (uid, accessToken, refreshToken, expiresIn) => {
    const docRef = db.collection('users').doc(uid);
    await docRef.set({
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn
    });
};

module.exports = db;