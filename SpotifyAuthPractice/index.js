require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const app = express();
const port = 3050;

// Initialize the Spotify API with credentials from environment variables.
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL,
    ticketmasterApiKey: process.env.TICKETMASTER_API_KEY,
    aiKey: process.env.OPEN_AI_KEY
});

// Rate limiting parameters
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
let lastRequestTime = 0;

// Function to delay requests based on rate limit
async function delayRequest() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();
}

// Route handler for the login endpoint.
app.get('/login', (req, res) => {
    // Define the scopes for authorization; these are the permissions we ask from the user.
    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state', 'user-top-read']; // Add 'user-top-read' scope for top artists
    // Redirect the client to Spotify's authorization page with the defined scopes.
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// Route handler for the callback endpoint after the user has logged in.
// Route handler for the callback endpoint after the user has logged in.
app.get('/callback', (req, res) => {
    // Extract the error, code, and state from the query parameters.
    const error = req.query.error;
    const code = req.query.code;

    // If there is an error, log it and send a response to the user.
    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    // Exchange the code for an access token and a refresh token.
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
          
            // Redirect to your app with the top artists as query parameters
            res.redirect(`gigguide://callback?artists=${encodeURIComponent(topArtists.join(','))}`);
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

// Route handler for fetching concerts from Ticketmaster API
app.get('/concerts', async (req, res) => {
    try {
        // Extract artists from query parameters
        const artistsParam = req.query.artists;
        if (!artistsParam) {
            throw new Error('No artists provided');
        }
        const artists = artistsParam.split(',');
        
        // Log the artists being searched for
        console.log('Searching for concerts of artists:', artists);
        
        // Array to store concert data for all artists
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
                    /*const images = event.images.map(image => ({
                        ratio: image.ratio,
                        url: image.url,
                        width: image.width,
                        height: image.height,
                        fallback: image.fallback 
                    }));*/
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

        // Send the combined concerts data as JSON
        res.json(allConcerts);
    } catch (error) {
        // Log the error
        console.error('Error fetching concerts:', error);
        // Send error response
        res.status(500).json({ error: error.message });
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
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});