const express = require('express');
const router = express.Router();
require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const sessionSecret = process.env.SESSION_KEY;
const rateLimit = require('axios-rate-limit');
const http = rateLimit(axios.create(), { maxRequests: 5, perMilliseconds: 1000 });
const OpenAI = require("openai")
const openai = new OpenAI(process.env.OPENAI_API_KEY)
const db = require('./fireStore');

async function aiTest(req, userId) {
    console.log('userId: ai', userId); 
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // Get the top artists from the user data
    let currentArtists = userData.topArtists; //here is where i get the top artists
    let searchPhrases = await createListOfArtists(20, currentArtists)// Corrected function name
    console.log('generatedSearchPhrases: ' + searchPhrases.googleSearchPhrases)

    // Return the generated list of artists
    return searchPhrases.allConcerts;
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
                { "role": "system", "content": "You are a helpful music enjoyer. Please respond in JSON format." },
                { "role": "assistant", "content": "The following JSON array contains a list of existing musicians: " + currentArtistsJson },
                { "role": "assistant", "content": "We are going to generate an array of additional musicians who are different but have a similar style, genre, or era to the existing musicians." },
                { "role": "assistant", "content": "To ensure diversity, we'll exclude artists already present in your 'topArtists' array." },
                { "role": "user", "content": "Create a JSON array called 'additionalMusicians' containing " + noOfExtraArtists + " musicians. These musicians should be similar to the existing musicians in style, genre, or era, but they should not be already included in the 'topArtists' array." },
            ],
            response_format: { type: "json_object" },
            model: "gpt-4-turbo"
        })
        console.log(aiArray); 
        let parsedContent = JSON.parse(aiArray.choices[0].message.content);
        generatedArray = parsedContent.additionalMusicians || [];
        console.log("Current Artists Array:", currentArtistArray);
        console.log("Generated Array (before filtering):", generatedArray);
        //Hozier only appearing twice because lord huron apppearing in my top artists and they are supporting Hozier
        let filteredArray = generatedArray.filter(artist => {
            let artistLower = artist.toLowerCase();
            return !currentArtistArray.some(currentArtist => currentArtist.toLowerCase() === artistLower);
        });
        
        console.log("Generated Array (after filtering):", filteredArray);
    } catch (err) {
        console.log('GPT err createSearchPhrases: ' + err)
    }
    console.log(JSON.stringify(generatedArray))

    const artistPromises = generatedArray.map(artist => {
        return http.get('https://app.ticketmaster.com/discovery/v2/events.json', {
            params: {
                apikey: process.env.TICKETMASTER_API_KEY,
                keyword: artist,
                countryCode: 'IE' 
            }
        }).catch(error => {
            console.error(`Error fetching events for artist ${artist}:`, error);
            return { data: { _embedded: { events: [] } } }; // Return empty events if request fails
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
                    lineup: lineup, 
                    ticketLink: ticketLink, 
                };
            });
        } else {
            return [];
        }
    });
    
    // Log the allConcerts array
    console.log(allConcerts);
    
    return { generatedArray, allConcerts };
}

module.exports = router;