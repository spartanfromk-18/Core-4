import { initializeApp } from 'firebase/app';
import { getFirestore, collection, CollectionReference } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { University, PYQDocument, UserProgress } from '../data/schemas/collections';

// Initialize Firebase using environment variables
// Ensure these keys are added to a .env local file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Start Google Infrastructure connection
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use defined region (nam5) logically if needed, 
// though standard client JS SDK handles region via config routing usually.
export const db = getFirestore(app);

// Strongly Typed Collection References
// These enforce our types and structure automatically when querying or writing
export const collections = {
  universities: collection(db, 'universities') as CollectionReference<University>,
  pyq_database: collection(db, 'pyq_database') as CollectionReference<PYQDocument>,
  user_progress: collection(db, 'user_progress') as CollectionReference<UserProgress>
};
