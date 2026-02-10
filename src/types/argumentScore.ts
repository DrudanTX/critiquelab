export interface ArgumentScore {
  id: string;
  source: "critique" | "coach" | "autopsy";
  inputPreview: string;
  totalScore: number;
  clarityScore: number;
  logicScore: number;
  evidenceScore: number;
  defenseScore: number;
  clarityExplanation: string;
  logicExplanation: string;
  evidenceExplanation: string;
  defenseExplanation: string;
  claritySuggestion: string;
  logicSuggestion: string;
  evidenceSuggestion: string;
  defenseSuggestion: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  highest_score: number;
  avg_score: number;
  total_arguments: number;
  last_active: string;
}

export const SCORE_CATEGORIES = [
  { key: "clarity" as const, label: "Clarity", color: "hsl(var(--accent))" },
  { key: "logic" as const, label: "Logic", color: "hsl(var(--info))" },
  { key: "evidence" as const, label: "Evidence", color: "hsl(var(--accent-secondary))" },
  { key: "defense" as const, label: "Defense", color: "hsl(var(--warning))" },
] as const;
