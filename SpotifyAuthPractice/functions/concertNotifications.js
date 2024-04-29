
const admin = require('../routes/fireStore');
const functions = require('firebase-functions');

console.log(expo);
exports.sendNotificationOnNewConcert = functions.firestore
.document('users/{userId}')
.onUpdate(async (change, context) => {
  const userId = context.params.userId;
    const before = change.before.data();
    const after = change.after.data();

    console.log('Before data:', before); // Log the before data
    console.log('After data:', after); // Log the after data

    // Check if before and after data exist and concerts is an array
    if (before && after && Array.isArray(before.concerts) && Array.isArray(after.concerts) && before.concerts.length < after.concerts.length) {
      // ...
    
      // Send a POST request to your Express server with the new concert data
      axios.post('https://adab-79-140-211-73.ngrok-free.app/new-concert', {
        concert: after.concerts[after.concerts.length - 1]
      })

      console.log('Message:', message); // Log the message

      const chunks = expo.chunkPushNotifications([message]);
      console.log('Chunks:', chunks); // Log the chunks

      const sendPromises = chunks.map(chunk => expo.sendPushNotificationsAsync(chunk));
      console.log('Sending notifications'); // Log before sending notifications

      await Promise.all(sendPromises);

  

      // Log a message when a new concert is added and a notification is sent
      console.log(`New concert ADDED FROM TEST: ${after.concerts[after.concerts.length - 1]}. Notification sent.`);
    } else {
      console.log('No new concert added'); // Log when no new concert is added
    }
  });
