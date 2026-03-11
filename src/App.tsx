import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PaperTexture } from "@/components/ambient/PaperTexture";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Trust from "./pages/Trust";
import Auth from "./pages/Auth";
import ArgumentAutopsy from "./pages/ArgumentAutopsy";
import CounterargumentCoach from "./pages/CounterargumentCoach";
import CommandCenter from "./pages/CommandCenter";
import DebateArena from "./pages/DebateArena";
import QuickCritique from "./pages/QuickCritique";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <PaperTexture />
          <div className="vignette">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trust" element={<Trust />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/critique" element={<QuickCritique />} />
                <Route path="/autopsy" element={<ProtectedRoute><ArgumentAutopsy /></ProtectedRoute>} />
                <Route path="/coach" element={<ProtectedRoute><CounterargumentCoach /></ProtectedRoute>} />
                <Route path="/command-center" element={<ProtectedRoute><CommandCenter /></ProtectedRoute>} />
                <Route path="/debate" element={<ProtectedRoute><DebateArena /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Analytics />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
