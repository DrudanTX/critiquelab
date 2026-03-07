import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { DebateMessage, DebateOpponent, ROUND_LABELS } from "@/types/debate";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DebateThreadProps {
  topic: string;
  opponent: DebateOpponent;
  messages: DebateMessage[];
  currentRound: number;
  isAiThinking: boolean;
  isComplete: boolean;
  onSendMessage: (content: string) => void;
  onFinish: () => void;
}

export function DebateThread({
  topic,
  opponent,
  messages,
  currentRound,
  isAiThinking,
  isComplete,
  onSendMessage,
  onFinish,
}: DebateThreadProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserTurn = !isAiThinking && !isComplete && (messages.length === 0 || messages[messages.length - 1].role === "ai");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiThinking]);

  const handleSend = () => {
    if (input.trim().length < 10) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] max-h-[700px]">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card rounded-t-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{opponent.icon}</span>
          <div>
            <span className="font-display font-semibold text-foreground text-sm">{opponent.name}</span>
            <p className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-none">{topic}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
            {isComplete ? "Complete" : `Round ${currentRound}/3 · ${ROUND_LABELS[currentRound] || ""}`}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
        {messages.length === 0 && !isAiThinking && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-display mb-2">Round 1: Opening Argument</p>
            <p className="text-sm">Present your position on the topic. Make it count.</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "ai" && (
                  <span className="text-xs font-semibold text-muted-foreground block mb-1">
                    {opponent.icon} {opponent.name} · Round {msg.round}
                  </span>
                )}
                {msg.role === "user" && (
                  <span className="text-xs font-semibold text-accent-foreground/70 block mb-1">
                    You · {ROUND_LABELS[msg.round] || `Round ${msg.round}`}
                  </span>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isAiThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {opponent.name} is thinking...
            </div>
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-card rounded-b-xl">
        {isComplete ? (
          <div className="flex justify-center">
            <Button variant="hero" onClick={onFinish}>
              View Debate Report
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Textarea
              placeholder={
                isUserTurn
                  ? `Write your ${ROUND_LABELS[currentRound]?.toLowerCase() || "argument"}...`
                  : "Waiting for opponent..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!isUserTurn}
              className="rounded-xl resize-none min-h-[60px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              variant="accent"
              size="icon"
              disabled={!isUserTurn || input.trim().length < 10}
              onClick={handleSend}
              className="rounded-xl h-auto self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
