require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const app = express();
const port = 3050;

const session = require('express-session');
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if your using https
}));

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

/*
app.get('/login', async (req, res) => {
    try {
        // Check if the user is already logged in by verifying the presence of an access token
        const accessToken = req.session.access_token; // Assuming you're using sessions to store the access token
        if (accessToken) {
            // User is already logged in, redirect them to the home page or do any necessary action
            res.redirect('/concerts'); // Redirect to the home page or any other relevant route
            return;
        }
        // User is not logged in, proceed with the login process
        const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state', 'user-top-read'];
        const redirectUrl = spotifyApi.createAuthorizeURL(scopes);
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error handling login:', error);
        res.status(500).send('Internal Server Error');
    }
});
*/
/*
app.get('/login', (req, res) => {
    // Simulate login logic
    const isLoggedIn = true; // This should be determined by your actual login logic
    if (isLoggedIn) {
        // Set a cookie to indicate the user is logged in
        res.cookie('loggedIn', 'true', { maxAge: 900000, httpOnly: true });
        res.redirect('/concerts');
    } else {
        res.redirect('/login');
    }
});
*/
// Route handler for the callback endpoint after the user has logged in.
app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;

    if (error) {
        console.error(`An error occurred: ${error}`);
        res.redirect('gigguide://login?error=' + encodeURIComponent(error));
    } else {
        spotifyApi.authorizationCodeGrant(code).then(data => {
            const accessToken = data.body['access_token'];
            const refreshToken = data.body['refresh_token'];
            const expiresIn = data.body['expires_in'];

            spotifyApi.setAccessToken(accessToken);
            spotifyApi.setRefreshToken(refreshToken);

            spotifyApi.getMyTopArtists().then(response => {
                const topArtistsData = response.body;
                const topArtists = topArtistsData.items.map(item => item.name);
              
                res.redirect(`gigguide://home?artists=${encodeURIComponent(topArtists.join(','))}`);
            }).catch(err => {
                console.error('Error fetching top artists:', err);
                res.redirect('gigguide://home?error=' + encodeURIComponent('Error fetching top artists. Please try again later.'));
            });
        }).catch(err => {
            console.error('Error exchanging code for access token:', err);
            res.redirect('gigguide://login?error=' + encodeURIComponent('Error exchanging code for access token. Please try again later.'));
        });
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
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
                    const images = event.images.map(image => ({
                        ratio: image.ratio,
                        url: image.url,
                        width: image.width,
                        height: image.height,
                        fallback: image.fallback
                    }));
                    return {
                        name: event.name,
                        date: event.dates.start.localDate,
                        venue: venue,
                        city: city,
                        country: country,
                        images: images
                    };
                });
                
                // Add concerts to the array
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

app.get('/reccomend', (req, res) => {
   const express = require('express')
const router = express.Router()
const OpenAI = require("openai")
const openai = new OpenAI({ apiKey:'aiKey' }) 

router.get('/', (req, res, next) => {
    aiTest()
})

async function aiTest() {
    let currentArtists = topArtists
    let searchPhrases = await createListOfArtists(12, currentArtists)
    console.log('generatedSearchPhrases: ' + searchPhrases.googleSearchPhrases)
    res.send('searchPhrases');
}
async function createListOfArtists(noOfExtraArtists, currentArtistArray) {
    let generatedArray = []
    const currentArtistsJson = JSON.stringify(currentArtistArray)
    try {
        let aiArray = await openai.chat.completions.create({
            messages: [
                { "role": "system", "content": "You are a music connoisseur that appreciates good music." },
                { "role": "assistant", "content": "The following JSON array contains a list of existing musicians: " + currentArtistsJson },
                { "role": "assistant", "content": "We are going to create an array of additional musicians who are sinilar to the existing musicians." },
                { "role": "user", "content": "Create a JSON array called additionalMusicians containing " + noOfExtraArtists + "musicians that are similar to the existing musicians." },
            ],
            response_format: { type: "json_object" },
            model: "gpt-3.5-turbo-1106"
        })
        generatedArray = JSON.parse(aiArray.choices[0].message.content)
    } catch (err) {
        console.log('GPT err createSearchPhrases: ' + err)
    }
    console.log(JSON.stringify(generatedArray))
    return generatedArray
}


exports.routes = router
    });
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
