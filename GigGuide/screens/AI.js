import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AI = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('https://7bc9-80-233-72-63.ngrok-free.app/AI')
      .then(response => response.text())
      .then(data => setData(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text>{data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AI;