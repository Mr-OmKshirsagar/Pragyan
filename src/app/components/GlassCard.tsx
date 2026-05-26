import { motion } from "motion/react";
import { cn } from "../utils/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: "primary" | "secondary" | "accent" | "pink";
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
  glowColor = "primary"
}: GlassCardProps) {
  const glowColorMap = {
    primary: "shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]",
    secondary: "shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]",
    accent: "shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
    pink: "shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)]"
  };

  return (
    <motion.div
      className={cn(
        "relative backdrop-blur-xl bg-card/60 border border-card-border rounded-xl p-6",
        glow && glowColorMap[glowColor],
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
