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
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://</gigguide-b3d86>.firebaseio.com'
});

const db = admin.firestore();
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
const session = require('express-session');

app.use(session({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false } // Note: In production, set this to true and ensure your app uses HTTPS
}));

app.post('/callback', express.json(), (req, res) => {
    const code = req.body.code;
    const uid = req.body.uid;
    console.log('Received code:', code);
    console.log('Received UID:', uid);
    req.session.userId = req.body.uid;

    req.session.save(err => {
        if (err) {
            console.error('Error saving session:', err);
            return res.status(500).send('Error saving session.');
        }
        res.redirect('/concerts');
    });

    // Pass the code to the /callback endpoint
    req.code = code;

    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expiresIn = data.body['expires_in'];
        console.log('Access token:', accessToken);
        // Set the access token and refresh token on the Spotify API object.
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        // Now you can use the access token to get the user's top artists.
        spotifyApi.getMyTopArtists().then(response => {
            const topArtistsData = response.body;
            const topArtists = topArtistsData.items.map(item => item.name);
            console.log('Top artists:', topArtists);

            // Save the top artists to the Firebase database
            const docRef = db.collection('users').doc(uid);  // Replace 'uid' with the user's ID
            docRef.set({
                topArtists: topArtists
            }).then(() => {
                console.log('Top artists saved to Firebase');
                req.session.userId = uid;
            }).catch(err => {
                console.error('Error saving top artists to Firebase:', err);
            });
        }).catch(err => {
            // Handle errors here
            console.error('Error fetching top artists:', err);
            res.send('Error fetching top artists. Please try again later.');
        });
    }).catch(err => {
        console.error('Error exchanging code for access token:', err);
        res.send('Error exchanging code for access token. Please try again later.');
    });
}); 
 // This is the correct closing bracket
app.get('/concerts', async (req, res) => {
    console.log('Session:', req.session);
    console.log('Accessed /concerts endpoint');
    try {
        const userId = req.session.userId; 
        if (!userId) {
            return res.status(401).send('You must authenticate first.');
        }
        console.log('User ID CONCERTS:', userId);
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const artists = userData.topArtists;
        console.log('TOP ARTISTS CONCERTS/!!!!:', artists);

        const artistPromises = artists.map(artist => {
            return http.get('https://app.ticketmaster.com/discovery/v2/events.json', {
                params: {
                    apikey: process.env.TICKETMASTER_API_KEY,
                    keyword: artist,
                    countryCode: 'IE' // Filter for Ireland
                }
            });
        });

        const responses = await Promise.all(artistPromises);

        const allConcerts = responses.flatMap(response => {
            if (response.data._embedded && response.data._embedded.events && response.data._embedded.events.length > 0) {
                return response.data._embedded.events.map(event => {
                    const venue = event._embedded && event._embedded.venues && event._embedded.venues[0] ? event._embedded.venues[0].name : 'Unknown Venue';
                    const city = event._embedded && event._embedded.venues && event._embedded.venues[0] ? event._embedded.venues[0].city.name : 'Unknown City';
                    const country = event._embedded && event._embedded.venues && event._embedded.venues[0] ? event._embedded.venues[0].country.name : 'Unknown Country';
                    const images = event.images ? event.images : [];
                    return {
                        name: event.name,
                        date: event.dates.start.localDate,
                        venue: venue,
                        city: city,
                        country: country,
                        images: images,
                    };
                });
            } else {
                return [];
            }
        });

        console.log('Concert data:', allConcerts);
        res.json(allConcerts);
    } catch (error) {
        console.error('Error fetching concerts:', error);
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});