import { motion } from "framer-motion";
import { Shield, AlertCircle, MessageSquareQuote, Lightbulb } from "lucide-react";
import { RebuttalCoach } from "@/types/counterargumentCoach";

interface RebuttalCoachCardProps {
  coach: RebuttalCoach;
}

export function RebuttalCoachCard({ coach }: RebuttalCoachCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-card rounded-2xl border border-accent/20 p-6 md:p-8 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display text-lg font-medium text-foreground">
            Rebuttal Coach
          </h3>
          <p className="text-xs text-muted-foreground">
            Your playbook for fighting back
          </p>
        </div>
      </div>

      {/* Claim to Defend */}
      <div className="mb-6 p-5 bg-accent/5 rounded-xl border border-accent/10">
        <div className="flex gap-3">
          <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
              Defend this claim
            </p>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {coach.claimToDefend}
            </p>
          </div>
        </div>
      </div>

      {/* Missing Evidence */}
      <div className="mb-6">
        <p className="text-xs font-medium text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-warning" />
          What's missing from your defense
        </p>
        <div className="space-y-2">
          {coach.missingEvidence.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
              className="flex gap-3 p-3 bg-secondary/40 rounded-xl"
            >
              <span className="text-warning text-xs font-bold mt-0.5">→</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sentence Starters */}
      <div className="mb-6">
        <p className="text-xs font-medium text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <MessageSquareQuote className="w-3.5 h-3.5 text-info" />
          Start your rebuttal with...
        </p>
        <div className="space-y-2">
          {coach.sentenceStarters.map((starter, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.4 }}
              className="p-3 bg-info/5 rounded-xl border border-info/10"
            >
              <p className="text-sm text-foreground italic leading-relaxed">
                "{starter}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strategy Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="p-5 bg-accent/5 rounded-xl border border-accent/10"
      >
        <div className="flex gap-3">
          <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
              Strategy tip
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {coach.strategyTip}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
