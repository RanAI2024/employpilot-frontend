import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmr7X8dehmcyvJpA0-iehHk_ibzoG5aOQ",
  authDomain: "employpilot-3e29c.firebaseapp.com",
  projectId: "employpilot-3e29c",
  storageBucket: "employpilot-3e29c.firebasestorage.app",
  messagingSenderId: "273849303633",
  appId: "1:273849303633:web:da5ce2fa2e336dffa6ae70"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);