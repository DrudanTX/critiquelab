export type SentenceCategory = "claim" | "reasoning" | "evidence" | "impact" | "filler";

export interface AnalyzedSentence {
  text: string;
  category: SentenceCategory;
  explanation: string;
}

export interface HealthSummary {
  analysisPercentage: number;
  fillerPercentage: number;
  missingComponents: string[];
  argumentStrengthScore: number;
  breakdown: {
    claims: number;
    reasoning: number;
    evidence: number;
    impact: number;
    filler: number;
  };
}

export interface Suggestion {
  type: string;
  text: string;
  targetSentence: number | null;
}

export interface ArgumentAnalysis {
  sentences: AnalyzedSentence[];
  healthSummary: HealthSummary;
  suggestions: Suggestion[];
}

// Calmer, muted color palette for lo-fi aesthetic
export const CATEGORY_CONFIG: Record<SentenceCategory, { 
  label: string; 
  color: string; 
  bgClass: string; 
  textClass: string 
}> = {
  claim: {
    label: "Claim",
    color: "hsl(150 25% 55%)", // Muted sage green
    bgClass: "bg-accent/15 dark:bg-accent/20",
    textClass: "text-accent dark:text-accent",
  },
  reasoning: {
    label: "Reasoning",
    color: "hsl(38 60% 60%)", // Warm amber
    bgClass: "bg-warning/15 dark:bg-warning/20",
    textClass: "text-warning-foreground dark:text-warning",
  },
  evidence: {
    label: "Evidence",
    color: "hsl(210 35% 60%)", // Dusty blue
    bgClass: "bg-info/15 dark:bg-info/20",
    textClass: "text-info dark:text-info",
  },
  impact: {
    label: "Impact",
    color: "hsl(270 30% 60%)", // Muted violet
    bgClass: "bg-accent-secondary/15 dark:bg-accent-secondary/20",
    textClass: "text-accent-secondary dark:text-accent-secondary",
  },
  filler: {
    label: "Room to grow",
    color: "hsl(350 40% 65%)", // Soft rose
    bgClass: "bg-destructive/10 dark:bg-destructive/15",
    textClass: "text-destructive dark:text-destructive",
  },
};
