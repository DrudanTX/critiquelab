import { motion } from "framer-motion";
import { FlowArgument } from "@/types/smartFlow";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FlowArgumentCardProps {
  argument: FlowArgument;
}

export function FlowArgumentCard({ argument }: FlowArgumentCardProps) {
  const [expanded, setExpanded] = useState(true);

  const statusStyles = {
    dropped: "border-destructive/60 bg-destructive/5",
    extended: "border-green-500/60 bg-green-500/5",
    contested: "border-accent/40 bg-accent/5",
    neutral: "border-border bg-card",
  };

  const statusBadge = {
    dropped: { label: "DROPPED", className: "bg-destructive/15 text-destructive" },
    extended: { label: "EXTENDED", className: "bg-green-500/15 text-green-600 dark:text-green-400" },
    contested: { label: "CONTESTED", className: "bg-accent/15 text-accent" },
    neutral: { label: "NEUTRAL", className: "bg-muted text-muted-foreground" },
  };

  const badge = statusBadge[argument.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 overflow-hidden transition-colors ${statusStyles[argument.status]}`}
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${badge.className}`}>
              {badge.label}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              R{argument.round} · {argument.roundLabel}
            </span>
          </div>
          <p className="text-xs font-semibold text-foreground truncate">{argument.contention}</p>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <span className="text-xs font-bold text-foreground">{argument.strengthScore}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">{argument.claim}</p>

          {/* Responses stacked vertically */}
          {argument.responses.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {argument.responses.map((resp) => (
                <div
                  key={resp.id}
                  className={`rounded-lg px-2.5 py-2 border text-xs ${
                    resp.speaker === "affirmative"
                      ? "bg-accent/5 border-accent/20 ml-0 mr-4"
                      : "bg-secondary/50 border-border ml-4 mr-0"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${resp.speaker === "affirmative" ? "bg-accent" : "bg-muted-foreground"}`} />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                      {resp.type} · R{resp.round}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{resp.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
