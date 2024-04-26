const express = require('express');
const router = express.Router();

// POST route to update concert name
router.post('/', async (req, res) => {
    try {
        const { userId, concertName } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the concert name field
        user.concert.name = concertName;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Concert name updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;