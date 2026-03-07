import { motion } from "framer-motion";
import { Trophy, ThumbsUp, ThumbsDown, Minus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DebateAnalysis, DebateOpponent } from "@/types/debate";

interface DebateReportProps {
  analysis: DebateAnalysis;
  opponent: DebateOpponent;
  topic: string;
  eloChange: number;
  onNewDebate: () => void;
}

export function DebateReport({ analysis, opponent, topic, eloChange, onNewDebate }: DebateReportProps) {
  const verdictMap = {
    user_wins: { label: "You Won!", icon: Trophy, color: "text-green-500" },
    ai_wins: { label: "AI Wins", icon: ThumbsDown, color: "text-destructive" },
    draw: { label: "Draw", icon: Minus, color: "text-warning" },
  };
  const verdict = verdictMap[analysis.verdict];
  const VerdictIcon = verdict.icon;
  const totalScore = analysis.clarity_score + analysis.evidence_score + analysis.logic_score + analysis.rebuttal_score;

  const categories = [
    { label: "Clarity", score: analysis.clarity_score, max: 25 },
    { label: "Evidence", score: analysis.evidence_score, max: 25 },
    { label: "Logic", score: analysis.logic_score, max: 25 },
    { label: "Rebuttal", score: analysis.rebuttal_score, max: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <VerdictIcon className={`w-16 h-16 mx-auto mb-4 ${verdict.color}`} />
        </motion.div>
        <h2 className={`font-display text-3xl font-bold ${verdict.color}`}>{verdict.label}</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          vs {opponent.icon} {opponent.name} · {topic}
        </p>
      </motion.div>

      {/* Score + ELO */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6 text-center"
        >
          <p className="text-muted-foreground text-sm mb-1">Debate Score</p>
          <p className="font-display text-4xl font-bold text-foreground">{analysis.overall_score}</p>
          <p className="text-muted-foreground text-xs">/10</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 text-center"
        >
          <p className="text-muted-foreground text-sm mb-1">Persuasion Rating</p>
          <p className={`font-display text-4xl font-bold ${eloChange >= 0 ? "text-green-500" : "text-destructive"}`}>
            {eloChange >= 0 ? "+" : ""}{eloChange}
          </p>
          <p className="text-muted-foreground text-xs">ELO change</p>
        </motion.div>
      </div>

      {/* Category breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">Score Breakdown ({totalScore}/100)</h3>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <div key={cat.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{cat.label}</span>
                <span className="text-foreground font-medium">{cat.score}/{cat.max}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.score / cat.max) * 100}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-green-500" /> Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <ThumbsDown className="w-4 h-4 text-destructive" /> Weaknesses
          </h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span> {w}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <p className="text-sm text-muted-foreground italic">{analysis.summary}</p>
      </motion.div>

      {/* New debate */}
      <div className="flex justify-center pt-4">
        <Button variant="hero" onClick={onNewDebate} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> New Debate
        </Button>
      </div>
    </div>
  );
}
