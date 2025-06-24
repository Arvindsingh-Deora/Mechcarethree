// src/Pages/Firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ Add this line

const firebaseConfig = {
  apiKey: "AIzaSyCyqPvxx5Dt920R9FnWH7GQFgCmA-mcBKU",
  authDomain: "mechcare-vnvyr.firebaseapp.com",
  projectId: "mechcare-vnvyr",
  storageBucket: "mechcare-vnvyr.appspot.com",
  messagingSenderId: "82372060869",
  appId: "1:82372060869:web:0e0679f410141118ed32ac",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // ✅ Create Google provider

auth.languageCode = "en"; // Required for Recaptcha

export { auth, provider }; // ✅ Export both
