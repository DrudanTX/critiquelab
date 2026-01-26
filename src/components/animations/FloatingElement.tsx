import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}

export function FloatingElement({ 
  children, 
  className = "",
  duration = 4,
  distance = 10
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{ 
        y: [-distance/2, distance/2, -distance/2],
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
