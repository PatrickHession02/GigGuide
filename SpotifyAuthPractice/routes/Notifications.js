import BodyParser from "body-BodyParser";
const router = express.Router();
const json = BodyParser.json();
const httpParser = BodyParser.urlencoded({ extended: false });


router.post('/pushnotification', json, async (req, res) => {
  const token = String (req.body.token);
await admin.messaging().sendToDevice(token, {
  notification: {
    title: 'Concerts',
    body: 'New concerts are available!'
  }
});