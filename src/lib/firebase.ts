
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth'; // Added GoogleAuthProvider and setPersistence, browserLocalPersistence
import { getFirestore, type Firestore } from 'firebase/firestore'; // Enabled Firestore
// import { getStorage, type FirebaseStorage } from 'firebase/storage';
// import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// SERVER-SIDE DIAGNOSTIC LOG:
// This log will appear in the terminal where you run `npm run dev`.
// It helps verify if the .env file changes are being loaded correctly.
console.log("Attempting to initialize Firebase with API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

// Diagnostic checks for essential Firebase config values
if (!firebaseConfig.apiKey) {
  console.warn(
    `🔴🔴🔴 WARNING: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or undefined. 
    Firebase services will not work correctly. 
    Please ensure it is set in your .env file (for local development) or in your hosting provider's environment variable settings (for deployed environments). 🔴🔴🔴`
  );
}
if (!firebaseConfig.authDomain) {
  console.warn(
    `🔴🔴🔴 WARNING: Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) is missing or undefined. 
    Firebase services might not work correctly. 
    Please ensure it is set in your .env file (e.g., your-project-id.firebaseapp.com) or hosting environment variables. 🔴🔴🔴`
  );
}
if (!firebaseConfig.projectId) {
  console.warn(
    `🔴🔴🔴 WARNING: Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is missing or undefined. 
    Firebase services might not work correctly. 
    Please ensure it is set in your .env file or hosting environment variables. 🔴🔴🔴`
  );
}


let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore; // Declared Firestore
// let storage: FirebaseStorage;
// let analytics: Analytics;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app); // Initialized auth
firestore = getFirestore(app); // Initialized Firestore
const googleProvider = new GoogleAuthProvider(); // Added GoogleAuthProvider instance

// storage = getStorage(app);
// if (typeof window !== 'undefined') {
//   analytics = getAnalytics(app);
// }

export { app, auth, firestore, googleProvider /*, storage, analytics */ }; // Exported Firestore and googleProvider

