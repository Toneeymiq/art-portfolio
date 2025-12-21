import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEgkHfGxQbQQzBQDEDj4D2QnKFDL6e-Do",
  authDomain: "miqkniq-portfolio.firebaseapp.com",
  projectId: "miqkniq-portfolio",
  storageBucket: "miqkniq-portfolio.firebasestorage.app",
  messagingSenderId: "662443810434",
  appId: "1:662443810434:web:6c2d3feb1fc4fcbe2a1e9b",
  measurementId: "G-WT5CRG63PC"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, analytics };