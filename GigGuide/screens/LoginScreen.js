import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Image, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useNavigation } from '@react-navigation/core';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate('HomeScreen'); // Add this line
    } catch (error) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Welcome to GigGuide!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#fc0366', '#fc030b']} style={styles.gradient}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.ImageContainer}>
          <Image source={require('../assets/GigGuide_Title.png')} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={signIn} style={styles.button}>
                <Text style={styles.buttonOutlineText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={signUp} style={[styles.button, styles.buttonOutline]}>
                <Text style={styles.buttonOutlineText}>Register</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    borderWidth: 1,
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
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#fc03ad', 
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10, 
    borderColor: '#000000', // Add this line to set the border color to black
    borderWidth: 2,
  },
  buttonOutline: {
    backgroundColor: '#b503fc',
    borderColor: '##ffffff',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});