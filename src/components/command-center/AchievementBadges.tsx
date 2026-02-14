import { motion } from "framer-motion";
import { Achievement } from "@/hooks/useEloRating";
import { Trophy } from "lucide-react";

interface AchievementBadgesProps {
  achievements: Achievement[];
}

export function AchievementBadges({ achievements }: AchievementBadgesProps) {
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Achievements
        </h3>
        <span className="text-sm text-muted-foreground">{unlocked}/{achievements.length}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {achievements.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex flex-col items-center text-center p-3 rounded-lg border transition-all ${
              badge.unlocked
                ? "bg-accent/5 border-accent/20"
                : "bg-secondary/20 border-border opacity-40 grayscale"
            }`}
          >
            <span className="text-2xl mb-1">{badge.icon}</span>
            <span className="text-xs font-semibold text-foreground leading-tight">{badge.name}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{badge.description}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
