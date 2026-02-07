import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LofiModeContextType {
  focusMode: boolean;
  setFocusMode: (value: boolean) => void;
  toggleFocusMode: () => void;
  ogMode: boolean;
  setOgMode: (value: boolean) => void;
  toggleOgMode: () => void;
}

const LofiModeContext = createContext<LofiModeContextType | undefined>(undefined);

export function LofiModeProvider({ children }: { children: ReactNode }) {
  const [focusMode, setFocusMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lofi-focus-mode") === "true";
    }
    return false;
  });

  const [ogMode, setOgMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lofi-og-mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("lofi-focus-mode", String(focusMode));
    if (focusMode) {
      document.body.classList.add("focus-mode");
    } else {
      document.body.classList.remove("focus-mode");
    }
  }, [focusMode]);

  useEffect(() => {
    localStorage.setItem("lofi-og-mode", String(ogMode));
    if (ogMode) {
      document.body.classList.add("og-mode");
    } else {
      document.body.classList.remove("og-mode");
    }
  }, [ogMode]);

  const toggleFocusMode = () => setFocusMode((prev) => !prev);
  const toggleOgMode = () => setOgMode((prev) => !prev);

  return (
    <LofiModeContext.Provider value={{ focusMode, setFocusMode, toggleFocusMode, ogMode, setOgMode, toggleOgMode }}>
      {children}
    </LofiModeContext.Provider>
  );
}

export function useLofiMode() {
  const context = useContext(LofiModeContext);
  if (context === undefined) {
    throw new Error("useLofiMode must be used within a LofiModeProvider");
  }
  return context;
}
