import { Leaf } from "lucide-react";

export const Logo = ({ size = "default" }: { size?: "default" | "lg" | "sm" }) => {
  const sizes = {
    sm: { box: "h-8 w-8", icon: "h-4 w-4", text: "text-lg" },
    default: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-xl" },
    lg: { box: "h-16 w-16", icon: "h-8 w-8", text: "text-4xl" },
  }[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${sizes.box} rounded-2xl bg-eco shadow-glow flex items-center justify-center`}>
        <Leaf className={`${sizes.icon} text-primary-foreground`} strokeWidth={2.5} />
        <div className="absolute inset-0 rounded-2xl bg-eco opacity-50 blur-xl -z-10" />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${sizes.text} font-bold tracking-tight`}>
          Vayu<span className="text-gradient">Sense</span>
        </span>
        {size === "lg" && <span className="text-xs text-muted-foreground mt-1">AI Air Intelligence</span>}
      </div>
    </div>
  );
};
