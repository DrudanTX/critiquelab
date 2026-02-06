import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LofiModeContextType {
  focusMode: boolean;
  setFocusMode: (value: boolean) => void;
  toggleFocusMode: () => void;
}

const LofiModeContext = createContext<LofiModeContextType | undefined>(undefined);

export function LofiModeProvider({ children }: { children: ReactNode }) {
  const [focusMode, setFocusMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lofi-focus-mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("lofi-focus-mode", String(focusMode));
    
    // Toggle focus-mode class on body for CSS effects
    if (focusMode) {
      document.body.classList.add("focus-mode");
    } else {
      document.body.classList.remove("focus-mode");
    }
  }, [focusMode]);

  const toggleFocusMode = () => setFocusMode((prev) => !prev);

  return (
    <LofiModeContext.Provider value={{ focusMode, setFocusMode, toggleFocusMode }}>
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
