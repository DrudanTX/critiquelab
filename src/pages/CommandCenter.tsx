import { Layout } from "@/components/layout/Layout";
import { useArgumentScores } from "@/hooks/useArgumentScores";
import { useEloRating, useAchievements, useStreakData, useWeaknessAnalysis } from "@/hooks/useEloRating";
import { EloDisplay } from "@/components/command-center/EloDisplay";
import { ProgressChart } from "@/components/command-center/ProgressChart";
import { WeaknessHeatmap } from "@/components/command-center/WeaknessHeatmap";
import { ActivityGraph } from "@/components/command-center/ActivityGraph";
import { AchievementBadges } from "@/components/command-center/AchievementBadges";
import { Leaderboard } from "@/components/scoring/Leaderboard";
import { FadeIn } from "@/components/animations";
import { Crosshair } from "lucide-react";

export default function CommandCenter() {
  const { scores } = useArgumentScores();
  const elo = useEloRating(scores);
  const achievements = useAchievements(scores);
  const streak = useStreakData(scores);
  const weakness = useWeaknessAnalysis(scores);

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container px-4 md:px-6 py-8 space-y-6">
          {/* Header */}
          <FadeIn>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Command Center
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your cognitive performance hub
                </p>
              </div>
            </div>
          </FadeIn>

          {/* ELO Rating Hero */}
          <FadeIn delay={0.05}>
            <EloDisplay elo={elo} totalArguments={scores.length} />
          </FadeIn>

          {/* Activity Streak + Progress Chart */}
          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <ActivityGraph streak={streak} />
            </FadeIn>
            <FadeIn delay={0.15}>
              <ProgressChart scores={scores} elo={elo} />
            </FadeIn>
          </div>

          {/* Weakness Heatmap */}
          <FadeIn delay={0.2}>
            <WeaknessHeatmap data={weakness} />
          </FadeIn>

          {/* Achievements */}
          <FadeIn delay={0.25}>
            <AchievementBadges achievements={achievements} />
          </FadeIn>

          {/* Leaderboard */}
          <FadeIn delay={0.3}>
            <Leaderboard />
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}
