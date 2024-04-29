const express = require('express');
const router = express.Router();
const db = require('./fireStore');
const admin = require('firebase-admin'); // Import Firebase Admin SDK

router.post('/', async (req, res) => {
    const userId = req.session.userId;
    console.log("Notification TEST" ,userId);

    const userRef = db.collection('users').doc(userId);

    userRef.update({
        concerts: admin.firestore.FieldValue.arrayUnion('test') // Add "test" to the "concerts" array
    })
    .then(() => {
        console.log('Test added to concerts in user document');
        res.json({ message: 'Test added to concerts in user document' });
    })
    .catch(err => {
        console.error('Error adding test to concerts in user document:', err);
        res.status(500).send('Error adding test to concerts in user document');
    });
});


module.exports = router;