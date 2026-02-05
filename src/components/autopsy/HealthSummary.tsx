 import { motion } from "framer-motion";
 import { HealthSummary as HealthSummaryType, CATEGORY_CONFIG, SentenceCategory } from "@/types/argumentAutopsy";
 import { Progress } from "@/components/ui/progress";
 import { AlertTriangle, CheckCircle, XCircle, Target } from "lucide-react";
 
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
 
 export function HealthSummary({ summary }: HealthSummaryProps) {
   const getScoreColor = (score: number) => {
     if (score >= 71) return "text-green-600 dark:text-green-400";
     if (score >= 51) return "text-yellow-600 dark:text-yellow-400";
     if (score >= 31) return "text-orange-600 dark:text-orange-400";
     return "text-red-600 dark:text-red-400";
   };
 
   const getScoreLabel = (score: number) => {
     if (score >= 86) return "Exceptional";
     if (score >= 71) return "Strong";
     if (score >= 51) return "Developing";
     if (score >= 31) return "Weak";
     return "Needs Work";
   };
 
   const getScoreIcon = (score: number) => {
     if (score >= 71) return <CheckCircle className="w-5 h-5 text-green-500" />;
     if (score >= 51) return <Target className="w-5 h-5 text-yellow-500" />;
     if (score >= 31) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
     return <XCircle className="w-5 h-5 text-red-500" />;
   };
 
   return (
     <div className="bg-card rounded-lg border border-border p-6 space-y-6">
       <h3 className="font-display text-lg font-semibold text-foreground">
         Argument Health
       </h3>
 
       {/* Strength Score */}
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="text-center p-6 bg-secondary/50 rounded-lg"
       >
         <div className="flex items-center justify-center gap-2 mb-2">
           {getScoreIcon(summary.argumentStrengthScore)}
           <span className="text-sm text-muted-foreground">Argument Strength</span>
         </div>
         <div className={`text-5xl font-display font-bold ${getScoreColor(summary.argumentStrengthScore)}`}>
           {summary.argumentStrengthScore}
         </div>
         <div className="text-sm text-muted-foreground mt-1">
           {getScoreLabel(summary.argumentStrengthScore)}
         </div>
       </motion.div>
 
       {/* Analysis vs Filler */}
       <div className="space-y-3">
         <div className="flex justify-between text-sm">
           <span className="text-muted-foreground">Analysis</span>
           <span className="font-medium text-green-600 dark:text-green-400">
             {summary.analysisPercentage}%
           </span>
         </div>
         <Progress value={summary.analysisPercentage} className="h-2" />
         
         <div className="flex justify-between text-sm">
           <span className="text-muted-foreground">Filler/Restatement</span>
           <span className="font-medium text-red-600 dark:text-red-400">
             {summary.fillerPercentage}%
           </span>
         </div>
         <Progress value={summary.fillerPercentage} className="h-2 [&>div]:bg-red-500" />
       </div>
 
       {/* Breakdown */}
       <div className="space-y-2">
         <h4 className="text-sm font-medium text-foreground">Sentence Breakdown</h4>
         <div className="grid grid-cols-2 gap-2">
           {Object.entries(summary.breakdown).map(([key, count]) => {
             const categoryKey = BREAKDOWN_KEY_MAP[key] || key;
             const config = CATEGORY_CONFIG[categoryKey as SentenceCategory];
             if (!config) return null;
             return (
               <div 
                 key={key}
                 className={`flex items-center justify-between px-3 py-2 rounded-md ${config.bgClass}`}
               >
                 <span className={`text-xs font-medium ${config.textClass}`}>
                   {config.label}
                 </span>
                 <span className={`text-sm font-bold ${config.textClass}`}>
                   {count}
                 </span>
               </div>
             );
           })}
         </div>
       </div>
 
       {/* Missing Components */}
       {summary.missingComponents.length > 0 && (
         <div className="space-y-2">
           <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
             <AlertTriangle className="w-4 h-4 text-orange-500" />
             Missing Components
           </h4>
           <ul className="space-y-1">
             {summary.missingComponents.map((component, index) => (
               <motion.li
                 key={index}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="text-sm text-muted-foreground pl-4 border-l-2 border-orange-500/50"
               >
                 {component}
               </motion.li>
             ))}
           </ul>
         </div>
       )}
     </div>
   );
 }