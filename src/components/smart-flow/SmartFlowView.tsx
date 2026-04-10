import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FileText, Eye, Radio, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartFlowData } from "@/types/smartFlow";
import { DebateMessage, DebateOpponent } from "@/types/debate";
import { FlowArgumentCard } from "./FlowArgumentCard";
import { DroppedArgumentsSection } from "./DroppedArgumentsSection";
import { WinningVotersSection } from "./WinningVotersSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SmartFlowViewProps {
  topic: string;
  opponent: DebateOpponent;
  messages: DebateMessage[];
  isDebateComplete: boolean;
}

type FlowMode = "live" | "review";

export function SmartFlowView({ topic, opponent, messages, isDebateComplete }: SmartFlowViewProps) {
  const [flowData, setFlowData] = useState<SmartFlowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<FlowMode>("review");
  const { toast } = useToast();

  const analyzeFlow = async () => {
    if (messages.length < 2) {
      toast({ title: "Not enough data", description: "Complete at least one round first.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("smart-flow", {
        body: {
          topic,
          opponent: opponent.id,
          debateHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
            round: m.round,
          })),
        },
      });

      if (error) {
        const status = (error as any)?.context?.status;
        if (status === 429) { toast({ title: "Rate limited", description: "Try again in a moment.", variant: "destructive" }); return; }
        if (status === 402) { toast({ title: "Credits exhausted", description: "Add credits to continue.", variant: "destructive" }); return; }
        throw error;
      }

      setFlowData(data.flow);
    } catch (e) {
      console.error("Smart flow error:", e);
      toast({ title: "Analysis failed", description: "Could not generate flow analysis.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const exportFlowAsPDF = () => {
    if (!flowData) return;
    // Create a printable version
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const affArgs = flowData.contentions.filter((c) => c.speaker === "affirmative");
    const negArgs = flowData.contentions.filter((c) => c.speaker === "negative");

    printWindow.document.write(`
      <html><head><title>Smart Flow - ${topic}</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 1000px; margin: 0 auto; padding: 24px; color: #1a1a1a; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        h2 { font-size: 14px; margin-top: 20px; border-bottom: 2px solid #ccc; padding-bottom: 4px; }
        h3 { font-size: 12px; margin: 8px 0 4px; }
        .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .card { border: 1px solid #ddd; border-radius: 6px; padding: 8px; margin-bottom: 8px; font-size: 11px; }
        .dropped { border-color: #ef4444; background: #fef2f2; }
        .extended { border-color: #22c55e; background: #f0fdf4; }
        .badge { font-size: 9px; font-weight: bold; text-transform: uppercase; padding: 1px 4px; border-radius: 3px; }
        .resp { margin-left: 12px; border-left: 2px solid #ddd; padding-left: 8px; margin-top: 4px; font-size: 10px; color: #555; }
        .rfd { margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 12px; }
        .section { margin-top: 16px; }
        @media print { body { padding: 12px; } }
      </style></head><body>
      <h1>🧠 Smart Flow: ${topic}</h1>
      <p style="font-size:11px;color:#666;">vs ${opponent.name} · Generated ${new Date().toLocaleDateString()}</p>
      <div class="cols">
        <div>
          <h2>✅ Affirmative (You)</h2>
          ${affArgs.map((a) => `
            <div class="card ${a.status === "dropped" ? "dropped" : a.status === "extended" ? "extended" : ""}">
              <span class="badge">${a.status}</span> <strong>${a.contention}</strong> (${a.strengthScore}/100)
              <p>${a.claim}</p>
              ${a.responses.map((r) => `<div class="resp"><strong>${r.type} R${r.round}:</strong> ${r.content}</div>`).join("")}
            </div>
          `).join("")}
        </div>
        <div>
          <h2>❌ Negative (${opponent.name})</h2>
          ${negArgs.map((a) => `
            <div class="card ${a.status === "dropped" ? "dropped" : a.status === "extended" ? "extended" : ""}">
              <span class="badge">${a.status}</span> <strong>${a.contention}</strong> (${a.strengthScore}/100)
              <p>${a.claim}</p>
              ${a.responses.map((r) => `<div class="resp"><strong>${r.type} R${r.round}:</strong> ${r.content}</div>`).join("")}
            </div>
          `).join("")}
        </div>
      </div>
      <div class="section">
        <h2>⚠️ Dropped Arguments</h2>
        ${flowData.droppedArguments.length === 0 ? "<p>None detected.</p>" : flowData.droppedArguments.map((d) => `
          <div class="card dropped"><strong>${d.speaker === "affirmative" ? "AFF" : "NEG"} R${d.round}:</strong> ${d.claim}<br/><em>Impact: ${d.impact}</em></div>
        `).join("")}
      </div>
      <div class="section">
        <h2>🏆 Winning Voters</h2>
        ${flowData.winningVoters.map((v) => `
          <div class="card"><strong>${v.issue}</strong> → ${v.winner === "affirmative" ? "AFF" : "NEG"}<br/>${v.reason}</div>
        `).join("")}
      </div>
      <div class="rfd"><strong>RFD:</strong> ${flowData.rfd}</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const affirmativeArgs = flowData?.contentions.filter((c) => c.speaker === "affirmative") || [];
  const negativeArgs = flowData?.contentions.filter((c) => c.speaker === "negative") || [];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setMode("live")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "live" ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Radio className="w-3 h-3" /> Live
            </button>
            <button
              onClick={() => setMode("review")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "review" ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="w-3 h-3" /> Review
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={analyzeFlow}
            disabled={isLoading || messages.length < 2}
            className="text-xs gap-1.5"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
            {flowData ? "Re-analyze" : "Generate Flow"}
          </Button>
          {flowData && (
            <Button variant="outline" size="sm" onClick={exportFlowAsPDF} className="text-xs gap-1.5">
              <Download className="w-3 h-3" /> Export PDF
            </Button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground font-display">Analyzing debate flow...</p>
        </div>
      )}

      {/* Empty state */}
      {!flowData && !isLoading && (
        <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
          <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-display font-semibold mb-1">No flow data yet</p>
          <p className="text-xs">
            {messages.length < 2
              ? "Complete at least one round to generate a flow analysis."
              : 'Click "Generate Flow" to analyze the debate.'}
          </p>
        </div>
      )}

      {/* Flow data */}
      <AnimatePresence>
        {flowData && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Two-column flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Affirmative column */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-accent/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                  <h3 className="font-display text-sm font-semibold text-foreground">Affirmative (You)</h3>
                  <span className="text-[10px] text-muted-foreground ml-auto">{affirmativeArgs.length} args</span>
                </div>
                {affirmativeArgs.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No arguments tracked</p>
                ) : (
                  affirmativeArgs.map((arg) => <FlowArgumentCard key={arg.id} argument={arg} />)
                )}
              </div>

              {/* Negative column */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-destructive/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  <h3 className="font-display text-sm font-semibold text-foreground">Negative ({opponent.name})</h3>
                  <span className="text-[10px] text-muted-foreground ml-auto">{negativeArgs.length} args</span>
                </div>
                {negativeArgs.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No arguments tracked</p>
                ) : (
                  negativeArgs.map((arg) => <FlowArgumentCard key={arg.id} argument={arg} />)
                )}
              </div>
            </div>

            {/* Dropped Arguments */}
            <DroppedArgumentsSection dropped={flowData.droppedArguments} />

            {/* Winning Voters */}
            <WinningVotersSection voters={flowData.winningVoters} overallWinner={flowData.overallWinner} />

            {/* RFD */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-display font-semibold text-sm text-foreground mb-2">📋 Reason for Decision (RFD)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{flowData.rfd}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
