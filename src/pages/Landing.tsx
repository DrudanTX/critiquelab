import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Target, Lightbulb, BookOpen, Users, Microscope } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/animations";
import { FloatingOrb } from "@/components/ambient/PaperTexture";

const c = {
  badge: "Quiet thinking, sharper writing",
  heroTitle: "Challenge Your Ideas.",
  heroAccent: "Clarity builds over time.",
  heroDescription: "CritiqueLab helps you refine your arguments in a calm, focused space—finding the gaps before others do, one thought at a time.",
  heroCta: "Start Writing",
  featuresTitle: "Thoughtful Analysis, Not Noise",
  featuresSubtitle: "Take your time. We're here to help you think deeper, not faster.",
  features: [
    { icon: Target, title: "Find the Gaps", description: "Gently identifies weak spots in your reasoning—so you can strengthen them." },
    { icon: Microscope, title: "Argument Autopsy", description: "See what's analysis and what's filler, sentence by sentence.", href: "/autopsy" },
    { icon: Shield, title: "Anticipate Questions", description: "Explore counterarguments before your readers find them." },
    { icon: Lightbulb, title: "Evidence Check", description: "Quietly evaluates how well your examples support your claims." },
    { icon: BookOpen, title: "Academic Care", description: "Ensures your work meets scholarly standards with gentle guidance." },
    { icon: Users, title: "Practice Review", description: "Experience thoughtful critique before you share with the world." },
  ],
  howItWorksTitle: "How It Works",
  howItWorksSubtitle: "Simple steps. Take your time with each one.",
  steps: [
    { number: "01", title: "Share Your Thoughts", description: "Paste your essay, paper, or argument. No rush." },
    { number: "02", title: "Receive Gentle Feedback", description: "Get calm, constructive insights on what could be stronger." },
    { number: "03", title: "Refine & Grow", description: "Iterate at your own pace until it feels right." },
  ],
  ctaTitle: "Ready to think deeper?",
  ctaSubtitle: "Join writers and thinkers who take time to refine their ideas.",
  ctaPrimary: "Get Started",
  ctaSecondary: "Learn More",
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 subtle-gradient" />
        
        <FloatingOrb className="top-1/4 -left-20 w-80 h-80 bg-accent/5" delay={0} />
        <FloatingOrb className="bottom-0 right-0 w-96 h-96 bg-accent-secondary/5" delay={2} />
        
        <div className="relative container px-4 md:px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn delay={0} direction="none">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-secondary/60 border border-border/50 mb-10">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-accent"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {c.badge}
                </span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.15}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-foreground leading-tight mb-8">
                {c.heroTitle}{" "}
                <span className="text-accent">{c.heroAccent}</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
                {c.heroDescription}
              </p>
            </FadeIn>
            
            <FadeIn delay={0.45}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <ScaleOnHover scale={1.02}>
                  <Button 
                    variant="hero" 
                    size="xl" 
                    onClick={() => navigate("/dashboard")}
                  >
                    {c.heroCta}
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
      <section className="py-24 md:py-32 bg-card/50">
        <div className="container px-4 md:px-6">
          <FadeIn className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-5">
              {c.featuresTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {c.featuresSubtitle}
            </p>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.15}>
            {c.features.map((feature) => (
              <StaggerItem key={feature.title}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  href={feature.href}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32">
        <div className="container px-4 md:px-6">
          <FadeIn className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-5">
              {c.howItWorksTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {c.howItWorksSubtitle}
            </p>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto" staggerDelay={0.2}>
            {c.steps.map((step) => (
              <StaggerItem key={step.number}>
                <StepCard number={step.number} title={step.title} description={step.description} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-secondary/30 overflow-hidden relative">
        <FloatingOrb className="-top-20 -right-20 w-80 h-80 bg-accent/10" delay={1} />
        
        <div className="container px-4 md:px-6 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-6">
              {c.ctaTitle}
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              {c.ctaSubtitle}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <ScaleOnHover scale={1.02}>
                <Button variant="hero" size="xl" onClick={() => navigate("/dashboard")}>
                  {c.ctaPrimary}
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </ScaleOnHover>
              <ScaleOnHover scale={1.02}>
                <Button variant="hero-outline" size="xl" onClick={() => navigate("/trust")}>
                  {c.ctaSecondary}
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
    <ScaleOnHover scale={1.02}>
      <motion.div 
        className={`group p-8 bg-background rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-smooth h-full ${href ? "cursor-pointer" : ""}`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={href ? () => navigate(href) : undefined}
      >
        <motion.div 
          className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-all duration-smooth"
          whileHover={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-smooth" />
        </motion.div>
        <h3 className="font-display text-lg font-medium text-foreground mb-3">
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
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/80 border border-accent/20 mb-8"
        whileHover={{ 
          scale: 1.05,
          borderColor: "hsl(var(--accent))",
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="font-display text-xl font-medium text-accent">{number}</span>
      </motion.div>
      <h3 className="font-display text-xl font-medium text-foreground mb-4">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
