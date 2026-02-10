import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardEntry } from "@/types/argumentScore";
import { FadeIn } from "@/components/animations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SortBy = "highest_score" | "total_arguments" | "avg_score";

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("highest_score");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    // Query argument_scores directly with aggregation since views may have issues
    const { data, error } = await supabase
      .from("argument_scores")
      .select("user_id, total_score, created_at")
      .order("total_score", { ascending: false })
      .limit(500);

    if (error || !data) {
      console.error("Leaderboard error:", error);
      setLoading(false);
      return;
    }

    // Aggregate client-side
    const userMap = new Map<string, { scores: number[]; lastActive: string }>();
    for (const row of data) {
      const existing = userMap.get(row.user_id);
      if (existing) {
        existing.scores.push(row.total_score);
        if (row.created_at > existing.lastActive) existing.lastActive = row.created_at;
      } else {
        userMap.set(row.user_id, { scores: [row.total_score], lastActive: row.created_at });
      }
    }

    // Fetch display names
    const userIds = [...userMap.keys()];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) ?? []);

    const leaderboard: LeaderboardEntry[] = userIds.map(uid => {
      const { scores, lastActive } = userMap.get(uid)!;
      return {
        user_id: uid,
        display_name: profileMap.get(uid) ?? "Anonymous",
        highest_score: Math.max(...scores),
        avg_score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        total_arguments: scores.length,
        last_active: lastActive,
      };
    });

    setEntries(leaderboard);
    setLoading(false);
  };

  const sorted = [...entries].sort((a, b) => {
    if (sortBy === "highest_score") return b.highest_score - a.highest_score;
    if (sortBy === "total_arguments") return b.total_arguments - a.total_arguments;
    return b.avg_score - a.avg_score;
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-warning" />;
    if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (index === 2) return <Medal className="w-5 h-5 text-warning/60" />;
    return <span className="text-sm font-medium text-muted-foreground w-5 text-center">{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="animate-gentle-pulse">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <FadeIn>
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">No rankings yet</h3>
          <p className="text-sm text-muted-foreground">
            Sign up and submit scored arguments to appear on the leaderboard.
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Leaderboard
          </h3>
        </div>

        <Tabs defaultValue="highest_score" onValueChange={(v) => setSortBy(v as SortBy)}>
          <TabsList className="mb-4">
            <TabsTrigger value="highest_score">Top Score</TabsTrigger>
            <TabsTrigger value="avg_score">Best Average</TabsTrigger>
            <TabsTrigger value="total_arguments">Most Active</TabsTrigger>
          </TabsList>

          <TabsContent value={sortBy}>
            <div className="space-y-2">
              {sorted.slice(0, 20).map((entry, i) => {
                const isCurrentUser = entry.user_id === currentUserId;
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isCurrentUser
                        ? "bg-accent/10 border border-accent/20"
                        : "bg-secondary/30 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="w-8 flex justify-center">{getRankIcon(i)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrentUser ? "text-accent" : "text-foreground"}`}>
                        {entry.display_name || "Anonymous"}
                        {isCurrentUser && <span className="text-xs ml-2 text-accent">(you)</span>}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{entry.highest_score}</div>
                        <div className="text-[10px] text-muted-foreground">Best</div>
                      </div>
                      <div className="text-center hidden sm:block">
                        <div className="font-semibold text-foreground">{entry.avg_score}</div>
                        <div className="text-[10px] text-muted-foreground">Avg</div>
                      </div>
                      <div className="text-center hidden sm:block">
                        <div className="font-semibold text-foreground">{entry.total_arguments}</div>
                        <div className="text-[10px] text-muted-foreground">Args</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FadeIn>
  );
}
