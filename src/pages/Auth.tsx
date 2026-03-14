import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState(""); // email or username for login
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const redirectTo = (location.state as any)?.from || "/dashboard";

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const resolveEmail = async (input: string): Promise<string> => {
    // If it looks like an email, return as-is
    if (input.includes("@")) return input;

    // Otherwise, look up the email by username
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id")
      .ilike("username", input)
      .maybeSingle();

    if (error || !data) {
      throw new Error("No account found with that username.");
    }

    // Get the user's email from a lookup — we need an edge function or
    // we can use the admin API. Since we can't access auth.users from client,
    // we'll ask users to use email for now or store email in profiles.
    // For simplicity, let's just tell users to use their email if username lookup fails.
    throw new Error("Username login requires email. Please sign in with your email address.");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        let loginEmail = identifier;
        if (!identifier.includes("@")) {
          // Look up email by username
          const { data, error } = await supabase
            .from("profiles")
            .select("user_id")
            .ilike("username", identifier)
            .maybeSingle();

          if (error || !data) {
            throw new Error("No account found with that username.");
          }

          // We need to get the email — let's call an edge function
          const { data: fnData, error: fnError } = await supabase.functions.invoke("resolve-username", {
            body: { username: identifier },
          });

          if (fnError || !fnData?.email) {
            throw new Error("Could not resolve username. Please use your email to sign in.");
          }
          loginEmail = fnData.email;
        }

        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
        if (error) throw error;
        toast({ title: "Welcome back" });
        navigate(redirectTo, { replace: true });
      } else {
        if (password.length < 8) {
          toast({ title: "Password too short", description: "Use at least 8 characters." });
          setLoading(false);
          return;
        }
        if (username && username.length < 3) {
          toast({ title: "Username too short", description: "Use at least 3 characters." });
          setLoading(false);
          return;
        }
        if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
          toast({ title: "Invalid username", description: "Only letters, numbers, and underscores." });
          setLoading(false);
          return;
        }

        // Check if username is taken
        if (username) {
          const { data: existing } = await supabase
            .from("profiles")
            .select("id")
            .ilike("username", username)
            .maybeSingle();
          if (existing) {
            toast({ title: "Username taken", description: "Please choose a different username." });
            setLoading(false);
            return;
          }
        }

        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || username || email.split("@")[0],
              username: username || undefined,
            },
          },
        });
        if (error) throw error;

        // Update profile with username
        if (username && signUpData.user) {
          await supabase
            .from("profiles")
            .update({ username })
            .eq("user_id", signUpData.user.id);
        }

        toast({ title: "Account created!", description: "You are now signed in." });
        navigate(redirectTo, { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <FadeIn>
        <div className="w-full max-w-md space-y-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div>
            <motion.div
              className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-accent font-display font-semibold text-xl">C</span>
            </motion.div>
            <h1 className="text-2xl font-display font-medium text-foreground">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {isLogin
                ? "Sign in to access your argument tools and history."
                : "Start sharpening your arguments today."}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isLogin ? (
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm">Email or username</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="you@example.com or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="rounded-xl h-11"
                  required
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    className="rounded-xl h-11"
                    maxLength={30}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Letters, numbers, and underscores only.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm">Display name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="rounded-xl h-11"
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl h-11"
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isLogin ? "••••••••" : "At least 8 characters"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-11"
                required
                minLength={isLogin ? 1 : 8}
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              className="w-full rounded-xl h-11"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              {isLogin ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
