// Load environment variables from the .env file.
require('dotenv').config();

// Import the necessary modules.
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

// Initialize an Express application.
const app = express();
// Define the port number on which the server will listen.
const port = 3050;

// Initialize the Spotify API with credentials from environment variables.
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL
});

// Route handler for the login endpoint.
app.get('/login', (req, res) => {
    // Define the scopes for authorization; these are the permissions we ask from the user.
    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state', 'user-top-read']; // Add 'user-top-read' scope for top artists
    // Redirect the client to Spotify's authorization page with the defined scopes.
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

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

        // Set the access token and refresh token on the Spotify API object.
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        // Now you can use the access token to get the user's top artists.
        spotifyApi.getMyTopArtists().then(response => {
            const topArtistsData = response.body;
            const topArtists = topArtistsData.items.map(item => ({
              name: item.name,
              // Add other properties as needed
            }));
          
            // Send the top artists data to the client after mapping
            res.send(topArtists);
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

// Start the server.
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
