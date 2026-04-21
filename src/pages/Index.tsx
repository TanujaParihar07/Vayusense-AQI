"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Splash from "./Splash";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate("/dashboard"); // ✅ logged in
        } else {
          navigate("/auth"); // ❌ not logged in
        }
      });

      return () => unsubscribe();
    }, 2000); // ⏳ Splash duration

    return () => clearTimeout(timer);
  }, []);

  return <Splash />;
}