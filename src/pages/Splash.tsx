import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { AuroraBackground } from "@/components/AuroraBackground";

const Splash = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/auth"), 400);
          return 100;
        }
        return p + 2;
      });
    }, 35);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AuroraBackground />

      {/* Particle dots */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary-glow animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-scale-in">
        <div className="animate-float">
          <Logo size="lg" />
        </div>

        <h1 className="mt-10 text-4xl md:text-6xl font-bold tracking-tight max-w-2xl">
          AI-powered <span className="text-gradient">Air Quality</span> Intelligence
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-md">
          Breathe smarter. Predictive insights, real-time monitoring, and personalized health guidance.
        </p>

        <div className="mt-12 w-72 md:w-96">
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-eco transition-all duration-100 ease-out shadow-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>Initializing AI sensors</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
