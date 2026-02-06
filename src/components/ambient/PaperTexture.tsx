import { motion } from "framer-motion";

export function PaperTexture() {
  return (
    <>
      {/* Paper grain texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
        }}
        aria-hidden="true"
      />
      
      {/* Subtle vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-[99]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 60%, hsl(var(--foreground) / 0.03) 100%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}

export function FloatingOrb({ 
  className = "", 
  delay = 0 
}: { 
  className?: string; 
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.3, 0.5, 0.3],
        y: [0, -20, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    />
  );
}
