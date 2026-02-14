import { useMemo } from "react";
import { ArgumentScore } from "@/types/argumentScore";

export interface EloData {
  rating: number;
  tier: string;
  tierColor: string;
  percentile: number;
  ratingHistory: { date: string; rating: number }[];
}

const TIERS = [
  { min: 0, label: "Bronze", color: "hsl(30 60% 50%)" },
  { min: 800, label: "Silver", color: "hsl(220 8% 55%)" },
  { min: 1000, label: "Gold", color: "hsl(45 85% 50%)" },
  { min: 1200, label: "Platinum", color: "hsl(200 70% 55%)" },
  { min: 1400, label: "Diamond", color: "hsl(280 60% 60%)" },
  { min: 1600, label: "Grandmaster", color: "hsl(0 70% 55%)" },
];

function getTier(rating: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (rating >= TIERS[i].min) return TIERS[i];
  }
  return TIERS[0];
}

// Approximate percentile from rating using a sigmoid curve centered at 1000
function getPercentile(rating: number): number {
  const z = (rating - 1000) / 200;
  const p = 1 / (1 + Math.exp(-z));
  return Math.round(p * 100);
}

export function useEloRating(scores: ArgumentScore[]): EloData {
  return useMemo(() => {
    if (scores.length === 0) {
      const tier = getTier(1000);
      return { rating: 1000, tier: tier.label, tierColor: tier.color, percentile: 50, ratingHistory: [] };
    }

    // Sort by date ascending
    const sorted = [...scores].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    let rating = 1000;
    const K = 32;
    const history: { date: string; rating: number }[] = [];

    for (const score of sorted) {
      // Treat each argument as a match against a "benchmark" of 65/100
      const actual = score.totalScore / 100; // normalize to 0-1
      const expected = 1 / (1 + Math.pow(10, (65 - score.totalScore) / 40));
      rating = Math.round(rating + K * (actual - expected));
      rating = Math.max(100, Math.min(2500, rating));
      history.push({ date: score.createdAt, rating });
    }

    const tier = getTier(rating);
    return {
      rating,
      tier: tier.label,
      tierColor: tier.color,
      percentile: getPercentile(rating),
      ratingHistory: history,
    };
  }, [scores]);
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export function useAchievements(scores: ArgumentScore[]): Achievement[] {
  return useMemo(() => {
    const sorted = [...scores].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Streak calculation
    const daySet = new Set(sorted.map(s => new Date(s.createdAt).toISOString().slice(0, 10)));
    const days = [...daySet].sort();
    let maxStreak = 0, streak = 1;
    for (let i = 1; i < days.length; i++) {
      const diff = (new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) / 86400000;
      if (diff === 1) { streak++; maxStreak = Math.max(maxStreak, streak); }
      else streak = 1;
    }
    if (days.length === 1) maxStreak = 1;

    const highestScore = scores.length > 0 ? Math.max(...scores.map(s => s.totalScore)) : 0;
    const perfectLogic = scores.some(s => s.logicScore === 25);
    const perfectClarity = scores.some(s => s.clarityScore === 25);

    return [
      { id: "first_blood", name: "First Blood", description: "Complete your first scored argument", icon: "⚔️", unlocked: scores.length >= 1, unlockedAt: sorted[0]?.createdAt },
      { id: "five_rounds", name: "Warming Up", description: "Score 5 arguments", icon: "🔥", unlocked: scores.length >= 5 },
      { id: "twenty_rounds", name: "Veteran", description: "Score 20 arguments", icon: "🎖️", unlocked: scores.length >= 20 },
      { id: "sharpshooter", name: "Sharpshooter", description: "Score above 80 on any argument", icon: "🎯", unlocked: highestScore >= 80 },
      { id: "masterclass", name: "Masterclass", description: "Score above 90 on any argument", icon: "👑", unlocked: highestScore >= 90 },
      { id: "iron_logic", name: "Iron Logic", description: "Get a perfect Logic score (25/25)", icon: "🧠", unlocked: perfectLogic },
      { id: "crystal_clear", name: "Crystal Clear", description: "Get a perfect Clarity score (25/25)", icon: "💎", unlocked: perfectClarity },
      { id: "streak_3", name: "On Fire", description: "Maintain a 3-day streak", icon: "🔥", unlocked: maxStreak >= 3 },
      { id: "streak_7", name: "Unstoppable", description: "Maintain a 7-day streak", icon: "⚡", unlocked: maxStreak >= 7 },
      { id: "all_sources", name: "Well-Rounded", description: "Score from critique, coach, and autopsy", icon: "🌐", unlocked: new Set(scores.map(s => s.source)).size >= 3 },
    ];
  }, [scores]);
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  activityMap: Map<string, number>; // date -> count
}

export function useStreakData(scores: ArgumentScore[]): StreakData {
  return useMemo(() => {
    const activityMap = new Map<string, number>();
    for (const s of scores) {
      const day = new Date(s.createdAt).toISOString().slice(0, 10);
      activityMap.set(day, (activityMap.get(day) || 0) + 1);
    }

    const days = [...activityMap.keys()].sort();
    let currentStreak = 0, longestStreak = 0, streak = 0;
    const today = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < days.length; i++) {
      if (i === 0) { streak = 1; }
      else {
        const diff = (new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) / 86400000;
        streak = diff === 1 ? streak + 1 : 1;
      }
      longestStreak = Math.max(longestStreak, streak);
      if (days[i] === today || (new Date(today).getTime() - new Date(days[i]).getTime()) / 86400000 <= 1) {
        currentStreak = streak;
      }
    }

    return { currentStreak, longestStreak, activityMap };
  }, [scores]);
}

export interface WeaknessData {
  clarity: number[];
  logic: number[];
  evidence: number[];
  defense: number[];
  weakest: string;
  trend: { category: string; direction: "improving" | "declining" | "stable" }[];
}

export function useWeaknessAnalysis(scores: ArgumentScore[]): WeaknessData {
  return useMemo(() => {
    const empty: WeaknessData = {
      clarity: [], logic: [], evidence: [], defense: [],
      weakest: "clarity",
      trend: [],
    };
    if (scores.length === 0) return empty;

    const sorted = [...scores].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const data: WeaknessData = {
      clarity: sorted.map(s => s.clarityScore),
      logic: sorted.map(s => s.logicScore),
      evidence: sorted.map(s => s.evidenceScore),
      defense: sorted.map(s => s.defenseScore),
      weakest: "",
      trend: [],
    };

    const avgs = {
      clarity: data.clarity.reduce((a, b) => a + b, 0) / data.clarity.length,
      logic: data.logic.reduce((a, b) => a + b, 0) / data.logic.length,
      evidence: data.evidence.reduce((a, b) => a + b, 0) / data.evidence.length,
      defense: data.defense.reduce((a, b) => a + b, 0) / data.defense.length,
    };

    data.weakest = Object.entries(avgs).reduce((a, b) => a[1] <= b[1] ? a : b)[0];

    // Trend: compare last 3 vs previous 3
    const categories = ["clarity", "logic", "evidence", "defense"] as const;
    for (const cat of categories) {
      const vals = data[cat];
      if (vals.length < 4) {
        data.trend.push({ category: cat, direction: "stable" });
        continue;
      }
      const recent = vals.slice(-3).reduce((a, b) => a + b, 0) / 3;
      const older = vals.slice(-6, -3).reduce((a, b) => a + b, 0) / Math.min(3, vals.slice(-6, -3).length || 1);
      const diff = recent - older;
      data.trend.push({ category: cat, direction: diff > 1 ? "improving" : diff < -1 ? "declining" : "stable" });
    }

    return data;
  }, [scores]);
}
