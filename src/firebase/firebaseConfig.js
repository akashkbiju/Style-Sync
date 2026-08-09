// Firebase Cloud Firestore & Authentication Configuration for StyleSync
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Default Firebase Configuration template
// (Replace with your actual Firebase project credentials from Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForStyleSyncLocalDev123456",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "stylesync-salon.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "stylesync-salon",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "stylesync-salon.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abc123def456789"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
