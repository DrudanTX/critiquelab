import { useState, useEffect, useCallback } from "react";

interface CritiqueData {
  primaryObjection: string;
  logicalFlaws: string[];
  weakAssumptions: string[];
  counterarguments: string[];
  realWorldFailures: string[];
  argumentStrengthScore: number;
  coreClaimUnderFire?: string;
  obviousWeaknesses?: string[];
  whatWouldBreakThis?: string[];
}

export interface SavedCritique {
  id: string;
  inputText: string;
  critique: CritiqueData;
  createdAt: string;
  persona: string;
}

const STORAGE_KEY = "critiquelab_history";
const MAX_HISTORY = 50; // Limit to prevent localStorage overflow

export function useCritiqueHistory() {
  const [critiques, setCritiques] = useState<SavedCritique[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedCritique[];
        setCritiques(parsed);
      }
    } catch (error) {
      console.error("Failed to load critique history:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever critiques change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(critiques));
      } catch (error) {
        console.error("Failed to save critique history:", error);
      }
    }
  }, [critiques, isLoaded]);

  const addCritique = useCallback((
    inputText: string, 
    critique: CritiqueData, 
    persona: string
  ) => {
    const newCritique: SavedCritique = {
      id: crypto.randomUUID(),
      inputText,
      critique,
      createdAt: new Date().toISOString(),
      persona,
    };

    setCritiques(prev => {
      const updated = [newCritique, ...prev];
      // Keep only the most recent MAX_HISTORY items
      return updated.slice(0, MAX_HISTORY);
    });

    return newCritique.id;
  }, []);

  const deleteCritique = useCallback((id: string) => {
    setCritiques(prev => prev.filter(c => c.id !== id));
  }, []);

  const getCritique = useCallback((id: string) => {
    return critiques.find(c => c.id === id);
  }, [critiques]);

  const clearHistory = useCallback(() => {
    setCritiques([]);
  }, []);

  return {
    critiques,
    isLoaded,
    addCritique,
    deleteCritique,
    getCritique,
    clearHistory,
  };
}
