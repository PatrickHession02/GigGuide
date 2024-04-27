import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyBnKgSGr_60IabY0XK-07vtBPGCJoZsC-c",
  authDomain: "gigguide-b3d86.firebaseapp.com",
  projectId: "gigguide-b3d86",
  storageBucket: "gigguide-b3d86.appspot.com",
  messagingSenderId: "113728607190",
  appId: "1:113728607190:web:8f4e008af6b5683c924a77"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = getAuth(FIREBASE_APP); // get the auth instance

export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

export const FIREBASE_STORAGE = getStorage(FIREBASE_APP); // initialize Firebase Storage

