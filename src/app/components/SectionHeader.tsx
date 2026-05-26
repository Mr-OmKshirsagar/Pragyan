import { motion } from "motion/react";
import { cn } from "../utils/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  gradient = true,
  className
}: SectionHeaderProps) {
  return (
    <motion.div
      className={cn("space-y-2", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2
        className={cn(
          "text-3xl md:text-4xl font-semibold",
          gradient && "bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
