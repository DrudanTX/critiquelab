 import { motion } from "framer-motion";
 import { Suggestion } from "@/types/argumentAutopsy";
 import { Lightbulb, ArrowRight, Sparkles } from "lucide-react";
 
 interface ImprovementSuggestionsProps {
   suggestions: Suggestion[];
 }
 
 const SUGGESTION_ICONS: Record<string, React.ReactNode> = {
   add_warrant: <ArrowRight className="w-4 h-4" />,
   add_evidence: <Sparkles className="w-4 h-4" />,
   add_impact: <Lightbulb className="w-4 h-4" />,
   reduce_filler: <ArrowRight className="w-4 h-4" />,
   clarify_claim: <Lightbulb className="w-4 h-4" />,
   strengthen_reasoning: <Sparkles className="w-4 h-4" />,
 };
 
 export function ImprovementSuggestions({ suggestions }: ImprovementSuggestionsProps) {
   return (
     <div className="bg-card rounded-lg border border-border p-6">
       <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
         <Lightbulb className="w-5 h-5 text-accent" />
         How to Improve
       </h3>
 
       <div className="space-y-3">
         {suggestions.map((suggestion, index) => (
           <motion.div
             key={index}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: index * 0.1 }}
             className="flex gap-3 p-4 bg-secondary/50 rounded-lg hover:bg-secondary/80 transition-colors"
           >
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
               {SUGGESTION_ICONS[suggestion.type] || <Lightbulb className="w-4 h-4" />}
             </div>
             <div className="flex-1">
               <p className="text-sm text-foreground leading-relaxed">
                 {suggestion.text}
               </p>
               {suggestion.targetSentence !== null && (
                 <p className="text-xs text-muted-foreground mt-1">
                   → Applies to sentence {suggestion.targetSentence + 1}
                 </p>
               )}
             </div>
           </motion.div>
         ))}
       </div>
 
       <div className="mt-4 pt-4 border-t border-border">
         <p className="text-xs text-muted-foreground italic">
           💡 Tip: Focus on adding reasoning (the "why") to strengthen your argument. 
           Every claim should have a clear warrant explaining its logic.
         </p>
       </div>
     </div>
   );
 }