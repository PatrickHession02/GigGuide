import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ConcertInfo = () => {
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        // Make a GET request to your backend endpoint
        const response = await fetch('http://localhost:3050/concerts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Set the fetched data to state
        setConcerts(data);
      } catch (error) {
        console.error('Error fetching concerts:', error);
        // Handle errors here
      }
    };
    
    // Call the fetchConcerts function when the component mounts
    fetchConcerts();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>CONCERT INFO</Text>
      {/* Render the fetched concerts data */}
      {concerts.map((concert, index) => (
        <View key={index} style={styles.concertContainer}>
          <Text style={styles.concertText}>Name: {concert.name}</Text>
          <Text style={styles.concertText}>Date: {concert.date}</Text>
          <Text style={styles.concertText}>Venue: {concert.venue}</Text>
          <Text style={styles.concertText}>City: {concert.city}</Text>
          <Text style={styles.concertText}>Country: {concert.country}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  concertContainer: {
    marginBottom: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
  },
  concertText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ConcertInfo;
