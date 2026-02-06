import { motion } from "framer-motion";
import { AnalyzedSentence, CATEGORY_CONFIG } from "@/types/argumentAutopsy";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HighlightedTextProps {
  sentences: AnalyzedSentence[];
}

export function HighlightedText({ sentences }: HighlightedTextProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
      <h3 className="font-display text-lg font-medium text-foreground mb-6">
        Your argument, illuminated
      </h3>
      
      {/* Legend - softer colors */}
      <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-border/30">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full opacity-70" 
              style={{ backgroundColor: config.color }}
            />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Highlighted sentences */}
      <div className="leading-relaxed text-foreground font-display text-lg">
        {sentences.map((sentence, index) => {
          const config = CATEGORY_CONFIG[sentence.category];
          return (
            <Tooltip key={index} delayDuration={200}>
              <TooltipTrigger asChild>
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.08, 
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className={`inline rounded-lg px-1.5 py-0.5 cursor-help transition-all duration-smooth hover:ring-2 hover:ring-offset-2 hover:ring-accent/30 ${config.bgClass}`}
                  style={{ marginRight: "4px" }}
                >
                  {sentence.text}
                </motion.span>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="max-w-xs rounded-xl border-border/50 shadow-lg"
                sideOffset={12}
              >
                <div className="space-y-1.5 p-1">
                  <div className={`font-medium text-sm ${config.textClass}`}>
                    {config.label}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sentence.explanation}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
