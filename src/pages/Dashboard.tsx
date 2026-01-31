import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Plus,
  Loader2
} from "lucide-react";
import { CritiqueResult } from "@/components/CritiqueResult";
import { CritiqueHistory, SavedCritique } from "@/components/CritiqueHistory";
import { useToast } from "@/hooks/use-toast";
import { useCritiqueHistory } from "@/hooks/useCritiqueHistory";
import { supabase } from "@/integrations/supabase/client";
import { PersonaSelector, Persona, getDefaultPersona } from "@/components/PersonaSelector";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, ScaleOnHover } from "@/components/animations";

// ============================================================================
// Input Validation Constants
// SECURITY: Client-side validation for UX (server validates authoritatively)
// ============================================================================
const INPUT_CONSTRAINTS = {
  minTextLength: 10,         // Minimum characters for meaningful critique
  maxTextLength: 50000,      // Maximum characters (matches server limit)
} as const;

/**
 * Sanitizes user input text
 * SECURITY: Basic sanitization for display/UX purposes
 * Note: Server performs authoritative validation
 */
function sanitizeInput(text: string): string {
  return text
    .replace(/\0/g, "")              // Remove null bytes
    .replace(/\r\n/g, "\n")          // Normalize line endings
    .replace(/\r/g, "\n")
    .trim();
}

/**
 * Validates text input on client side
 * Returns validation result with specific error messages
 */
function validateTextInput(text: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeInput(text);
  
  if (sanitized.length === 0) {
    return { valid: false, error: "Please enter some text to critique." };
  }
  
  if (sanitized.length < INPUT_CONSTRAINTS.minTextLength) {
    return { 
      valid: false, 
      error: `Please enter at least ${INPUT_CONSTRAINTS.minTextLength} characters for a meaningful critique.` 
    };
  }
  
  if (sanitized.length > INPUT_CONSTRAINTS.maxTextLength) {
    return { 
      valid: false, 
      error: `Text exceeds maximum length of ${INPUT_CONSTRAINTS.maxTextLength.toLocaleString()} characters.` 
    };
  }
  
  return { valid: true };
}

interface CritiqueData {
  primaryObjection: string;
  logicalFlaws: string[];
  weakAssumptions: string[];
  counterarguments: string[];
  realWorldFailures: string[];
  argumentStrengthScore: number;
  // Demo persona fields
  coreClaimUnderFire?: string;
  obviousWeaknesses?: string[];
  whatWouldBreakThis?: string[];
}

// Site is now free - no limits, no auth

export default function Dashboard() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [critique, setCritique] = useState<CritiqueData | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [currentInputText, setCurrentInputText] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<Persona>(() => getDefaultPersona());
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | undefined>();
  const { toast } = useToast();
  const { critiques: savedCritiques, addCritique, deleteCritique } = useCritiqueHistory();

  const handleCritique = async () => {
    // SECURITY: Client-side validation for UX (server validates authoritatively)
    const sanitizedText = sanitizeInput(inputText);
    const validation = validateTextInput(sanitizedText);
    
    if (!validation.valid) {
      toast({
        title: "Invalid input",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCritique(null);
    setCurrentInputText(sanitizedText);

    try {
      // SECURITY: Only send validated, sanitized data
      // Server performs authoritative validation
      const { data, error } = await supabase.functions.invoke("critique", {
        body: { 
          text: sanitizedText, 
          persona: selectedPersona 
        },
      });

      if (error) {
        const status = (error as any)?.context?.status ?? (error as any)?.status;

        if (status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
          return;
        }

        if (status === 402) {
          toast({
            title: "Credits exhausted",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
          return;
        }

        throw error;
      }

      const result = data as any;
      const rawCritique = result.critique;
      const persona = result.persona;
      
      // Normalize demo persona response to standard format
      let normalizedCritique: CritiqueData;
      if (persona === "demo") {
        normalizedCritique = {
          primaryObjection: rawCritique.coreClaimUnderFire || "No core claim identified",
          logicalFlaws: [],
          weakAssumptions: [],
          counterarguments: [],
          realWorldFailures: rawCritique.whatWouldBreakThis || [],
          argumentStrengthScore: rawCritique.argumentStrengthScore || 5,
          coreClaimUnderFire: rawCritique.coreClaimUnderFire,
          obviousWeaknesses: rawCritique.obviousWeaknesses,
          whatWouldBreakThis: rawCritique.whatWouldBreakThis,
        };
      } else {
        normalizedCritique = rawCritique;
      }
      
      setCritique(normalizedCritique);
      setUsageCount(prev => prev + 1);
      
      // Save to history
      addCritique(sanitizedText, normalizedCritique, selectedPersona);
      setSelectedHistoryId(undefined);

      toast({
        title: "Critique complete",
        description: "Your text has been analyzed.",
      });
    } catch (error) {
      console.error("Critique error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze your text.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCritique = () => {
    setInputText("");
    setCritique(null);
    setCurrentInputText("");
    setSelectedHistoryId(undefined);
  };

  const handleSelectHistory = (saved: SavedCritique) => {
    setCritique(saved.critique);
    setCurrentInputText(saved.inputText);
    setSelectedHistoryId(saved.id);
  };

  const handleDeleteHistory = (id: string) => {
    deleteCritique(id);
    // If we're viewing the deleted critique, clear it
    if (selectedHistoryId === id) {
      handleNewCritique();
    }
    toast({
      title: "Critique deleted",
      description: "The critique has been removed from your history.",
    });
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container px-4 md:px-6 py-8">
          {/* Header */}
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Submit your work for rigorous critique
                </p>
              </div>
              <AnimatePresence>
                {critique && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ScaleOnHover>
                      <Button variant="hero" onClick={handleNewCritique}>
                        <Plus size={18} className="mr-2" />
                        New Critique
                      </Button>
                    </ScaleOnHover>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>

          {/* Quick Stats */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard 
                icon={FileText} 
                label="Session Critiques" 
                value={String(usageCount)} 
              />
              <StatCard 
                icon={CheckCircle} 
                label="Plan" 
                value="Free" 
              />
            </div>
          </FadeIn>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upload/Result Section */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {critique ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CritiqueResult critique={critique} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FadeIn delay={0.2} direction="none">
                      <div className="bg-card rounded-lg border border-border p-6 md:p-8">
                        <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                          Submit for Critique
                        </h2>
                        
                        {/* Upload Area */}
                        <motion.div 
                          className="border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center hover:border-accent/50 transition-colors cursor-pointer group"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <motion.div 
                            className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors"
                            whileHover={{ rotate: 5 }}
                          >
                            <Upload className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" />
                          </motion.div>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                            Drop your document here
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            or click to browse files
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports PDF, DOCX, TXT, and Markdown files
                          </p>
                        </motion.div>

                        {/* Or paste text */}
                        <div className="mt-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-sm text-muted-foreground">or paste your text</span>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                          <div className="relative">
                            <textarea 
                              className="w-full h-40 p-4 bg-background border border-border rounded-lg resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all"
                              placeholder="Paste your essay, argument, or research paper here..."
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                              disabled={isLoading}
                              maxLength={INPUT_CONSTRAINTS.maxTextLength}
                            />
                            {/* Character count indicator */}
                            <motion.div 
                              className="absolute bottom-2 right-3 text-xs text-muted-foreground"
                              animate={{ 
                                color: inputText.length > INPUT_CONSTRAINTS.maxTextLength * 0.9 
                                  ? "hsl(var(--destructive))" 
                                  : "hsl(var(--muted-foreground))"
                              }}
                            >
                              <span>
                                {inputText.length.toLocaleString()}
                              </span>
                              /{INPUT_CONSTRAINTS.maxTextLength.toLocaleString()}
                            </motion.div>
                          </div>
                          <AnimatePresence>
                            {inputText.length > 0 && inputText.length < INPUT_CONSTRAINTS.minTextLength && (
                              <motion.p 
                                className="text-xs text-muted-foreground mt-1"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                              >
                                Minimum {INPUT_CONSTRAINTS.minTextLength} characters required
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Persona Selector */}
                        <div className="mt-6">
                          <PersonaSelector
                            selectedPersona={selectedPersona}
                            onSelectPersona={setSelectedPersona}
                            disabled={isLoading}
                          />
                        </div>

                        <div className="mt-6 flex justify-end">
                          <ScaleOnHover>
                            <Button 
                              variant="hero" 
                              size="lg" 
                              disabled={!inputText.trim() || isLoading}
                              onClick={handleCritique}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                "Start Critique"
                              )}
                            </Button>
                          </ScaleOnHover>
                        </div>
                      </div>
                    </FadeIn>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <FadeIn delay={0.3} direction="right">
              <div className="space-y-6">
                {/* Quick Tips */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Quick Tips
                  </h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <TipItem text="Be specific about your main argument" delay={0} />
                    <TipItem text="Include supporting evidence if available" delay={0.1} />
                    <TipItem text="State your assumptions clearly" delay={0.2} />
                    <TipItem text="Consider potential counterarguments" delay={0.3} />
                  </ul>
                </div>

                {/* Past Critiques */}
                <CritiqueHistory
                  critiques={savedCritiques}
                  onSelect={handleSelectHistory}
                  onDelete={handleDeleteHistory}
                  selectedId={selectedHistoryId}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <ScaleOnHover scale={1.02}>
      <motion.div 
        className="bg-card rounded-lg border border-border p-4"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"
            whileHover={{ rotate: 5 }}
          >
            <Icon className="w-5 h-5 text-muted-foreground" />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold text-foreground">{value}</p>
          </div>
        </div>
      </motion.div>
    </ScaleOnHover>
  );
}

function TipItem({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.li 
      className="flex items-start gap-2"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
    >
      <motion.div
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
      >
        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
      </motion.div>
      <span>{text}</span>
    </motion.li>
  );
}
