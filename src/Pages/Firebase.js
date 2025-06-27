// src/Pages/Firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// ✅ Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCyqPvxx5Dt920R9FnWH7GQFgCmA-mcBKU",
  authDomain: "mechcare-vnvyr.firebaseapp.com",
  projectId: "mechcare-vnvyr",
  storageBucket: "mechcare-vnvyr.appspot.com",
  messagingSenderId: "82372060869",
  appId: "1:82372060869:web:0e0679f410141118ed32ac",
  measurementId: "G-0PW0VSV0KX"
};

// ✅ Always use same app instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Create Auth instance from that app
const auth = getAuth(app);
auth.languageCode = "en"; // important for phone auth

// ✅ Google login provider
const provider = new GoogleAuthProvider();

// ✅ Analytics only in browser (avoids server-side crash)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// ✅ Export properly for both Google + OTP auth
export { app, auth, provider, analytics };
