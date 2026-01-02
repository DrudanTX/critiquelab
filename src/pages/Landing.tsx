import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Target, Lightbulb, BookOpen, Users, Zap } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 subtle-gradient" />
        <div className="relative container px-4 md:px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Adversarial AI for Critical Thinking
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Challenge Your Ideas.{" "}
              <span className="text-gradient">Made to Prove You Wrong.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              CritiqueLab is an adversarial AI platform that rigorously challenges your essays, research papers, and arguments—helping you strengthen your work before others find the flaws.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up relative z-10" style={{ animationDelay: "0.3s" }}>
              <Button 
                variant="hero" 
                size="xl" 
                onClick={() => navigate("/dashboard")}
              >
                Start Challenging
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements - pointer-events-none to prevent touch interception */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Rigorous Analysis, Not Flattery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike typical AI assistants, CritiqueLab actively seeks weaknesses in your arguments to help you build stronger work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={Target}
              title="Argument Analysis"
              description="Identifies logical fallacies, weak premises, and gaps in reasoning that could undermine your thesis."
            />
            <FeatureCard
              icon={Shield}
              title="Counterargument Generation"
              description="Anticipates opposing viewpoints and helps you prepare robust responses to criticism."
            />
            <FeatureCard
              icon={Lightbulb}
              title="Evidence Evaluation"
              description="Assesses the strength and relevance of your supporting evidence and citations."
            />
            <FeatureCard
              icon={BookOpen}
              title="Academic Standards"
              description="Ensures your work meets scholarly rigor and adheres to academic integrity guidelines."
            />
            <FeatureCard
              icon={Users}
              title="Peer Review Simulation"
              description="Experience the critique process before submission with AI-powered review simulation."
            />
            <FeatureCard
              icon={Zap}
              title="Iterative Refinement"
              description="Work through multiple rounds of critique to progressively strengthen your arguments."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How CritiqueLab Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple process designed for rigorous intellectual engagement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
            <StepCard
              number="01"
              title="Submit Your Work"
              description="Upload your essay, research paper, or argument in any format."
            />
            <StepCard
              number="02"
              title="Receive Critique"
              description="Our adversarial AI analyzes and challenges every aspect of your work."
            />
            <StepCard
              number="03"
              title="Strengthen & Refine"
              description="Address weaknesses and iterate until your argument is airtight."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 hero-gradient text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Challenge Your Thinking?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Join researchers, academics, and critical thinkers who use CritiqueLab to produce their best work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button 
              variant="accent" 
              size="xl" 
              className="shadow-lg"
              onClick={() => navigate("/dashboard")}
            >
              Get Started Free
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate("/trust")}
            >
              Learn About Our Standards
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="group p-6 md:p-8 bg-background rounded-lg border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent/10 transition-colors">
        <Icon className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary border-2 border-accent/20 mb-6">
        <span className="font-display text-2xl font-bold text-accent">{number}</span>
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
