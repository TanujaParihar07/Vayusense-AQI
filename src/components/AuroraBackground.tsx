export const AuroraBackground = ({ withGrid = true }: { withGrid?: boolean }) => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-aurora" />
    {withGrid && <div className="absolute inset-0 grid-bg opacity-40" />}
    <div
      className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 animate-float"
      style={{ background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.4), transparent 70%)" }}
    />
    <div
      className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full opacity-30 animate-float"
      style={{
        background: "radial-gradient(circle, hsl(var(--accent) / 0.4), transparent 70%)",
        animationDelay: "2s",
      }}
    />
    <div
      className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 animate-float"
      style={{
        background: "radial-gradient(circle, hsl(var(--secondary) / 0.4), transparent 70%)",
        animationDelay: "4s",
      }}
    />
  </div>
);
