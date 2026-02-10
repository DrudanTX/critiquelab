import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressDashboard } from "@/components/scoring/ProgressDashboard";
import { Leaderboard } from "@/components/scoring/Leaderboard";
import { useArgumentScores } from "@/hooks/useArgumentScores";
import { FadeIn } from "@/components/animations";
import { BarChart3, Trophy } from "lucide-react";

export default function Progress() {
  const { scores, getAverageScore, getHighestScore, getCategoryAverages } = useArgumentScores();

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container px-4 md:px-6 py-8">
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Progress & Leaderboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your argument quality over time
              </p>
            </div>
          </FadeIn>

          <Tabs defaultValue="progress" className="space-y-6">
            <TabsList>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                My Progress
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress">
              <ProgressDashboard
                scores={scores}
                averageScore={getAverageScore()}
                highestScore={getHighestScore()}
                categoryAverages={getCategoryAverages()}
              />
            </TabsContent>

            <TabsContent value="leaderboard">
              <Leaderboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
