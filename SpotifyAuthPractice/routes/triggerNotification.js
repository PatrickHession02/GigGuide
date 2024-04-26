app.post('/trigger-notification', async (req, res) => {
  try {
    const message = 'This is your instant notification'; // Define your message here
    const pushTokens = ['ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]']; // Replace with your actual Expo push tokens

    if (!Expo.isExpoPushToken(pushTokens)) {
      return res.status(400).send({ error: 'Invalid push tokens' });
    }

    const messages = [];
    for (const pushToken of pushTokens) {
      // Construct message for each recipient
      messages.push({
        to: pushToken,
        sound: 'default',
        body: message,
      });
    }

    const chunks = expo.chunkPushNotifications(messages);

    const sendPromises = [];
    for (const chunk of chunks) {
      sendPromises.push(expo.sendPushNotificationsAsync(chunk));
    }

    await Promise.all(sendPromises);

    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;