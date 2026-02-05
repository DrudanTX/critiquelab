import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
 import { ArrowRight, Shield, Target, Lightbulb, BookOpen, Users, Zap, Microscope } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover, FloatingElement } from "@/components/animations";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 subtle-gradient" />
        
        {/* Animated background elements */}
        <FloatingElement className="absolute top-1/4 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" duration={6} distance={20}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" duration={8} distance={15}>
          <div />
        </FloatingElement>
        
        <div className="relative container px-4 md:px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn delay={0} direction="none">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-accent"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  Adversarial AI for Critical Thinking
                </span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
                Challenge Your Ideas.{" "}
                <span className="text-gradient">Made to Prove You Wrong.</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                CritiqueLab is an adversarial AI platform that rigorously challenges your essays, research papers, and arguments—helping you strengthen your work before others find the flaws.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <ScaleOnHover>
                  <Button 
                    variant="hero" 
                    size="xl" 
                    onClick={() => navigate("/dashboard")}
                  >
                    Start Challenging
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2" size={20} />
                    </motion.span>
                  </Button>
                </ScaleOnHover>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container px-4 md:px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Rigorous Analysis, Not Flattery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike typical AI assistants, CritiqueLab actively seeks weaknesses in your arguments to help you build stronger work.
            </p>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" staggerDelay={0.1}>
            <StaggerItem>
              <FeatureCard
                icon={Target}
                title="Argument Analysis"
                description="Identifies logical fallacies, weak premises, and gaps in reasoning that could undermine your thesis."
              />
            </StaggerItem>
           <StaggerItem>
             <FeatureCard
               icon={Microscope}
               title="Argument Autopsy"
               description="Dissect your arguments sentence by sentence to see what's analysis and what's filler."
               href="/autopsy"
             />
           </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={Shield}
                title="Counterargument Generation"
                description="Anticipates opposing viewpoints and helps you prepare robust responses to criticism."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={Lightbulb}
                title="Evidence Evaluation"
                description="Assesses the strength and relevance of your supporting evidence and citations."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={BookOpen}
                title="Academic Standards"
                description="Ensures your work meets scholarly rigor and adheres to academic integrity guidelines."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={Users}
                title="Peer Review Simulation"
                description="Experience the critique process before submission with AI-powered review simulation."
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How CritiqueLab Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple process designed for rigorous intellectual engagement.
            </p>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto" staggerDelay={0.15}>
            <StaggerItem>
              <StepCard
                number="01"
                title="Submit Your Work"
                description="Upload your essay, research paper, or argument in any format."
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                number="02"
                title="Receive Critique"
                description="Our adversarial AI analyzes and challenges every aspect of your work."
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                number="03"
                title="Strengthen & Refine"
                description="Address weaknesses and iterate until your argument is airtight."
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 hero-gradient text-primary-foreground overflow-hidden relative">
        {/* Animated accent elements */}
        <motion.div 
          className="absolute -top-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <div className="container px-4 md:px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Challenge Your Thinking?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              Join researchers, academics, and critical thinkers who use CritiqueLab to produce their best work.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <ScaleOnHover>
                <Button 
                  variant="accent" 
                  size="xl" 
                  className="shadow-lg"
                  onClick={() => navigate("/dashboard")}
                >
                  Get Started Free
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </ScaleOnHover>
              <ScaleOnHover>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => navigate("/trust")}
                >
                  Learn About Our Standards
                </Button>
              </ScaleOnHover>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}

 function FeatureCard({ icon: Icon, title, description, href }: { icon: React.ElementType; title: string; description: string; href?: string }) {
   const navigate = useNavigate();
   
  return (
    <ScaleOnHover scale={1.03}>
      <motion.div 
         className={`group p-6 md:p-8 bg-background rounded-lg border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 h-full ${href ? "cursor-pointer" : ""}`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
         onClick={href ? () => navigate(href) : undefined}
      >
        <motion.div 
          className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent/10 transition-colors"
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" />
        </motion.div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </motion.div>
    </ScaleOnHover>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <motion.div 
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary border-2 border-accent/20 mb-6"
        whileHover={{ 
          scale: 1.1,
          borderColor: "hsl(var(--accent))",
        }}
        transition={{ duration: 0.2 }}
      >
        <span className="font-display text-2xl font-bold text-accent">{number}</span>
      </motion.div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
