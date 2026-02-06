import { motion } from "framer-motion";
import { HealthSummary as HealthSummaryType, CATEGORY_CONFIG, SentenceCategory } from "@/types/argumentAutopsy";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle, AlertCircle, Target } from "lucide-react";

// Map breakdown keys to CATEGORY_CONFIG keys
const BREAKDOWN_KEY_MAP: Record<string, SentenceCategory> = {
  claims: "claim",
  reasoning: "reasoning",
  evidence: "evidence",
  impact: "impact",
  filler: "filler",
};

interface HealthSummaryProps {
  summary: HealthSummaryType;
}

function getScoreMessage(score: number): { text: string; subtext: string } {
  if (score >= 80) return { 
    text: "Strong foundation", 
    subtext: "You're onto something here." 
  };
  if (score >= 60) return { 
    text: "Good progress", 
    subtext: "A few tweaks could make this shine." 
  };
  if (score >= 40) return { 
    text: "Taking shape", 
    subtext: "Some ideas could go one layer deeper." 
  };
  return { 
    text: "Early stages", 
    subtext: "Nice start—let's build on this together." 
  };
}

function getScoreIcon(score: number) {
  if (score >= 70) return <Sparkles className="w-5 h-5" />;
  if (score >= 50) return <CheckCircle className="w-5 h-5" />;
  return <Target className="w-5 h-5" />;
}

export function HealthSummary({ summary }: HealthSummaryProps) {
  const scoreMessage = getScoreMessage(summary.argumentStrengthScore);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm sticky top-24">
      {/* Score Section */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
          <span className="text-3xl font-display font-medium text-accent">
            {summary.argumentStrengthScore}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 text-foreground font-medium mb-1">
          {getScoreIcon(summary.argumentStrengthScore)}
          <span>{scoreMessage.text}</span>
        </div>
        <p className="text-sm text-muted-foreground italic">
          {scoreMessage.subtext}
        </p>
      </motion.div>

      {/* Analysis vs Filler */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Analytical content</span>
          <span className="font-medium text-foreground">{summary.analysisPercentage}%</span>
        </div>
        <Progress 
          value={summary.analysisPercentage} 
          className="h-2 rounded-full bg-secondary/80"
        />
        <p className="text-xs text-muted-foreground">
          {summary.analysisPercentage >= 70 
            ? "Nice work—clarity builds over time." 
            : "Room to deepen—that's where the magic is."}
        </p>
      </div>

      {/* Missing Components - calm amber tones instead of red */}
      {summary.missingComponents.length > 0 && (
        <motion.div 
          className="mb-8 p-4 bg-warning/10 rounded-xl border border-warning/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Could use attention
              </h4>
              <ul className="space-y-1.5">
                {summary.missingComponents.map((component, index) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    {component}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Sentence breakdown</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(summary.breakdown).map(([key, count]) => {
            const categoryKey = BREAKDOWN_KEY_MAP[key] || key;
            const config = CATEGORY_CONFIG[categoryKey as SentenceCategory];
            if (!config) return null;
            return (
              <motion.div 
                key={key}
                className="flex items-center gap-2 p-3 bg-secondary/40 rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full opacity-70"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-xs text-muted-foreground flex-1">{config.label}</span>
                <span className="text-sm font-medium text-foreground">{count}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
