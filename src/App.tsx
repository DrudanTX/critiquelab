import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LofiModeProvider } from "@/contexts/LofiModeContext";
import { PaperTexture } from "@/components/ambient/PaperTexture";
import { Analytics } from "@vercel/analytics/react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Trust from "./pages/Trust";
import ArgumentAutopsy from "./pages/ArgumentAutopsy";
import CounterargumentCoach from "./pages/CounterargumentCoach";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LofiModeProvider>
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
                <Route path="/autopsy" element={<ArgumentAutopsy />} />
                <Route path="/coach" element={<CounterargumentCoach />} />
                <Route path="/progress" element={<Progress />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Analytics />
          </div>
        </TooltipProvider>
      </LofiModeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
