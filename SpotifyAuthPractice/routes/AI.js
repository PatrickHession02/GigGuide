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