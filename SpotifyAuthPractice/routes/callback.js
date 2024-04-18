const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const admin = require('firebase-admin');
const rateLimit = require('axios-rate-limit');
const http = rateLimit(axios.create(), { maxRequests: 5, perMilliseconds: 1000 });




router.post('/', express.json(), (req, res) => {
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
        spotifyApi.getMyTopArtists({ limit: 30 }).then(response => {
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

module.exports = router;