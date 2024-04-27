const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
  const imageUri = req.body.imageUri;

  res.json({ message: 'Image URI received' });
});

module.exports = router;