"use client";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Bell,
  HeartPulse,
  Sparkles,
  LogOut,
  User,
  LogIn,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";

// ✅ NAV ITEMS
const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/prediction", icon: Sparkles, label: "Prediction" },
  { to: "/map", icon: Map, label: "Live Map" },
  { to: "/forecast", icon: BarChart3, label: "AI Forecast" },
  { to: "/health", icon: HeartPulse, label: "Health" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  // 🔐 Firebase user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 🔓 Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  // 🔥 Active route
  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#020617] to-[#0f172a] text-white p-4 shadow-xl z-50 flex flex-col">

      {/* 🌿 Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold">
          🌿
        </div>
        <h1 className="text-lg font-semibold">VayuSense</h1>
      </div>

      {/* 📌 MENU */}
      <div className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.to)
                ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-lg"
                : "hover:bg-white/10"
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* 👤 USER SECTION */}
      <div className="border-t border-white/10 pt-4 space-y-3">

        {/* USER INFO */}
        <div className="flex items-center gap-2 text-sm text-white/80">
          <User size={16} />
          {user?.email || "Guest"}
        </div>

        {/* LOGIN BUTTON (Guest) */}
        {!user && (
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
          >
            <LogIn size={16} />
            Login
          </button>
        )}

        {/* LOGOUT BUTTON */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;