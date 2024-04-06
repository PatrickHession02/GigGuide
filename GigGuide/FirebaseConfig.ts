import { initializeApp } from 'firebase/app';
import { getAuth,  browserLocalPersistence, setPersistence, } from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 



const firebaseConfig = {
  apiKey: "AIzaSyBnKgSGr_60IabY0XK-07vtBPGCJoZsC-c",
  authDomain: "gigguide-b3d86.firebaseapp.com",
  projectId: "gigguide-b3d86",
  storageBucket: "gigguide-b3d86.appspot.com",
  messagingSenderId: "113728607190",
  appId: "1:113728607190:web:8f4e008af6b5683c924a77"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export { auth as FIREBASE_AUTH };