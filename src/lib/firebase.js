import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCG7qYZaAPyP2GAqyX3ZmG5eg49opBGc6o",
  authDomain: "six9ine-ec11e.firebaseapp.com",
  projectId: "six9ine-ec11e",
  storageBucket: "six9ine-ec11e.firebasestorage.app",
  messagingSenderId: "362446885878",
  appId: "1:362446885878:web:746c103c8080f4080c6dd7",
  measurementId: "G-TQK4C34QRV"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { analytics };
export default app;

