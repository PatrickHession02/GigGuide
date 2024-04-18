const express = require('express');
const router = express.Router();



router.get('/', async (req, res, next) => {
    console.log('GET /ai was hit');
    const userId = req.query.userId; // Get the user ID from the request query parameters
    if (!userId) {
        return res.status(401).send('UID not available in session');
    }
    const result = await aiTest(req, userId);
    res.json(result);
});

async function aiTest(req, userId) {
    console.log('userId: ai', userId); 
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // Get the top artists from the user data
    let currentArtists = userData.topArtists;
    let searchPhrases = await createListOfArtists(12, currentArtists)// Corrected function name
    console.log('generatedSearchPhrases: ' + searchPhrases.googleSearchPhrases)
}

async function createListOfArtists(noOfExtraArtists, currentArtistArray) {
    let generatedArray = []
    const currentArtistsJson = JSON.stringify(currentArtistArray)
    try {
        let aiArray = await openai.chat.completions.create({
            messages: [
                { "role": "system", "content": "You are a helpful assistant. Please respond in JSON format." },
                { "role": "assistant", "content": "The following JSON array contains a list of existing musicians: " + currentArtistsJson },
                { "role": "assistant", "content": "We are going to create an array of additional musicians who are sinilar to the existing musicians." },
                { "role": "user", "content": "Create a JSON array called additionalMusicians containing " + noOfExtraArtists + "musicians that are similar to the existing musicians." },
            ],
            response_format: { type: "json_object" },
            model: "gpt-3.5-turbo-1106"
        })
        console.log(aiArray); 
        generatedArray = JSON.parse(aiArray.choices[0].message.content)
    } catch (err) {
        console.log('GPT err createSearchPhrases: ' + err)
    }
    console.log(JSON.stringify(generatedArray))
    return generatedArray
}

module.exports = router;