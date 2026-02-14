import { useMemo } from "react";
import { motion } from "framer-motion";
import { StreakData } from "@/hooks/useEloRating";
import { Flame, Zap } from "lucide-react";

interface ActivityGraphProps {
  streak: StreakData;
}

export function ActivityGraph({ streak }: ActivityGraphProps) {
  // Generate last 16 weeks (112 days) of activity data
  const weeks = useMemo(() => {
    const today = new Date();
    const cells: { date: string; count: number; dayOfWeek: number }[] = [];

    for (let i = 111; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      cells.push({
        date: key,
        count: streak.activityMap.get(key) || 0,
        dayOfWeek: d.getDay(),
      });
    }

    // Group into weeks
    const grouped: typeof cells[] = [];
    let week: typeof cells = [];
    for (const cell of cells) {
      week.push(cell);
      if (cell.dayOfWeek === 6) {
        grouped.push(week);
        week = [];
      }
    }
    if (week.length > 0) grouped.push(week);
    return grouped;
  }, [streak.activityMap]);

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-secondary/60";
    if (count === 1) return "bg-accent/30";
    if (count === 2) return "bg-accent/50";
    if (count <= 4) return "bg-accent/70";
    return "bg-accent";
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">Activity</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-foreground font-semibold">{streak.currentStreak}</span>
            <span className="text-muted-foreground text-xs">day streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-foreground font-semibold">{streak.longestStreak}</span>
            <span className="text-muted-foreground text-xs">best</span>
          </div>
        </div>
      </div>

      {/* GitHub-style grid */}
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((cell, ci) => (
              <motion.div
                key={cell.date}
                className={`w-3 h-3 rounded-sm ${getIntensity(cell.count)}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (wi * 7 + ci) * 0.003, duration: 0.2 }}
                title={`${cell.date}: ${cell.count} argument${cell.count !== 1 ? "s" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-3 justify-end text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-secondary/60" />
        <div className="w-3 h-3 rounded-sm bg-accent/30" />
        <div className="w-3 h-3 rounded-sm bg-accent/50" />
        <div className="w-3 h-3 rounded-sm bg-accent/70" />
        <div className="w-3 h-3 rounded-sm bg-accent" />
        <span>More</span>
      </div>
    </div>
  );
}
