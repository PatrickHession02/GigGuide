import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Importing useNavigation if needed
import { useNavigation } from '@react-navigation/core';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Uncomment if needed
  const navigation = useNavigation();

  const handleLogin = () =>
   {
    navigation.navigate('Home');
  };
  return (
    <LinearGradient colors={['#8E00FD', '#FF0B54',]} style={styles.gradient}>
    <KeyboardAvoidingView style={styles.container} behavior="padding">

    <View style={styles.ImageContainer}>
  <Image
    source={require('../assets/GigGuide_Title.png')}
  />
  </View>
     
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
  

      <View style={styles.buttonContainer}>
       <TouchableOpacity onPress={handleLogin} style={styles.button}>
         <Text style={styles.buttonOutlineText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity  onPress={handleLogin} style={[styles.button]}>
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    borderRadius: 5,
    borderWidth: 1, // Use `borderWidth` instead of `border`
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
   ImageContainer: {
    height: 50,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
   },

  TitleText: {
    color: '#FFBF00',
    fontWeight: 'normal',
    lineHeight: 1.5,
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 10 },
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width:'60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#grey',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor:'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
});