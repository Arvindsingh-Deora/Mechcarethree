import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCyqPvxx5Dt920R9FnWH7GQFgCmA-mcBKU",
  authDomain: "mechcare-vnvyr.firebaseapp.com",
  projectId: "mechcare-vnvyr",
  storageBucket: "mechcare-vnvyr.appspot.com",
  messagingSenderId: "82372060869",
  appId: "1:82372060869:web:0e0679f410141118ed32ac",
  measurementId: "G-0PW0VSV0KX"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Optional: Analytics for browser
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, provider, analytics };
