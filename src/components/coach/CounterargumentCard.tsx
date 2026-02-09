import { motion } from "framer-motion";
import { Brain, Scale, Hammer, Target, Crosshair } from "lucide-react";
import { Counterargument, PERSPECTIVE_CONFIG } from "@/types/counterargumentCoach";

interface CounterargumentCardProps {
  counterargument: Counterargument;
  index: number;
}

const PERSPECTIVE_ICONS = {
  logical: Brain,
  ethical: Scale,
  practical: Hammer,
};

export function CounterargumentCard({ counterargument, index }: CounterargumentCardProps) {
  const config = PERSPECTIVE_CONFIG[counterargument.perspective];
  const Icon = PERSPECTIVE_ICONS[counterargument.perspective];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`bg-card rounded-2xl border ${config.borderClass} p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-slow`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-10 h-10 rounded-xl ${config.iconBgClass} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.textClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium uppercase tracking-wider ${config.textClass}`}>
              {config.label}
            </span>
          </div>
          <h3 className="font-display text-lg font-medium text-foreground leading-snug">
            {counterargument.title}
          </h3>
        </div>
      </div>

      {/* The Counterargument */}
      <p className="text-sm text-foreground leading-relaxed mb-5">
        {counterargument.argument}
      </p>

      {/* Why it hits */}
      <div className="flex gap-3 mb-4 p-4 bg-secondary/40 rounded-xl">
        <Target className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-foreground mb-1">Why this hits hard</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {counterargument.whyPersuasive}
          </p>
        </div>
      </div>

      {/* What it attacks */}
      <div className="flex gap-3 p-4 bg-secondary/40 rounded-xl">
        <Crosshair className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-foreground mb-1">Attacks this part</p>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            "{counterargument.attacksWhat}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
