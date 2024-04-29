require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const app = express();
const port = 3050;
const admin = require('firebase-admin');
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const sessionSecret = process.env.SESSION_KEY;
const rateLimit = require('axios-rate-limit');
const http = rateLimit(axios.create(), { maxRequests: 5, perMilliseconds: 1000 });
const OpenAI = require("openai")
const openai = new OpenAI(process.env.OPENAI_API_KEY)
const session = require('express-session');
const db = require('./routes/fireStore');
const { Expo } = require('expo-server-sdk');
let expo = new Expo();
app.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } // Note: In production, set this to true and ensure your app uses HTTPS
}));

function delayRequest() {
    return new Promise(resolve => setTimeout(resolve, 1000)); // Delay of 1 second
}

// Initialize the Spotify API with credentials from environment variables.
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL,
    ticketmasterApiKey: process.env.TICKETMASTER_API_KEY,
    aiKey: process.env.OPEN_AI_KEY
});

const callbackRouter = require('./routes/redirect');
const concertRouter = require('./routes/concerts');
const aiRouter = require('./routes/AI');
const notificationsRouter = require('./routes/saveToken');
const testRouter = require('./routes/concertNotifyTest');
const profilePicRouter = require('./routes/profilePic');
const placesRouter = require('./routes/places');



app.use('/redirect' ,callbackRouter);
app.use('/concerts' ,concertRouter);
app.use('/AI' ,aiRouter);
app.use('/saveToken', notificationsRouter);
app.use('/concertNotifyTest',testRouter);
app.use('/profilePic', profilePicRouter); 
app.use('/places', placesRouter);
async function sendNotification(data) {
    // You need to replace this with a valid token
    const token = 'zgQCd9BqjGc1sX4XFqiJfVe0nFM2'; 
    
if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${token} is not a valid Expo push token`);
    return;
}
    console.log('REALTIMEToken:', token);
    const notification = [{
        to: token, // Use the token from the session
        sound: 'default',
        body: 'New Concert added',
    }];

    const chunks = expo.chunkPushNotifications(notification);
    const sendPromises = chunks.map(chunk => expo.sendPushNotificationsAsync(chunk));
    await Promise.all(sendPromises);

    console.log({ success: true });
}

app.use((req, res, next) => {
    const userId = req.session.userId;
    if (!userId) {
        console.error('User ID is not set in the session');
        return next();
    }
    const usersCollectionRef = db.collection('users');
    const concertsFieldRef = usersCollectionRef.doc(userId).collection('concerts');


    concertsFieldRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                // Send a notification when new data is added to the concerts field
                sendNotification(change.doc.data());
            }
        });
    });

    next();
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});