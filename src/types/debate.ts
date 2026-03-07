export interface DebateMessage {
  role: "user" | "ai";
  content: string;
  round: number;
}

export interface DebateOpponent {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DebateAnalysis {
  overall_score: number;
  clarity_score: number;
  evidence_score: number;
  logic_score: number;
  rebuttal_score: number;
  strengths: string[];
  weaknesses: string[];
  verdict: "user_wins" | "ai_wins" | "draw";
  summary: string;
}

export const DEBATE_OPPONENTS: DebateOpponent[] = [
  { id: "skeptic", name: "The Skeptic", description: "Challenges every assumption", icon: "🔍" },
  { id: "lawyer", name: "The Lawyer", description: "Focuses on evidence & logic", icon: "⚖️" },
  { id: "philosopher", name: "The Philosopher", description: "Attacks reasoning foundations", icon: "🧠" },
  { id: "troll", name: "The Troll", description: "Tests with bad arguments", icon: "🃏" },
  { id: "politician", name: "The Politician", description: "Uses emotional persuasion", icon: "🎭" },
];

export const PRESET_TOPICS = [
  "Should AI be regulated by governments?",
  "Is college worth it in the modern economy?",
  "Should social media be restricted for teenagers?",
  "Is remote work better than office work?",
  "Should voting be mandatory?",
  "Is universal basic income a good idea?",
  "Should we colonize Mars?",
  "Is privacy more important than security?",
];

export const ROUND_LABELS: Record<number, string> = {
  1: "Opening Argument",
  2: "Rebuttal",
  3: "Closing Statement",
};
