import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jeffworldwide-demo.firebaseapp.com",
  // databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://jeffworldwide-demo-default-rtdb.firebaseio.com",
  // projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jeffworldwide-demo",
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jeffworldwide-demo.appspot.com",
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  // appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"

  apiKey: "AIzaSyA8Seej61QTEm7LLoeAi9HRdm6E2CW8tIQ",
  authDomain: "jwltdtech.firebaseapp.com",
  databaseURL: "https://jwltdtech-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jwltdtech",
  storageBucket: "jwltdtech.firebasestorage.app",
  messagingSenderId: "638635153703",
  appId: "1:638635153703:web:82bc5b859f74a502577102",
  measurementId: "G-QF4W2YLK8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const storage = getStorage(app);

export default app;