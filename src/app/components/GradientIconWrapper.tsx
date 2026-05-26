import { motion } from "motion/react";
import { cn } from "../utils/cn";

interface GradientIconWrapperProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  gradient?: "purple" | "cyan" | "pink" | "blue";
  glow?: boolean;
  className?: string;
}

export function GradientIconWrapper({
  children,
  size = "md",
  gradient = "purple",
  glow = false,
  className
}: GradientIconWrapperProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20"
  };

  const gradientClasses = {
    purple: "bg-gradient-to-br from-primary to-primary/60",
    cyan: "bg-gradient-to-br from-secondary to-secondary/60",
    pink: "bg-gradient-to-br from-pink to-pink/60",
    blue: "bg-gradient-to-br from-accent to-accent/60"
  };

  const glowClasses = {
    purple: "shadow-[0_0_20px_rgba(139,92,246,0.5)]",
    cyan: "shadow-[0_0_20px_rgba(6,182,212,0.5)]",
    pink: "shadow-[0_0_20px_rgba(236,72,153,0.5)]",
    blue: "shadow-[0_0_20px_rgba(59,130,246,0.5)]"
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-xl flex items-center justify-center",
        sizeClasses[size],
        gradientClasses[gradient],
        glow && glowClasses[gradient],
        className
      )}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
