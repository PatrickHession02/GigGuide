import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const AI = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('/ai')
      .then(response => response.text())
      .then(data => setData(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      <Text>{data}</Text>
    </View>
  );
};

export default AI;