import { motion } from "framer-motion";
import { ArgumentScore, SCORE_CATEGORIES } from "@/types/argumentScore";
import { ScoreRing } from "./ScoreRing";
import { TrendingUp, Target, Award, BarChart3 } from "lucide-react";
import { FadeIn } from "@/components/animations";

interface ProgressDashboardProps {
  scores: ArgumentScore[];
  averageScore: number;
  highestScore: number;
  categoryAverages: { clarity: number; logic: number; evidence: number; defense: number };
}

export function ProgressDashboard({ scores, averageScore, highestScore, categoryAverages }: ProgressDashboardProps) {
  // Get improvement: compare last 5 vs previous 5
  const getImprovement = () => {
    if (scores.length < 2) return null;
    const recent = scores.slice(0, Math.min(5, scores.length));
    const older = scores.slice(Math.min(5, scores.length), Math.min(10, scores.length));
    if (older.length === 0) return null;
    const recentAvg = recent.reduce((s, sc) => s + sc.totalScore, 0) / recent.length;
    const olderAvg = older.reduce((s, sc) => s + sc.totalScore, 0) / older.length;
    return Math.round(recentAvg - olderAvg);
  };

  const improvement = getImprovement();

  // Find strongest and weakest category
  const catEntries = [
    { key: "clarity", label: "Clarity", avg: categoryAverages.clarity },
    { key: "logic", label: "Logic", avg: categoryAverages.logic },
    { key: "evidence", label: "Evidence", avg: categoryAverages.evidence },
    { key: "defense", label: "Defense", avg: categoryAverages.defense },
  ];
  const strongest = catEntries.reduce((a, b) => a.avg >= b.avg ? a : b);
  const weakest = catEntries.reduce((a, b) => a.avg <= b.avg ? a : b);

  if (scores.length === 0) {
    return (
      <FadeIn>
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">No scores yet</h3>
          <p className="text-sm text-muted-foreground">
            Complete a critique, autopsy, or coaching session to start tracking your progress.
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Average Score" value={`${averageScore}/100`} />
        <StatCard icon={Award} label="Highest Score" value={`${highestScore}/100`} />
        <StatCard icon={BarChart3} label="Total Arguments" value={String(scores.length)} />
        <StatCard
          icon={TrendingUp}
          label="Trend"
          value={improvement !== null ? `${improvement > 0 ? "+" : ""}${improvement}` : "—"}
          valueColor={improvement !== null ? (improvement > 0 ? "text-accent" : improvement < 0 ? "text-destructive" : undefined) : undefined}
        />
      </div>

      {/* Category Averages */}
      <FadeIn delay={0.1}>
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Category Averages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SCORE_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex flex-col items-center"
              >
                <ScoreRing
                  score={categoryAverages[cat.key]}
                  maxScore={25}
                  size={80}
                  strokeWidth={6}
                  label={cat.label}
                  color={cat.color}
                />
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex flex-col md:flex-row gap-3 text-sm">
            <div className="flex items-center gap-2 text-accent">
              <Award className="w-4 h-4" />
              <span>Strongest: <strong>{strongest.label}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-warning">
              <Target className="w-4 h-4" />
              <span>Focus area: <strong>{weakest.label}</strong></span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Recent Scores */}
      <FadeIn delay={0.2}>
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Recent Scores</h3>
          <div className="space-y-3">
            {scores.slice(0, 10).map((score, i) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="font-display font-bold text-foreground">{score.totalScore}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{score.inputPreview}</p>
                  <p className="text-xs text-muted-foreground">
                    {score.source} · {new Date(score.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="hidden md:flex gap-2">
                  {SCORE_CATEGORIES.map(cat => {
                    const val = score[`${cat.key}Score` as keyof ArgumentScore] as number;
                    return (
                      <div key={cat.key} className="text-center">
                        <div className="text-xs font-medium" style={{ color: cat.color }}>{val}</div>
                        <div className="text-[10px] text-muted-foreground">{cat.label.slice(0, 3)}</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, valueColor }: { icon: any; label: string; value: string; valueColor?: string }) {
  return (
    <motion.div
      className="bg-card rounded-lg border border-border p-4"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`text-lg font-semibold ${valueColor || "text-foreground"}`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
