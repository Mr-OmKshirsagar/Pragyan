import { motion } from "motion/react";

interface AIThinkingLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function AIThinkingLoader({
  message = "AI is thinking...",
  size = "md"
}: AIThinkingLoaderProps) {
  const sizeMap = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const textSizeMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${sizeMap[size]} rounded-full bg-gradient-to-r from-primary to-secondary`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      {message && (
        <motion.p
          className={`${textSizeMap[size]} text-muted-foreground`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
