import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Loader2
} from "lucide-react";
import { CritiqueResult } from "@/components/CritiqueResult";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { PersonaSelector, Persona, getDefaultPersona } from "@/components/PersonaSelector";

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

interface SavedCritiqueRaw {
  id: string;
  input_text: string;
  primary_objection: string;
  logical_flaws: unknown;
  weak_assumptions: unknown;
  counterarguments: unknown;
  real_world_failures: unknown;
  argument_strength_score: number;
  created_at: string;
}

interface SavedCritique {
  id: string;
  input_text: string;
  primary_objection: string;
  logical_flaws: string[];
  weak_assumptions: string[];
  counterarguments: string[];
  real_world_failures: string[];
  argument_strength_score: number;
  created_at: string;
}

const parseSavedCritique = (raw: SavedCritiqueRaw): SavedCritique => ({
  ...raw,
  logical_flaws: Array.isArray(raw.logical_flaws) ? raw.logical_flaws as string[] : [],
  weak_assumptions: Array.isArray(raw.weak_assumptions) ? raw.weak_assumptions as string[] : [],
  counterarguments: Array.isArray(raw.counterarguments) ? raw.counterarguments as string[] : [],
  real_world_failures: Array.isArray(raw.real_world_failures) ? raw.real_world_failures as string[] : [],
});

// Site is now free - no limits

export default function Dashboard() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [critique, setCritique] = useState<CritiqueData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [usageCount, setUsageCount] = useState(0);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);
  const [savedCritiques, setSavedCritiques] = useState<SavedCritique[]>([]);
  const [currentInputText, setCurrentInputText] = useState("");
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(() => getDefaultPersona());
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setIsAuthLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch usage count and saved critiques when session is available
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) {
        setIsLoadingUsage(false);
        return;
      }
      
      try {
        // Fetch usage count
        const { count, error: countError } = await supabase
          .from("critique_usage")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id);

        if (countError) {
          console.error("Failed to fetch usage count:", countError);
        } else {
          setUsageCount(count ?? 0);
        }

        // Fetch saved critiques
        const { data: critiques, error: critiquesError } = await supabase
          .from("saved_critiques")
          .select("id, input_text, primary_objection, logical_flaws, weak_assumptions, counterarguments, real_world_failures, argument_strength_score, created_at")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (critiquesError) {
          console.error("Failed to fetch saved critiques:", critiquesError);
        } else if (critiques) {
          setSavedCritiques(critiques.map(c => parseSavedCritique(c as SavedCritiqueRaw)));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingUsage(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isAuthLoading && !session) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [isAuthLoading, session, navigate, toast]);

  const handleCritique = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter or paste your text to critique.",
        variant: "destructive",
      });
      return;
    }

    const { data: { session: existingSession } } = await supabase.auth.getSession();

    if (!existingSession) {
      toast({
        title: "Session expired",
        description: "Please log in again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const { data: { session: freshSession }, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError || !freshSession) {
      await supabase.auth.signOut();
      toast({
        title: "Session expired",
        description: "Please log in again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      await supabase.auth.signOut();
      toast({
        title: "Session expired",
        description: "Please log in again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const userId = user.id;

    setIsLoading(true);
    setCritique(null);
    setCurrentInputText(inputText);

    try {
      const { data, error } = await supabase.functions.invoke("critique", {
        body: { text: inputText, persona: selectedPersona },
      });

      if (error) {
        const status = (error as any)?.context?.status ?? (error as any)?.status;

        if (status === 401) {
          toast({
            title: "Session expired",
            description: "Please log in again.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }


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
      setUsageCount(result.usageCount);

      // Save the critique to the database (only for non-demo personas that have full data)
      if (userId && persona !== "demo") {
        const { data: savedData, error: saveError } = await supabase
          .from("saved_critiques")
          .insert({
            user_id: userId,
            input_text: inputText,
            primary_objection: normalizedCritique.primaryObjection,
            logical_flaws: normalizedCritique.logicalFlaws,
            weak_assumptions: normalizedCritique.weakAssumptions,
            counterarguments: normalizedCritique.counterarguments,
            real_world_failures: normalizedCritique.realWorldFailures,
            argument_strength_score: normalizedCritique.argumentStrengthScore,
          })
          .select("id, input_text, primary_objection, logical_flaws, weak_assumptions, counterarguments, real_world_failures, argument_strength_score, created_at")
          .single();

        if (saveError) {
          console.error("Failed to save critique:", saveError);
        } else if (savedData) {
          setSavedCritiques((prev) => [parseSavedCritique(savedData as SavedCritiqueRaw), ...prev.slice(0, 4)]);
        }
      }

      toast({
        title: "Critique complete",
        description: `${result.remaining} critique${result.remaining === 1 ? "" : "s"} remaining.`,
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
    setIsViewingHistory(false);
  };

  const handleViewSavedCritique = (saved: SavedCritique) => {
    setCritique({
      primaryObjection: saved.primary_objection,
      logicalFlaws: saved.logical_flaws,
      weakAssumptions: saved.weak_assumptions,
      counterarguments: saved.counterarguments,
      realWorldFailures: saved.real_world_failures,
      argumentStrengthScore: saved.argument_strength_score,
    });
    setCurrentInputText(saved.input_text);
    setIsViewingHistory(true);
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
              label="Total Critiques" 
              value={isLoadingUsage ? "..." : String(usageCount)} 
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
                    <textarea 
                      className="w-full h-40 p-4 bg-background border border-border rounded-lg resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all"
                      placeholder="Paste your essay, argument, or research paper here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={isLoading}
                    />
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
              {/* Recent Activity */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Recent Critiques
                </h3>
                {savedCritiques.length > 0 ? (
                  <div className="space-y-3">
                    {savedCritiques.map((saved) => (
                      <button 
                        key={saved.id}
                        onClick={() => handleViewSavedCritique(saved)}
                        className="w-full text-left p-3 bg-secondary/50 rounded-lg border border-border/50 hover:bg-secondary hover:border-accent/30 transition-colors cursor-pointer"
                      >
                        <p className="text-sm text-foreground line-clamp-2 mb-2">
                          {saved.input_text.slice(0, 100)}{saved.input_text.length > 100 ? '...' : ''}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Score: {saved.argument_strength_score}/100</span>
                          <span>{new Date(saved.created_at).toLocaleDateString()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No critiques yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submit your first document to get started
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Tips for Better Critiques
                </h3>
                <ul className="space-y-3">
                  <TipItem text="Include your thesis statement clearly" />
                  <TipItem text="Provide context for your argument" />
                  <TipItem text="Include your citations if applicable" />
                  <TipItem text="Specify your target audience" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}
