/**
 * Comprehensive animation utilities for polished UI interactions
 */

// Page entrance animations
export const pageEntranceVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

// Staggered container for child animations
export const staggerContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

// Individual item animations (for use with staggerContainer)
export const staggerItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Card hover animations
export const cardHoverVariants = {
  initial: { y: 0 },
  whileHover: { 
    y: -4,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Button animations
export const buttonVariants = {
  initial: { scale: 1 },
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
};

// Pulse animation for important elements
export const pulseVariants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Slide in from left
export const slideInLeftVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Slide in from right
export const slideInRightVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Fade in animation
export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

// Scale up animation
export const scaleInVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Rotate animation
export const rotateVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Float animation
export const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Glow animation for borders/shadows
export const glowVariants = {
  initial: { boxShadow: "0 0 0 rgba(168, 85, 247, 0)" },
  animate: {
    boxShadow: [
      "0 0 20px rgba(168, 85, 247, 0.3)",
      "0 0 40px rgba(168, 85, 247, 0.5)",
      "0 0 20px rgba(168, 85, 247, 0.3)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shimmer loading animation
export const shimmerVariants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Number counter animation
export const counterVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Badge pop animation
export const badgePopVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1,
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  }
};

// Modal backdrop animation
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// Modal content animation
export const modalContentVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// List animation with stagger
export const listVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// List item animation
export const listItemVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

// Tab animation
export const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

// Progress bar animation
export const progressVariants = {
  initial: { scaleX: 0 },
  animate: { 
    scaleX: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// Success checkmark animation
export const checkmarkVariants = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Error shake animation
export const shakeVariants = {
  animate: {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.4 }
  }
};

// Tooltip animation
export const tooltipVariants = {
  initial: { opacity: 0, y: 5 },
  animate: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    y: 5,
    transition: { duration: 0.1 }
  }
};

// Bounce animation
export const bounceVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

// Ripple effect animation
export const rippleVariants = {
  initial: { scale: 0, opacity: 1 },
  animate: { 
    scale: 4,
    opacity: 0,
    transition: { duration: 0.6 }
  }
};
