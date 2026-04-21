// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

// 🔥 YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCGqh_r7NTDmSwLs4iojxivggkthd7q03Y",
  authDomain: "vayusense-a08e5.firebaseapp.com",
  projectId: "vayusense-a08e5",
  storageBucket: "vayusense-a08e5.firebasestorage.app",
  messagingSenderId: "214271576800",
  appId: "1:214271576800:web:2772bd7538319575acde85",
  measurementId: "G-8K5W96RX5Z"
};

// 🔥 INIT
const app = initializeApp(firebaseConfig);

// 🔥 AUTH
export const auth = getAuth(app);

// ✅ THIS WAS MISSING
export const provider = new GoogleAuthProvider();