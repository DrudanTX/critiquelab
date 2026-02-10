import { motion } from "framer-motion";
import { ArgumentScore, SCORE_CATEGORIES } from "@/types/argumentScore";
import { ScoreRing } from "./ScoreRing";
import { Lightbulb, TrendingUp } from "lucide-react";

interface ScoreBreakdownProps {
  score: ArgumentScore;
}

export function ScoreBreakdown({ score }: ScoreBreakdownProps) {
  const categories = [
    { ...SCORE_CATEGORIES[0], value: score.clarityScore, explanation: score.clarityExplanation, suggestion: score.claritySuggestion },
    { ...SCORE_CATEGORIES[1], value: score.logicScore, explanation: score.logicExplanation, suggestion: score.logicSuggestion },
    { ...SCORE_CATEGORIES[2], value: score.evidenceScore, explanation: score.evidenceExplanation, suggestion: score.evidenceSuggestion },
    { ...SCORE_CATEGORIES[3], value: score.defenseScore, explanation: score.defenseExplanation, suggestion: score.defenseSuggestion },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      {/* Total Score */}
      <div className="flex flex-col items-center">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Argument Score</h3>
        <ScoreRing score={score.totalScore} maxScore={100} size={140} strokeWidth={10} />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex flex-col items-center"
          >
            <ScoreRing score={cat.value} maxScore={25} size={80} strokeWidth={6} label={cat.label} color={cat.color} />
          </motion.div>
        ))}
      </div>

      {/* Explanations & Suggestions */}
      <div className="space-y-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="bg-secondary/50 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-sm font-semibold text-foreground">{cat.label}</span>
              <span className="text-xs text-muted-foreground ml-auto">{cat.value}/25</span>
            </div>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <TrendingUp className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-accent" />
              {cat.explanation}
            </p>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-warning" />
              {cat.suggestion}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
