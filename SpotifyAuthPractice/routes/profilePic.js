const express = require("express");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
//This route is to uplaod users profile pic to firebase storage
const router = express.Router();

const storage = new Storage({
  projectId: "gigguide-b3d86",
  keyFilename: "/home/ubuntu/gigguide-b3d86-firebase-adminsdk-jsod7-569998f899.json",
});
const bucket = storage.bucket("gigguide-b3d86.appspot.com");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }
  const blob = storage.bucket("gigguide-b3d86.appspot.com").file(req.file.originalname);
  const blobStream = blob.createWriteStream();
  blobStream.on("error", (err) => {
    res.status(500).send(err);
  });

  blobStream.on("finish", () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res
      .status(200)
      .send({ message: "Image uploaded successfully", url: publicUrl });
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;
