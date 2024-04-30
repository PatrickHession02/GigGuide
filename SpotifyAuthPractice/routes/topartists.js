const express = require("express");
const router = express.Router();
const db = require("./fireStore");

router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    const doc = await db.collection("users").doc(userId).get();

    if (!doc.exists) {
      res.status(404).send("No such user!");
      return;
    }

    const user = doc.data();
    const topArtists = user.topArtists || [];

    res.json(topArtists);
    console.log("Top PROFILE ARTISTS:", topArtists);
  } catch (error) {
    res.status(500).send(error);
  }
});
//Top artist code to send to profile screen

module.exports = router;
