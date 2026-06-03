import { motion } from "motion/react";
import { cn } from "../utils/cn";
import { cardHoverVariants, staggerItemVariants } from "../../utils/animations";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: "primary" | "secondary" | "accent" | "pink";
  delay?: number;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  glowColor = "primary",
  delay = 0
}: GlassCardProps) {
  const glowColorMap = {
    primary: "shadow-[0_0_30px_-5px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_-5px_rgba(139,92,246,0.6)]",
    secondary: "shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_-5px_rgba(6,182,212,0.6)]",
    accent: "shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_-5px_rgba(59,130,246,0.6)]",
    pink: "shadow-[0_0_30px_-5px_rgba(236,72,153,0.4)] hover:shadow-[0_0_50px_-5px_rgba(236,72,153,0.6)]"
  };

  return (
    <motion.div
      className={cn(
        "relative backdrop-blur-xl bg-card/60 border border-card-border rounded-xl p-6 transition-all duration-300",
        glow && glowColorMap[glowColor],
        className
      )}
      variants={hover ? cardHoverVariants : staggerItemVariants}
      initial="initial"
      whileHover={hover ? "whileHover" : undefined}
      whileInView={hover ? "whileHover" : "animate"}
      viewport={{ once: true }}
      transition={{ ...staggerItemVariants.animate.transition, delay }}
    >
      {children}
    </motion.div>
  );
}
