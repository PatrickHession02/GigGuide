const express = require('express');

const router = express.Router();

// Route to handle image upload
router.post('/', (req, res) => {

    res.json({ message: 'Image uploaded successfully' });
});

module.exports = router;