import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Initialize Firebase Firestore
export const db = getFirestore(app);

// Firestore collections
export const UserCollection = collection(db, "users");
export const MRCollection = collection(db, "material_requests");
export const PRCollection = collection(db, "purchase_requests");
export const MasterPartCollection = collection(db, "master_parts");
export const StockCollection = collection(db, "stocks");
export const DeliveryCollection = collection(db, "deliveries");
export const POCollection = collection(db, "purchase_orders");
