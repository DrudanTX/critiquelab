import { Moon, Sun, Focus } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useLofiMode } from "@/contexts/LofiModeContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export function LofiToggle() {
  const { theme, setTheme } = useTheme();
  const { focusMode, toggleFocusMode } = useLofiMode();

  return (
    <div className="flex items-center gap-1">
      {/* Focus Mode Toggle */}
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFocusMode}
            className={`h-9 w-9 transition-all duration-slow ${
              focusMode 
                ? "bg-accent/10 text-accent" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Toggle focus mode"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={focusMode ? "focus-on" : "focus-off"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Focus className={`h-4 w-4 ${focusMode ? "fill-accent/20" : ""}`} />
              </motion.div>
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p>{focusMode ? "Exit focus mode" : "Enter focus mode"}</p>
        </TooltipContent>
      </Tooltip>

      {/* Theme Toggle - Midnight Mode */}
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 text-muted-foreground hover:text-foreground transition-all duration-slow"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p>{theme === "dark" ? "Light mode" : "Midnight mode"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
