import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DEBATE_OPPONENTS, PRESET_TOPICS, DebateOpponent } from "@/types/debate";

interface DebateSetupProps {
  onStart: (topic: string, opponent: DebateOpponent) => void;
}

export function DebateSetup({ onStart }: DebateSetupProps) {
  const [selectedOpponent, setSelectedOpponent] = useState<DebateOpponent | null>(null);
  const [topic, setTopic] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const canStart = topic.trim().length > 5 && selectedOpponent;

  return (
    <div className="space-y-8">
      {/* Opponent Selection */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Choose Your Opponent
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DEBATE_OPPONENTS.map((opp) => (
            <motion.button
              key={opp.id}
              onClick={() => setSelectedOpponent(opp)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedOpponent?.id === opp.id
                  ? "border-accent bg-accent/10 ring-2 ring-accent/20"
                  : "border-border bg-card hover:border-accent/30"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl block mb-2">{opp.icon}</span>
              <span className="font-display font-semibold text-sm text-foreground block">{opp.name}</span>
              <span className="text-xs text-muted-foreground">{opp.description}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Topic Selection */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Select a Topic
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_TOPICS.map((t) => (
            <motion.button
              key={t}
              onClick={() => { setTopic(t); setShowCustom(false); }}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                topic === t
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-foreground"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {t}
            </motion.button>
          ))}
          <motion.button
            onClick={() => { setShowCustom(true); setTopic(""); }}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
              showCustom
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-accent/30"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ✏️ Custom Topic
          </motion.button>
        </div>

        {showCustom && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Input
              placeholder="Enter your debate topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl"
            />
          </motion.div>
        )}
      </div>

      {/* Start Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="hero"
          size="lg"
          disabled={!canStart}
          onClick={() => canStart && onStart(topic, selectedOpponent!)}
          className="px-12"
        >
          Enter the Arena
        </Button>
      </div>
    </div>
  );
}
