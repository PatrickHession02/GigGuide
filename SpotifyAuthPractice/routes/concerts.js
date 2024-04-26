const express = require('express');
const router = express.Router();
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const http = rateLimit(axios.create(), { maxRequests: 5, perMilliseconds: 1000 });
const OpenAI = require("openai")
const db = require('./fireStore');

router.get('/', async (req, res) => {
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
                    };
                });
            } else {
                return [];
            }
        });

        console.log('Concert data:', allConcerts);

        const docRef = db.collection('users').doc(userId);
        docRef.set({
            concerts: allConcerts
        }, { merge: true }).then(() => {
            console.log('Concerts saved to Firebase');
            // Log the document snapshot after the update
            docRef.get().then(snapshot => {
                console.log('Updated document snapshot:', snapshot.data());
            });
            // Send the response here
            res.json({ message: 'Concerts saved to Firebase', concerts: allConcerts });
        }).catch(err => {
            console.error('Error saving concerts to Firebase:', err);
            // Send the error response here
            res.status(500).send('Error saving concerts to Firebase');
        });
    
        // Remove this line
        // res.json(allConcerts);
    } catch (error) {
        console.error('Error fetching concerts:', error);
    }
}); // This is the missing closing bracket

module.exports = router;