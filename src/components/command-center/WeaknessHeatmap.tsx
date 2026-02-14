import { motion } from "framer-motion";
import { WeaknessData } from "@/hooks/useEloRating";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { SCORE_CATEGORIES } from "@/types/argumentScore";

interface WeaknessHeatmapProps {
  data: WeaknessData;
}

export function WeaknessHeatmap({ data }: WeaknessHeatmapProps) {
  if (data.clarity.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Score arguments to reveal your weakness patterns.</p>
      </div>
    );
  }

  const categories = [
    { key: "clarity" as const, scores: data.clarity },
    { key: "logic" as const, scores: data.logic },
    { key: "evidence" as const, scores: data.evidence },
    { key: "defense" as const, scores: data.defense },
  ];

  const trendForCategory = (cat: string) => data.trend.find(t => t.category === cat);

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="font-display text-lg font-semibold text-foreground">Weakness Heatmap</h3>
      </div>

      <div className="space-y-4">
        {categories.map((cat, ci) => {
          const avg = Math.round(cat.scores.reduce((a, b) => a + b, 0) / cat.scores.length);
          const catInfo = SCORE_CATEGORIES.find(c => c.key === cat.key)!;
          const trend = trendForCategory(cat.key);
          const isWeakest = data.weakest === cat.key;
          const intensity = 1 - avg / 25; // 0 = strong, 1 = weak

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ci * 0.1 }}
              className={`p-4 rounded-lg border transition-colors ${
                isWeakest ? "border-warning/40 bg-warning/5" : "border-border bg-secondary/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{catInfo.label}</span>
                  {isWeakest && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning font-medium">
                      FOCUS AREA
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{avg}/25</span>
                  {trend && (
                    <span className={`flex items-center gap-0.5 text-xs ${
                      trend.direction === "improving" ? "text-accent" :
                      trend.direction === "declining" ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {trend.direction === "improving" ? <TrendingUp className="w-3 h-3" /> :
                       trend.direction === "declining" ? <TrendingDown className="w-3 h-3" /> :
                       <Minus className="w-3 h-3" />}
                    </span>
                  )}
                </div>
              </div>

              {/* Mini heatmap row: last N scores */}
              <div className="flex gap-1">
                {cat.scores.slice(-20).map((score, i) => {
                  const pct = score / 25;
                  return (
                    <div
                      key={i}
                      className="flex-1 h-3 rounded-sm min-w-[4px]"
                      style={{
                        backgroundColor: pct >= 0.8 ? "hsl(var(--accent))" :
                          pct >= 0.6 ? "hsl(var(--info))" :
                          pct >= 0.4 ? "hsl(var(--warning))" :
                          "hsl(var(--destructive))",
                        opacity: 0.4 + pct * 0.6,
                      }}
                      title={`${score}/25`}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
