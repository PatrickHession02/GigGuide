const express = require('express');
const router = express.Router();
const db = require('./fireStore');
const admin = require('firebase-admin'); // Import Firebase Admin SDK

router.post('/', async (req, res) => {
    const userId = req.session.userId;
    console.log("Notification TEST" ,userId);

    // Get a reference to the user's document
    const userRef = db.collection('users').doc(userId);

    // Add the "Test" concert to the "concerts" array in the user's document
    userRef.update({
        concerts: admin.firestore.FieldValue.arrayUnion({ Test: 'Some value' }) // Replace 'Some value' with the value you want to store
    })
    .then(() => {
        console.log('Test concert added to user document');
        res.json({ message: 'Test concert added to user document' });
    })
    .catch(err => {
        console.error('Error adding Test concert to user document:', err);
        res.status(500).send('Error adding Test concert to user document');
    });
});

module.exports = router;