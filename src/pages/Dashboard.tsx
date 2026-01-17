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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonaSelector, Persona, getDefaultPersona } from "@/components/PersonaSelector";

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
  const { toast } = useToast();

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
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container px-4 md:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Submit your work for rigorous critique
              </p>
            </div>
            {critique && (
              <Button variant="hero" onClick={handleNewCritique}>
                <Plus size={18} className="mr-2" />
                New Critique
              </Button>
            )}
          </div>

          {/* Quick Stats */}
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

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upload/Result Section */}
            <div className="lg:col-span-2">
              {critique ? (
                <CritiqueResult critique={critique} />
              ) : (
                <div className="bg-card rounded-lg border border-border p-6 md:p-8">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Submit for Critique
                  </h2>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center hover:border-accent/50 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Drop your document here
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse files
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports PDF, DOCX, TXT, and Markdown files
                    </p>
                  </div>

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
                      <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                        <span className={inputText.length > INPUT_CONSTRAINTS.maxTextLength * 0.9 ? "text-destructive" : ""}>
                          {inputText.length.toLocaleString()}
                        </span>
                        /{INPUT_CONSTRAINTS.maxTextLength.toLocaleString()}
                      </div>
                    </div>
                    {inputText.length > 0 && inputText.length < INPUT_CONSTRAINTS.minTextLength && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum {INPUT_CONSTRAINTS.minTextLength} characters required
                      </p>
                    )}
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
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Tips */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Quick Tips
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <TipItem text="Be specific about your main argument" />
                  <TipItem text="Include supporting evidence if available" />
                  <TipItem text="State your assumptions clearly" />
                  <TipItem text="Consider potential counterarguments" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );
}
