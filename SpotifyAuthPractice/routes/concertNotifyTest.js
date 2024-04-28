const express = require('express');
const router = express.Router();
const db = require('./fireStore');
const admin = require('firebase-admin'); // Import Firebase Admin SDK

router.post('/', async (req, res) => {
    const userId = req.session.userId;
    console.log("Notification TEST" ,userId);

    // Get a reference to the user's document
    const userRef = db.collection('users').doc(userId);

    // Increment the "test" field in the user's document
    userRef.update({
        test: admin.firestore.FieldValue.increment(1) // Increment the "test" field by 1
    })
    .then(() => {
        console.log('Test field incremented in user document');
        res.json({ message: 'Test field incremented in user document' });
    })
    .catch(err => {
        console.error('Error incrementing test field in user document:', err);
        res.status(500).send('Error incrementing test field in user document');
    });
});

module.exports = router;