
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// IMPORTANT: Replace with your actual Firebase project configuration in your .env file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else if (typeof window !== 'undefined') {
  app = getApp();
  db = getFirestore(app);
} else {
  // Handle server-side initialization if needed, or ensure client-side only usage
  // For this example, assuming client-side Firestore usage primarily for reads on history page
  // Writes will happen in Server Actions, which may need Admin SDK for production
  // but we'll use client SDK for simplicity if environment allows.
  // If getApps() is empty on server, initialize. This is tricky for server actions.
  // A more robust server-side solution might use Firebase Admin SDK.
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
}


export { db, app };
