require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const app = express();
const port = 3050;
const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://</gigguide-b3d86>.firebaseio.com'
});

const db = admin.firestore();

// Initialize the Spotify API with credentials from environment variables.
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL,
    ticketmasterApiKey: process.env.TICKETMASTER_API_KEY,
    aiKey: process.env.OPEN_AI_KEY
});

app.post('/callback', express.json(), (req, res) => {
    const code = req.body.code;
    const uid = req.body.uid;
    console.log('Received code:', code);
    console.log('Received UID:', uid);
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
app.get('/concerts', async (req, res) => {
    console.log('Accessed /concerts endpoint');
    try {
      
        const allConcerts = [];

        // Loop through each artist and make separate API calls to Ticketmaster
        for (const artist of artists) {
            await delayRequest(); // Apply rate limiting
            
            // Make API call to Ticketmaster API with artist as search keyword
            const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
                params: {
                    apikey: process.env.TICKETMASTER_API_KEY,
                    keyword: artist,
                    countryCode: 'IE' // Filter for Ireland
                }
            });

            // Check if events are found
            if (response.data._embedded && response.data._embedded.events && response.data._embedded.events.length > 0) {
                // Extract relevant data from response
                const concerts = response.data._embedded.events.map(event => {
                    const venue = event._embedded && event._embedded.venues && event._embedded.venues[0] ? event._embedded.venues[0].name : 'Unknown Venue';
                    const city = event._embedded && event._embedded.venues && event._embedded.venues[0] ? event._embedded.venues[0].city.name : 'Unknown City';
                    const country = event._embedded && event._embedded.venues && event._embedded.venues[0] ? event._embedded.venues[0].country.name : 'Unknown Country';
                    /*
                    const images = event.images.map(image => ({
                        ratio: image.ratio,
                        url: image.url,
                        width: image.width,
                        height: image.height,
                        fallback: image.fallback 
                    }));
*/
                    return {
                        name: event.name,
                        date: event.dates.start.localDate,
                        venue: venue,
                        city: city,
                        country: country,
                       /* images: images*/
                    };
                });
                
                allConcerts.push(...concerts);
            }
        }
        console.log('Concert data:', allConcerts);
        // Send the combined concerts data as JSON
        res.json(allConcerts);
    } catch (error) {
        // Log the error
        console.error('Error fetching concerts:', error);
        // Send error response
        //res.status(500).json({ error: error.message });
    }
});
/*
app.get('/reccomend', (req, res) => {
   const express = require('express')
   const router = express.Router()
   const OpenAI = require("openai")
   const openai = new OpenAI({ apiKey:'aiKey' }) 

   router.get('/', (req, res, next) => {
       aiTest()
   })

   exports.routes = router
});
*/

app.get('/test', async (req, res) => {
    // Write some data to Firestore
    const docRef = db.collection('testCollection').doc('testDoc');
    await docRef.set({
      testField: 'testValue'
    });
  
    // Read the data back
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
    }
  
    res.send('Check the console for the test results.');
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});