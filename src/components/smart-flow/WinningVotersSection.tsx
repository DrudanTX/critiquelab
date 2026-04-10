import { motion } from "framer-motion";
import { WinningVoter } from "@/types/smartFlow";
import { Trophy } from "lucide-react";

interface WinningVotersSectionProps {
  voters: WinningVoter[];
  overallWinner: "affirmative" | "negative" | "draw";
}

export function WinningVotersSection({ voters, overallWinner }: WinningVotersSectionProps) {
  const winnerLabel = overallWinner === "affirmative" ? "Affirmative (You)" : overallWinner === "negative" ? "Negative (AI)" : "Draw";
  const winnerColor = overallWinner === "affirmative" ? "text-green-500" : overallWinner === "negative" ? "text-destructive" : "text-warning";

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" />
          <h3 className="font-display font-semibold text-sm text-foreground">Winning Voters</h3>
        </div>
        <span className={`text-xs font-bold ${winnerColor}`}>{winnerLabel}</span>
      </div>
      <div className="space-y-2">
        {voters.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg bg-muted/30 border border-border p-3"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-foreground">{v.issue}</p>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                v.winner === "affirmative"
                  ? "bg-green-500/15 text-green-600 dark:text-green-400"
                  : "bg-destructive/15 text-destructive"
              }`}>
                {v.winner === "affirmative" ? "AFF" : "NEG"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{v.reason}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
