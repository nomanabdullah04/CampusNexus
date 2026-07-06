import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm8qmgWspiKRC27YPXVyLe3Eg24PygKTY",
  authDomain: "redtape-2e55a.firebaseapp.com",
  projectId: "redtape-2e55a",
  storageBucket: "redtape-2e55a.firebasestorage.app",
  messagingSenderId: "208758783778",
  appId: "1:208758783778:web:e1a8feecc04933b25b2f7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);