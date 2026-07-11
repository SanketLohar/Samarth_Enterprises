import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase Configuration — values loaded from .env.local (never committed to git)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App (prevents duplicate initialization in Next.js dev hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Technician App and Auth (for persistent separated technician session)
const techApp = getApps().find(a => a.name === "technician") || initializeApp(firebaseConfig, "technician");
const techAuth = getAuth(techApp);
const techDb = getFirestore(techApp);

// Initialize Temp Login App and Auth (for isolated role check during sign in)
const tempApp = getApps().find(a => a.name === "tempLogin") || initializeApp(firebaseConfig, "tempLogin");
const tempAuth = getAuth(tempApp);
const tempDb = getFirestore(tempApp);

export { 
  app, 
  auth, 
  db, 
  storage,
  techAuth,
  techDb,
  tempAuth,
  tempDb,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection
};
