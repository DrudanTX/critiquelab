import { useState } from "react";
import { History, Trash2, ChevronRight, Gauge } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface SavedCritique {
  id: string;
  inputText: string;
  critique: CritiqueData;
  createdAt: string;
  persona: string;
}

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

interface CritiqueHistoryProps {
  critiques: SavedCritique[];
  onSelect: (critique: SavedCritique) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export function CritiqueHistory({ 
  critiques, 
  onSelect, 
  onDelete,
  selectedId 
}: CritiqueHistoryProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score <= 3) return "text-destructive";
    if (score <= 6) return "text-amber-500";
    return "text-accent";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  if (critiques.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Past Critiques
          </h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">
          No critiques yet. Submit your first one above!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Past Critiques
        </h3>
        <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {critiques.length}
        </span>
      </div>
      
      <ScrollArea className="h-[300px] pr-2">
        <AnimatePresence mode="popLayout">
          {critiques.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className={`group relative mb-2 last:mb-0`}
            >
              <button
                onClick={() => onSelect(item)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  selectedId === item.id
                    ? "border-accent/50 bg-accent/5"
                    : "border-border hover:border-accent/30 hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {truncateText(item.inputText)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-muted-foreground" />
                        <span className={`text-xs font-medium ${getScoreColor(item.critique.argumentStrengthScore)}`}>
                          {item.critique.argumentStrengthScore}/10
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                    selectedId === item.id ? "text-accent" : ""
                  }`} />
                </div>
              </button>
              
              {/* Delete button */}
              <AlertDialog open={deleteId === item.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 -translate-y-1/2 right-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(item.id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Critique</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this critique? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        onDelete(item.id);
                        setDeleteId(null);
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
