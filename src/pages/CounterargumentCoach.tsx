import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, ScaleOnHover } from "@/components/animations";
import { Loader2, Swords, ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { CounterargumentCard } from "@/components/coach/CounterargumentCard";
import { RebuttalCoachCard } from "@/components/coach/RebuttalCoachCard";
import { CoachResult } from "@/types/counterargumentCoach";


const MIN_TEXT_LENGTH = 20;
const MAX_TEXT_LENGTH = 10000;

export default function CounterargumentCoach() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CoachResult | null>(null);
  const { toast } = useToast();
  

  const handleChallenge = async () => {
    const trimmedText = inputText.trim();

    if (trimmedText.length < MIN_TEXT_LENGTH) {
      toast({
        title: "Need more to work with",
        description: `Give us at least ${MIN_TEXT_LENGTH} characters to challenge.`,
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("counterargument-coach", {
        body: { text: trimmedText },
      });

      if (error) {
        const status = (error as any)?.context?.status ?? (error as any)?.status;

        if (status === 429) {
          toast({
            title: "Slow down",
            description: "Too many requests. Try again in a moment.",
          });
          return;
        }

        if (status === 402) {
          toast({
            title: "Credits needed",
            description: "Add credits to keep going.",
          });
          return;
        }

        throw error;
      }

      setResult(data.result);
      toast({
        title: "Challenge ready",
        description: "Here's what a strong opponent would say.",
      });
    } catch (error) {
      console.error("Counterargument coach error:", error);
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Let's try that again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setResult(null);
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-background cursor-pulse">
        <div className="container px-4 md:px-6 py-10 md:py-14">
          {/* Header */}
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Swords className="w-5 h-5 text-accent" />
                    </motion.div>
                    Counterargument Coach
                  </h1>
                  <p className="text-muted-foreground mt-2 text-sm">
                    See your argument through a challenger's eyes
                  </p>
                </div>
              </div>
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <ScaleOnHover scale={1.02}>
                      <Button variant="calm" onClick={handleReset}>
                        <RotateCcw size={16} className="mr-2" />
                        New Challenge
                      </Button>
                    </ScaleOnHover>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>

          <AnimatePresence mode="wait">
            {!result ? (
              /* Input View */
              <motion.div
                key="input"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <FadeIn delay={0.1}>
                  <div className="max-w-3xl mx-auto">
                    <div className="bg-card rounded-2xl border border-border/50 p-8 md:p-10 shadow-sm">
                      <h2 className="font-display text-xl font-medium text-foreground mb-3">
                        Share your position
                      </h2>
                      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                        Paste a paragraph, essay, or position you want to stress-test. You'll receive counterarguments from logical, ethical, and practical perspectives.
                      </p>

                      <div className="space-y-5">
                        <div className="relative">
                          <Textarea
                            className="min-h-[220px] text-base resize-none calm-input border-0 rounded-xl focus:ring-2 focus:ring-accent/20"
                            placeholder="Social media should be banned for users under 16. The evidence shows that early exposure to social platforms leads to increased anxiety, cyberbullying, and decreased academic performance..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={isLoading}
                            maxLength={MAX_TEXT_LENGTH}
                          />
                          <div className="absolute bottom-3 right-4 text-xs text-muted-foreground/60">
                            {inputText.length.toLocaleString()}/{MAX_TEXT_LENGTH.toLocaleString()}
                          </div>
                        </div>

                        {inputText.length > 0 && inputText.length < MIN_TEXT_LENGTH && (
                          <p className="text-xs text-muted-foreground">
                            Just a bit more — {MIN_TEXT_LENGTH - inputText.length} more characters
                          </p>
                        )}

                        <div className="flex justify-end pt-2">
                          <ScaleOnHover scale={1.02}>
                            <Button
                              variant="hero"
                              size="lg"
                              disabled={inputText.trim().length < MIN_TEXT_LENGTH || isLoading}
                              onClick={handleChallenge}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Finding opponents...
                                </>
                              ) : (
                                <>
                                  <Swords className="mr-2 h-4 w-4" />
                                  Challenge Me
                                </>
                              )}
                            </Button>
                          </ScaleOnHover>
                        </div>
                      </div>
                    </div>

                    {/* How it works */}
                    <motion.div
                      className="mt-8 bg-secondary/40 rounded-2xl p-8 border border-border/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <h3 className="font-display text-sm font-medium text-foreground mb-4">
                        How it works
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex gap-3">
                          <span className="w-3 h-3 rounded-full bg-info/60 flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium text-foreground">Logical</span> — Attacks your reasoning and consistency
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-3 h-3 rounded-full bg-accent-secondary/60 flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium text-foreground">Ethical</span> — Challenges your moral foundations
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-3 h-3 rounded-full bg-warning/60 flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium text-foreground">Practical</span> — Questions real-world feasibility
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </FadeIn>
              </motion.div>
            ) : (
              /* Results View */
              <motion.div
                key="results"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Counterargument Cards */}
                  {result.counterarguments.map((ca, i) => (
                    <CounterargumentCard key={ca.perspective} counterargument={ca} index={i} />
                  ))}

                  {/* Rebuttal Coach */}
                  <RebuttalCoachCard coach={result.rebuttonCoach} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
