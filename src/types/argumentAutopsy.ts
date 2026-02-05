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
 
 export const CATEGORY_CONFIG: Record<SentenceCategory, { label: string; color: string; bgClass: string; textClass: string }> = {
   claim: {
     label: "Claim",
     color: "hsl(142 71% 45%)",
     bgClass: "bg-green-500/20 dark:bg-green-500/30",
     textClass: "text-green-700 dark:text-green-300",
   },
   reasoning: {
     label: "Reasoning",
     color: "hsl(45 93% 47%)",
     bgClass: "bg-yellow-500/20 dark:bg-yellow-500/30",
     textClass: "text-yellow-700 dark:text-yellow-300",
   },
   evidence: {
     label: "Evidence",
     color: "hsl(217 91% 60%)",
     bgClass: "bg-blue-500/20 dark:bg-blue-500/30",
     textClass: "text-blue-700 dark:text-blue-300",
   },
   impact: {
     label: "Impact",
     color: "hsl(270 70% 60%)",
     bgClass: "bg-purple-500/20 dark:bg-purple-500/30",
     textClass: "text-purple-700 dark:text-purple-300",
   },
   filler: {
     label: "Filler",
     color: "hsl(0 72% 51%)",
     bgClass: "bg-red-500/20 dark:bg-red-500/30",
     textClass: "text-red-700 dark:text-red-300",
   },
 };