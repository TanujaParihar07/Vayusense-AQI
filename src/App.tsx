import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

import { ThemeProvider } from "./hooks/useTheme";

import Sidebar from "./components/dashboard/Sidebar";

// 📄 Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Alerts from "./pages/Alerts";
import Health from "./pages/Health";
import MapPage from "./pages/Map";        // ✅ NEW
import Forecast from "./pages/Forecast.tsx";  // ✅ NEW
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Layout() {
  const location = useLocation();

  const showSidebar = [
    "/dashboard",
    "/prediction",
    "/map",
    "/forecast",
    "/health",
    "/alerts",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="flex min-h-screen w-full bg-[#020617] text-white">

      {/* Sidebar */}
      {showSidebar && (
        <div className="hidden md:block w-64 fixed left-0 top-0 h-full z-40">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${showSidebar ? "md:ml-64" : ""}`}>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />

          {/* 🔥 NEW PAGES */}
          <Route path="/map" element={<MapPage />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/health" element={<Health />} />
          <Route path="/alerts" element={<Alerts />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>

          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Layout />
          </BrowserRouter>

        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}