import { motion } from "framer-motion";
import { DroppedArgument } from "@/types/smartFlow";
import { AlertTriangle } from "lucide-react";

interface DroppedArgumentsSectionProps {
  dropped: DroppedArgument[];
}

export function DroppedArgumentsSection({ dropped }: DroppedArgumentsSectionProps) {
  if (dropped.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">✅ No dropped arguments detected</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <h3 className="font-display font-semibold text-sm text-foreground">
          Dropped Arguments ({dropped.length})
        </h3>
      </div>
      <div className="space-y-2">
        {dropped.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg bg-background/60 border border-destructive/20 p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                d.speaker === "affirmative"
                  ? "bg-accent/15 text-accent"
                  : "bg-muted text-muted-foreground"
              }`}>
                {d.speaker === "affirmative" ? "AFF" : "NEG"} · R{d.round}
              </span>
            </div>
            <p className="text-xs font-medium text-foreground">{d.claim}</p>
            <p className="text-xs text-destructive/80 mt-1">Impact: {d.impact}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
