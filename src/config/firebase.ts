// Firebase configuration for Craftify
// Based on PRD requirements for Authentication and Analytics

/**
 * Firebase Configuration
 *
 * This file will be used to initialize Firebase services:
 * - Firebase Auth (Google Sign-In, Phone OTP)
 * - Firebase Analytics (User behavior tracking)
 * - Firebase Cloud Messaging (Push notifications)
 *
 * Note: Install @react-native-firebase packages before using this config
 *
 * Installation commands:
 * npm install @react-native-firebase/app
 * npm install @react-native-firebase/auth
 * npm install @react-native-firebase/analytics
 * npm install @react-native-firebase/messaging
 */

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
};

// Firebase initialization will be done here once packages are installed
// Example:
// import firebase from '@react-native-firebase/app';
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

export default firebaseConfig;
