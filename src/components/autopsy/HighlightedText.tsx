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
     <div className="bg-card rounded-lg border border-border p-6">
       <h3 className="font-display text-lg font-semibold text-foreground mb-4">
         Analyzed Text
       </h3>
       
       {/* Legend */}
       <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-border">
         {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
           <div key={key} className="flex items-center gap-1.5">
             <div 
               className="w-3 h-3 rounded-sm" 
               style={{ backgroundColor: config.color }}
             />
             <span className="text-xs text-muted-foreground">{config.label}</span>
           </div>
         ))}
       </div>
 
       {/* Highlighted sentences */}
       <div className="leading-relaxed text-foreground">
         {sentences.map((sentence, index) => {
           const config = CATEGORY_CONFIG[sentence.category];
           return (
             <Tooltip key={index} delayDuration={100}>
               <TooltipTrigger asChild>
                 <motion.span
                   initial={{ opacity: 0, y: 5 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.05, duration: 0.2 }}
                   className={`inline rounded px-1 py-0.5 cursor-help transition-all hover:ring-2 hover:ring-offset-1 hover:ring-accent/50 ${config.bgClass}`}
                   style={{ marginRight: "4px" }}
                 >
                   {sentence.text}
                 </motion.span>
               </TooltipTrigger>
               <TooltipContent 
                 side="top" 
                 className="max-w-xs"
                 sideOffset={8}
               >
                 <div className="space-y-1">
                   <div className={`font-semibold text-sm ${config.textClass}`}>
                     {config.label}
                   </div>
                   <p className="text-xs text-muted-foreground">
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