 import { useState } from "react";
 import { Layout } from "@/components/layout/Layout";
 import { Button } from "@/components/ui/button";
 import { Textarea } from "@/components/ui/textarea";
 import { useToast } from "@/hooks/use-toast";
 import { supabase } from "@/integrations/supabase/client";
 import { motion, AnimatePresence } from "framer-motion";
 import { FadeIn, ScaleOnHover } from "@/components/animations";
 import { Loader2, Microscope, ArrowLeft, RotateCcw } from "lucide-react";
 import { Link } from "react-router-dom";
 import { HighlightedText } from "@/components/autopsy/HighlightedText";
 import { HealthSummary } from "@/components/autopsy/HealthSummary";
 import { ImprovementSuggestions } from "@/components/autopsy/ImprovementSuggestions";
 import { ArgumentAnalysis } from "@/types/argumentAutopsy";
 
 const MIN_TEXT_LENGTH = 20;
 const MAX_TEXT_LENGTH = 10000;
 
 export default function ArgumentAutopsy() {
   const [inputText, setInputText] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [analysis, setAnalysis] = useState<ArgumentAnalysis | null>(null);
   const { toast } = useToast();
 
   const handleAnalyze = async () => {
     const trimmedText = inputText.trim();
     
     if (trimmedText.length < MIN_TEXT_LENGTH) {
       toast({
         title: "Text too short",
         description: `Please enter at least ${MIN_TEXT_LENGTH} characters.`,
         variant: "destructive",
       });
       return;
     }
 
     setIsLoading(true);
     setAnalysis(null);
 
     try {
       const { data, error } = await supabase.functions.invoke("argument-autopsy", {
         body: { text: trimmedText },
       });
 
       if (error) {
         const status = (error as any)?.context?.status ?? (error as any)?.status;
         
         if (status === 429) {
           toast({
             title: "Rate limit exceeded",
             description: "Too many requests. Please try again in a moment.",
             variant: "destructive",
           });
           return;
         }
 
         if (status === 402) {
           toast({
             title: "Credits exhausted",
             description: "Please add credits to continue.",
             variant: "destructive",
           });
           return;
         }
 
         throw error;
       }
 
       setAnalysis(data.analysis);
       toast({
         title: "Analysis complete",
         description: "Your argument has been dissected.",
       });
     } catch (error) {
       console.error("Analysis error:", error);
       toast({
         title: "Analysis failed",
         description: error instanceof Error ? error.message : "Something went wrong.",
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   const handleReset = () => {
     setInputText("");
     setAnalysis(null);
   };
 
   return (
     <Layout showFooter={false}>
       <div className="min-h-[calc(100vh-4rem)] bg-background">
         <div className="container px-4 md:px-6 py-8">
           {/* Header */}
           <FadeIn>
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               <div className="flex items-center gap-4">
                 <Link to="/">
                   <Button variant="ghost" size="icon">
                     <ArrowLeft className="w-5 h-5" />
                   </Button>
                 </Link>
                 <div>
                   <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
                     <Microscope className="w-8 h-8 text-accent" />
                     Argument Autopsy
                   </h1>
                   <p className="text-muted-foreground mt-1">
                     X-ray vision for your arguments
                   </p>
                 </div>
               </div>
               <AnimatePresence>
                 {analysis && (
                   <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                   >
                     <ScaleOnHover>
                       <Button variant="outline" onClick={handleReset}>
                         <RotateCcw size={18} className="mr-2" />
                         Start Over
                       </Button>
                     </ScaleOnHover>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           </FadeIn>
 
           <AnimatePresence mode="wait">
             {!analysis ? (
               /* Input View */
               <motion.div
                 key="input"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.3 }}
               >
                 <FadeIn delay={0.1}>
                   <div className="max-w-3xl mx-auto">
                     <div className="bg-card rounded-lg border border-border p-6 md:p-8">
                       <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                         Paste Your Argument
                       </h2>
                       <p className="text-sm text-muted-foreground mb-6">
                         Enter a paragraph, debate case, or rebuttal to see what parts 
                         actually do analytical work vs. filler.
                       </p>
 
                       <div className="space-y-4">
                         <div className="relative">
                           <Textarea
                             className="min-h-[200px] text-base resize-none"
                             placeholder="The death penalty should be abolished because it is morally wrong. Studies show that it doesn't deter crime. Furthermore, innocent people have been executed. This matters because we cannot take back a wrongful execution..."
                             value={inputText}
                             onChange={(e) => setInputText(e.target.value)}
                             disabled={isLoading}
                             maxLength={MAX_TEXT_LENGTH}
                           />
                           <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                             {inputText.length.toLocaleString()}/{MAX_TEXT_LENGTH.toLocaleString()}
                           </div>
                         </div>
 
                         {inputText.length > 0 && inputText.length < MIN_TEXT_LENGTH && (
                           <p className="text-xs text-muted-foreground">
                             Minimum {MIN_TEXT_LENGTH} characters required
                           </p>
                         )}
 
                         <div className="flex justify-end">
                           <ScaleOnHover>
                             <Button
                               variant="hero"
                               size="lg"
                               disabled={inputText.trim().length < MIN_TEXT_LENGTH || isLoading}
                               onClick={handleAnalyze}
                             >
                               {isLoading ? (
                                 <>
                                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                   Dissecting...
                                 </>
                               ) : (
                                 <>
                                   <Microscope className="mr-2 h-4 w-4" />
                                   Analyze Argument
                                 </>
                               )}
                             </Button>
                           </ScaleOnHover>
                         </div>
                       </div>
                     </div>
 
                     {/* Tips */}
                     <div className="mt-6 bg-secondary/50 rounded-lg p-6">
                       <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                         What We Analyze
                       </h3>
                       <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                         <div className="flex gap-2">
                           <span className="w-3 h-3 rounded-sm bg-green-500 flex-shrink-0 mt-1" />
                           <div>
                             <span className="font-medium text-foreground">Claims</span> — Your central assertions
                           </div>
                         </div>
                         <div className="flex gap-2">
                           <span className="w-3 h-3 rounded-sm bg-yellow-500 flex-shrink-0 mt-1" />
                           <div>
                             <span className="font-medium text-foreground">Reasoning</span> — Why your claim is true
                           </div>
                         </div>
                         <div className="flex gap-2">
                           <span className="w-3 h-3 rounded-sm bg-blue-500 flex-shrink-0 mt-1" />
                           <div>
                             <span className="font-medium text-foreground">Evidence</span> — Facts, stats, examples
                           </div>
                         </div>
                         <div className="flex gap-2">
                           <span className="w-3 h-3 rounded-sm bg-purple-500 flex-shrink-0 mt-1" />
                           <div>
                             <span className="font-medium text-foreground">Impact</span> — Why it matters
                           </div>
                         </div>
                         <div className="flex gap-2 md:col-span-2">
                           <span className="w-3 h-3 rounded-sm bg-red-500 flex-shrink-0 mt-1" />
                           <div>
                             <span className="font-medium text-foreground">Filler</span> — Restatement without new analysis
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </FadeIn>
               </motion.div>
             ) : (
               /* Results View */
               <motion.div
                 key="results"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.3 }}
               >
                 <div className="grid lg:grid-cols-3 gap-6">
                   {/* Main Content */}
                   <div className="lg:col-span-2 space-y-6">
                     <FadeIn delay={0.1}>
                       <HighlightedText sentences={analysis.sentences} />
                     </FadeIn>
                     <FadeIn delay={0.2}>
                       <ImprovementSuggestions suggestions={analysis.suggestions} />
                     </FadeIn>
                   </div>
 
                   {/* Sidebar */}
                   <div className="lg:col-span-1">
                     <FadeIn delay={0.15} direction="right">
                       <HealthSummary summary={analysis.healthSummary} />
                     </FadeIn>
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>
       </div>
     </Layout>
   );
 }