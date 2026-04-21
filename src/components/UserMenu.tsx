"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogIn, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const UserMenu = () => {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  // 🔥 Track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // 🔥 Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 transition"
      >
        <User className="w-5 h-5" />
        <span className="text-sm">
          {user ? user.email : "Guest"}
        </span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-[#0b1220] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">

          {!user ? (
            <>
              <button
                onClick={() => navigate("/auth")}
                className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>

              <button
                onClick={() => navigate("/auth")}
                className="w-full text-left px-4 py-3 hover:bg-white/10"
              >
                Signup
              </button>

              <button
                onClick={() => setOpen(false)}
                className="w-full text-left px-4 py-3 hover:bg-white/10 text-white/60"
              >
                Continue as Guest
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-3 text-xs text-white/50 border-b border-white/10">
                Signed in as
                <div className="text-white text-sm mt-1">
                  {user.email}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-400 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};