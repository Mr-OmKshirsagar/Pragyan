/**
 * Reusable animated section wrapper for consistent page animations
 */
import { motion } from "motion/react";
import { ReactNode } from "react";
import { staggerContainerVariants, staggerItemVariants } from "../../utils/animations";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
}

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
  stagger = true
}: AnimatedSectionProps) {
  if (stagger) {
    return (
      <motion.div
        className={className}
        variants={staggerContainerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={staggerItemVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ ...staggerItemVariants.animate.transition, delay }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedItem({
  children,
  className = "",
  delay = 0
}: AnimatedItemProps) {
  return (
    <motion.div
      className={className}
      variants={staggerItemVariants}
      transition={{ ...staggerItemVariants.animate.transition, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wrapper for page content with entrance animation
 */
interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className = "" }: AnimatedPageProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
