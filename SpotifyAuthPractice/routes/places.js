const express = require('express');
const axios = require('axios');
const router = express.Router();

// Add this line to your server code to use the express.json() middleware
router.use(express.json());

router.post('/', async (req, res) => {
  const { venue } = req.body; // Change this line
  console.log(`Venue: ${venue}`); // Log the venue

  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${venue}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${process.env.GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await axios.get(url);
    console.log(response.data); // Log the response data
    res.json(response.data);
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;