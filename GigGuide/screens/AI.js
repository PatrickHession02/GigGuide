import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Text } from 'react-native';

const AI = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://7bc9-80-233-72-63.ngrok-free.app/AI')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setData(data.allConcerts);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            {item.images.map((image, index) => (
              <Image key={index} style={styles.image} source={{ uri: image.url }} />
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default AI;