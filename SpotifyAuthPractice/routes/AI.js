const express = require('express');
const router = express.Router();
require('dotenv').config();
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
const db = require('./fireStore');

async function aiTest(req, userId) {
    console.log('userId: ai', userId); 
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // Get the top artists from the user data
    let currentArtists = userData.topArtists;
    let searchPhrases = await createListOfArtists(12, currentArtists)// Corrected function name
    console.log('generatedSearchPhrases: ' + searchPhrases.googleSearchPhrases)

    // Return the generated list of artists
    return searchPhrases;
}

router.get('/', async (req, res, next) => {
    const userId = req.session.userId;
    console.log('GET /ai was hit');
    console.log('Received user ID: ', userId);
    if (!userId) {
        return res.status(401).send('UID not available in session');
    }
    const result = await aiTest(req, userId);

    // Send the generated list of artists as a response
    res.json(result);
});

async function createListOfArtists(noOfExtraArtists, currentArtistArray) {
    let generatedArray = []
    const currentArtistsJson = JSON.stringify(currentArtistArray)
    try {
        let aiArray = await openai.chat.completions.create({
            messages: [
                { "role": "system", "content": "You are a helpful assistant. Please respond in JSON format." },
                { "role": "assistant", "content": "The following JSON array contains a list of existing musicians: " + currentArtistsJson },
                { "role": "assistant", "content": "We are going to create an array of additional musicians who are sinilar to the existing musicians." },
                { "role": "user", "content": "Create a JSON array called additionalMusicians containing " + noOfExtraArtists + "musicians that are similar to the existing musicians but not included in the existing list." },
            ],
            response_format: { type: "json_object" },
            model: "gpt-3.5-turbo-1106"
        })
        console.log(aiArray); 
        generatedArray = JSON.parse(aiArray.choices[0].message.content)

        generatedArray = generatedArray.filter(artist => !currentArtistArray.includes(artist));
    } catch (err) {
        console.log('GPT err createSearchPhrases: ' + err)
    }
    console.log(JSON.stringify(generatedArray))
    return generatedArray
}

module.exports = router;