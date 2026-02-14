import { motion } from "framer-motion";
import { EloData } from "@/hooks/useEloRating";
import { Shield, TrendingUp, Crown } from "lucide-react";

interface EloDisplayProps {
  elo: EloData;
  totalArguments: number;
}

export function EloDisplay({ elo, totalArguments }: EloDisplayProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${elo.tierColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* ELO Ring */}
        <div className="relative">
          <svg width="160" height="160" className="-rotate-90">
            <circle cx="80" cy="80" r="68" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <motion.circle
              cx="80" cy="80" r="68"
              fill="none"
              stroke={elo.tierColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 68}
              initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - Math.min(elo.rating / 2000, 1)) }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-display font-bold text-foreground"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {elo.rating}
            </motion.span>
            <span className="text-xs text-muted-foreground font-medium">ELO</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: `${elo.tierColor}20`, color: elo.tierColor }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Crown className="w-4 h-4" />
              {elo.tier}
            </motion.div>
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Persuasion Rating</h2>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <MiniStat icon={TrendingUp} label="Percentile" value={`Top ${100 - elo.percentile}%`} />
            <MiniStat icon={Shield} label="Arguments" value={String(totalArguments)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
