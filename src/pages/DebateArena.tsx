import { useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn } from "@/components/animations";
import { DebateSetup } from "@/components/debate/DebateSetup";
import { DebateThread } from "@/components/debate/DebateThread";
import { DebateReport } from "@/components/debate/DebateReport";
import { SmartFlowView } from "@/components/smart-flow/SmartFlowView";
import { DebateMessage, DebateOpponent, DebateAnalysis } from "@/types/debate";
import { useArgumentScores } from "@/hooks/useArgumentScores";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Phase = "setup" | "debate" | "analyzing" | "report";

export default function DebateArena() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [topic, setTopic] = useState("");
  const [opponent, setOpponent] = useState<DebateOpponent | null>(null);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [analysis, setAnalysis] = useState<DebateAnalysis | null>(null);
  const [eloChange, setEloChange] = useState(0);
  const { addScore } = useArgumentScores();
  const { toast } = useToast();

  const handleStart = (selectedTopic: string, selectedOpponent: DebateOpponent) => {
    setTopic(selectedTopic);
    setOpponent(selectedOpponent);
    setMessages([]);
    setCurrentRound(1);
    setPhase("debate");
  };

  const handleSendMessage = useCallback(async (content: string) => {
    if (!opponent) return;

    const userMsg: DebateMessage = { role: "user", content, round: currentRound };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    const isLastRound = currentRound >= 3;

    setIsAiThinking(true);
    try {
      const { data, error } = await supabase.functions.invoke("debate", {
        body: {
          action: "respond",
          topic,
          opponent: opponent.id,
          round: currentRound,
          userArgument: content,
          debateHistory: updatedMessages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        },
      });

      if (error) {
        const status = (error as any)?.context?.status;
        if (status === 429) { toast({ title: "Rate limit", description: "Please wait a moment.", variant: "destructive" }); return; }
        if (status === 402) { toast({ title: "Credits exhausted", description: "Add credits to continue.", variant: "destructive" }); return; }
        throw error;
      }

      const aiMsg: DebateMessage = { role: "ai", content: data.response, round: currentRound };
      const allMessages = [...updatedMessages, aiMsg];
      setMessages(allMessages);

      if (!isLastRound) {
        setCurrentRound((r) => r + 1);
      }
    } catch (e) {
      console.error("Debate error:", e);
      toast({ title: "Error", description: "Failed to get AI response.", variant: "destructive" });
    } finally {
      setIsAiThinking(false);
    }
  }, [opponent, topic, currentRound, messages, toast]);

  const handleFinish = useCallback(async () => {
    if (!opponent) return;
    setPhase("analyzing");

    try {
      const { data, error } = await supabase.functions.invoke("debate", {
        body: {
          action: "analyze",
          topic,
          opponent: opponent.id,
          debateHistory: messages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        },
      });

      if (error) throw error;

      const a = data.analysis as DebateAnalysis;
      setAnalysis(a);

      const totalScore = a.clarity_score + a.evidence_score + a.logic_score + a.rebuttal_score;
      addScore({
        source: "coach" as const,
        inputPreview: `Debate: ${topic} vs ${opponent.name}`,
        totalScore,
        clarityScore: a.clarity_score,
        logicScore: a.logic_score,
        evidenceScore: a.evidence_score,
        defenseScore: a.rebuttal_score,
        clarityExplanation: `Debate clarity analysis`,
        logicExplanation: `Debate logic analysis`,
        evidenceExplanation: `Debate evidence analysis`,
        defenseExplanation: `Debate rebuttal analysis`,
        claritySuggestion: a.weaknesses[0] || "Keep practicing",
        logicSuggestion: a.weaknesses[1] || "Strengthen your reasoning",
        evidenceSuggestion: a.strengths[0] || "Good evidence usage",
        defenseSuggestion: a.strengths[1] || "Solid rebuttals",
      });

      const elo = Math.round(32 * (totalScore / 100 - 0.5));
      setEloChange(elo);

      setPhase("report");
    } catch (e) {
      console.error("Analysis error:", e);
      toast({ title: "Analysis failed", description: "Could not analyze the debate.", variant: "destructive" });
      setPhase("debate");
    }
  }, [opponent, topic, messages, addScore, toast]);

  const handleNewDebate = () => {
    setPhase("setup");
    setMessages([]);
    setCurrentRound(1);
    setAnalysis(null);
    setEloChange(0);
  };

  const isDebateComplete = currentRound >= 3 && messages.filter((m) => m.role === "ai").length >= 3;
  const showSmartFlow = (phase === "debate" || phase === "report") && opponent;

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container px-4 md:px-6 py-8 max-w-5xl">
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                ⚔️ AI Debate Arena
              </h1>
              <p className="text-muted-foreground mt-1">
                Structured debates against AI opponents. 3 rounds. Every word counts.
              </p>
            </div>
          </FadeIn>

          {phase === "setup" && (
            <FadeIn delay={0.1}>
              <DebateSetup onStart={handleStart} />
            </FadeIn>
          )}

          {phase === "analyzing" && (
            <FadeIn>
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-muted-foreground font-display">Analyzing your debate performance...</p>
              </div>
            </FadeIn>
          )}

          {showSmartFlow && (
            <FadeIn>
              <Tabs defaultValue={phase === "report" ? "report" : "debate"} className="w-full">
                <TabsList className="mb-4">
                  {phase === "debate" && (
                    <TabsTrigger value="debate">💬 Debate</TabsTrigger>
                  )}
                  {phase === "report" && analysis && (
                    <TabsTrigger value="report">📊 Report</TabsTrigger>
                  )}
                  <TabsTrigger value="smart-flow">🧠 Smart Flow</TabsTrigger>
                </TabsList>

                {phase === "debate" && (
                  <TabsContent value="debate">
                    <DebateThread
                      topic={topic}
                      opponent={opponent}
                      messages={messages}
                      currentRound={currentRound}
                      isAiThinking={isAiThinking}
                      isComplete={isDebateComplete}
                      onSendMessage={handleSendMessage}
                      onFinish={handleFinish}
                    />
                  </TabsContent>
                )}

                {phase === "report" && analysis && (
                  <TabsContent value="report">
                    <DebateReport
                      analysis={analysis}
                      opponent={opponent}
                      topic={topic}
                      eloChange={eloChange}
                      onNewDebate={handleNewDebate}
                    />
                  </TabsContent>
                )}

                <TabsContent value="smart-flow">
                  <SmartFlowView
                    topic={topic}
                    opponent={opponent}
                    messages={messages}
                    isDebateComplete={isDebateComplete}
                  />
                </TabsContent>
              </Tabs>
            </FadeIn>
          )}
        </div>
      </div>
    </Layout>
  );
}
