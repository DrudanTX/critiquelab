import { useState, useEffect, useCallback } from "react";
import { ArgumentScore } from "@/types/argumentScore";

const STORAGE_KEY = "critiquelab_scores";
const MAX_SCORES = 100;

export function useArgumentScores() {
  const [scores, setScores] = useState<ArgumentScore[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setScores(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load scores:", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
      } catch (e) {
        console.error("Failed to save scores:", e);
      }
    }
  }, [scores, isLoaded]);

  const addScore = useCallback((score: Omit<ArgumentScore, "id" | "createdAt">) => {
    const newScore: ArgumentScore = {
      ...score,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setScores(prev => [newScore, ...prev].slice(0, MAX_SCORES));
    return newScore;
  }, []);

  const deleteScore = useCallback((id: string) => {
    setScores(prev => prev.filter(s => s.id !== id));
  }, []);

  const getAverageScore = useCallback(() => {
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length);
  }, [scores]);

  const getHighestScore = useCallback(() => {
    if (scores.length === 0) return 0;
    return Math.max(...scores.map(s => s.totalScore));
  }, [scores]);

  const getCategoryAverages = useCallback(() => {
    if (scores.length === 0) return { clarity: 0, logic: 0, evidence: 0, defense: 0 };
    const len = scores.length;
    return {
      clarity: Math.round(scores.reduce((s, sc) => s + sc.clarityScore, 0) / len),
      logic: Math.round(scores.reduce((s, sc) => s + sc.logicScore, 0) / len),
      evidence: Math.round(scores.reduce((s, sc) => s + sc.evidenceScore, 0) / len),
      defense: Math.round(scores.reduce((s, sc) => s + sc.defenseScore, 0) / len),
    };
  }, [scores]);

  return {
    scores,
    isLoaded,
    addScore,
    deleteScore,
    getAverageScore,
    getHighestScore,
    getCategoryAverages,
  };
}
