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

interface CritiqueData {
  primaryObjection: string;
  logicalFlaws: string[];
  weakAssumptions: string[];
  counterarguments: string[];
  realWorldFailures: string[];
  argumentStrengthScore: number;
}

const FREE_CRITIQUE_LIMIT = 3;

export default function Dashboard() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [critique, setCritique] = useState<CritiqueData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [usageCount, setUsageCount] = useState(0);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);
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

  // Fetch usage count when session is available
  useEffect(() => {
    const fetchUsageCount = async () => {
      if (!session?.user?.id) {
        setIsLoadingUsage(false);
        return;
      }
      
      try {
        const { count, error } = await supabase
          .from("critique_usage")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Failed to fetch usage count:", error);
        } else {
          setUsageCount(count ?? 0);
        }
      } catch (error) {
        console.error("Error fetching usage:", error);
      } finally {
        setIsLoadingUsage(false);
      }
    };

    if (session) {
      fetchUsageCount();
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

    if (!session?.access_token) {
      toast({
        title: "Session expired",
        description: "Please log in again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    setCritique(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/critique`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ text: inputText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 401) {
          toast({
            title: "Session expired",
            description: "Please log in again.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        if (response.status === 403) {
          toast({
            title: "Critique limit reached",
            description: `You've used all ${FREE_CRITIQUE_LIMIT} free critiques. Upgrade to continue.`,
            variant: "destructive",
          });
          return;
        }
        
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
          return;
        }
        
        if (response.status === 402) {
          toast({
            title: "Credits exhausted",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
          return;
        }

        throw new Error(errorData.error || "Failed to get critique");
      }

      const data = await response.json();
      setCritique(data.critique);
      setUsageCount(data.usageCount);
      
      toast({
        title: "Critique complete",
        description: `${data.remaining} critique${data.remaining === 1 ? '' : 's'} remaining.`,
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={FileText} 
              label="Critiques Used" 
              value={isLoadingUsage ? "..." : String(usageCount)} 
            />
            <StatCard 
              icon={CheckCircle} 
              label="Remaining" 
              value={isLoadingUsage ? "..." : String(Math.max(0, FREE_CRITIQUE_LIMIT - usageCount))} 
            />
            <StatCard 
              icon={Clock} 
              label="Limit" 
              value={String(FREE_CRITIQUE_LIMIT)} 
            />
            <StatCard 
              icon={AlertTriangle} 
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

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {usageCount >= FREE_CRITIQUE_LIMIT ? (
                        <span className="text-destructive font-medium">
                          Limit reached ({usageCount}/{FREE_CRITIQUE_LIMIT})
                        </span>
                      ) : (
                        <span>
                          {FREE_CRITIQUE_LIMIT - usageCount} of {FREE_CRITIQUE_LIMIT} critiques remaining
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      disabled={!inputText.trim() || isLoading || usageCount >= FREE_CRITIQUE_LIMIT}
                      onClick={handleCritique}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : usageCount >= FREE_CRITIQUE_LIMIT ? (
                        "Upgrade to Continue"
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
