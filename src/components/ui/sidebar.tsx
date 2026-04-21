import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Map,
  BarChart3,
  HeartPulse,
  Bell,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { title: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Prediction", icon: Sparkles, path: "/prediction" },
  { title: "Live Map", icon: Map, path: "/map" },
  { title: "AI Forecast", icon: BarChart3, path: "/forecast" },
  { title: "Health", icon: HeartPulse, path: "/health" },
  { title: "Alerts", icon: Bell, path: "/alerts" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActiveRoute = (path: string) =>
    location.pathname.startsWith(path);

  return (
    <>
      {/* 🔥 MOBILE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-white p-2 rounded-lg"
      >
        ☰
      </button>

      {/* 🔥 OVERLAY (MOBILE) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div
        className={`
        fixed top-0 left-0 h-screen w-64 z-50
        bg-sidebar-background text-sidebar-foreground
        border-r border-sidebar-border
        p-4 flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* CLOSE BTN (MOBILE) */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4"
        >
          <X size={18} />
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold shadow-glow">
            🌿
          </div>
          <h1 className="text-lg font-semibold">VayuSense</h1>
        </div>

        {/* MENU */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const active = isActiveRoute(item.path);

            return (
              <div
                key={item.title}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                  transition-all duration-300
                  ${
                    active
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-lg"
                      : "hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* 🔥 UPGRADE CARD */}
        <div className="mt-4 bg-card p-4 rounded-xl border border-border shadow-soft">
          <p className="text-sm font-semibold mb-1">
            Upgrade to Pro ✨
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            AI forecasts & unlimited alerts
          </p>
          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-sm font-semibold hover:opacity-90 transition">
            Upgrade
          </button>
        </div>
      </div>
    </>
  );
}