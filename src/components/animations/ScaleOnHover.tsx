import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScaleOnHoverProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function ScaleOnHover({ 
  children, 
  scale = 1.02,
  className = ""
}: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ 
        scale,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
