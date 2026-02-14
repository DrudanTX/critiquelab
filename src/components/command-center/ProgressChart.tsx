import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { ArgumentScore } from "@/types/argumentScore";
import { EloData } from "@/hooks/useEloRating";

interface ProgressChartProps {
  scores: ArgumentScore[];
  elo: EloData;
}

export function ProgressChart({ scores, elo }: ProgressChartProps) {
  const chartData = useMemo(() => {
    if (elo.ratingHistory.length === 0) return [];
    return elo.ratingHistory.map((h, i) => ({
      date: new Date(h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rating: h.rating,
      score: scores.find(s => s.createdAt === h.date)?.totalScore ?? 0,
    }));
  }, [elo.ratingHistory, scores]);

  if (chartData.length < 2) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">Score at least 2 arguments to see your progress chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">ELO Rating Over Time</h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="eloGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
              domain={["dataMin - 50", "dataMax + 50"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              fill="url(#eloGradient)"
              dot={{ fill: "hsl(var(--accent))", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
