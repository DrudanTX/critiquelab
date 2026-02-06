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
    <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
      <h3 className="font-display text-lg font-medium text-foreground mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-accent" />
        </div>
        Ideas for going deeper
      </h3>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.12, 
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="group flex gap-4 p-5 bg-secondary/40 rounded-xl hover:bg-secondary/60 transition-all duration-smooth border border-transparent hover:border-accent/20"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-all duration-smooth">
              {SUGGESTION_ICONS[suggestion.type] || <Lightbulb className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                {suggestion.text}
              </p>
              {suggestion.targetSentence !== null && (
                <p className="text-xs text-muted-foreground mt-2">
                  → For sentence {suggestion.targetSentence + 1}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-6 pt-6 border-t border-border/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-xs text-muted-foreground italic leading-relaxed">
          💡 Remember: the best arguments explain the "why" behind each claim. 
          Take your time—depth beats breadth.
        </p>
      </motion.div>
    </div>
  );
}
