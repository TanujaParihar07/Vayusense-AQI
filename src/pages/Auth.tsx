"use client";

import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { auth, provider } from "@/lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ AUTO REDIRECT IF LOGGED IN
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
    return () => unsub();
  }, []);

  // 🔐 LOGIN / SIGNUP
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Enter email & password");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back 🚀");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created 🎉");
      }

      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  // 🔵 GOOGLE LOGIN
  const handleGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      toast.success("Logged in with Google 🚀");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  // ⏭️ SKIP LOGIN
  const handleSkip = () => {
    toast.success("Continuing without login");
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <AuroraBackground />

      <div className="w-full max-w-md">
        {/* 🌿 LOGO */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* 💎 CARD */}
        <div className="glass-strong rounded-3xl p-8 shadow-elevated border border-white/10 backdrop-blur-xl">

          {/* 🔄 TOGGLE */}
          <div className="flex mb-6 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === "login"
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-semibold"
                  : "text-white/60"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg transition ${
                mode === "signup"
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-semibold"
                  : "text-white/60"
              }`}
            >
              Signup
            </button>
          </div>

          {/* 📩 FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-white/40" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-white/40" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition"
              />
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold rounded-xl py-3"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </Button>
          </form>

          {/* ➖ DIVIDER */}
          <div className="my-5 text-center text-sm text-white/50">
            ───── OR ─────
          </div>

          {/* 🔴 GOOGLE */}
          <Button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 transition rounded-xl"
          >
            Continue with Google
          </Button>

          {/* ⏭️ SKIP */}
          <button
            onClick={handleSkip}
            className="w-full mt-5 text-sm text-cyan-400 hover:underline"
          >
            Skip login → Go to Dashboard
          </button>

        </div>
      </div>
    </div>
  );
};

export default Auth;