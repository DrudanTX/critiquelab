import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  BookOpen, 
  Scale, 
  Eye, 
  Heart,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function Trust() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28 subtle-gradient">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">
                Our Commitment to You
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              Trust & Academic Integrity
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CritiqueLab is built on a foundation of academic honesty, intellectual rigor, and respect for the scholarly process. Here's how we uphold these values.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-12 text-center">
              Our Core Principles
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <PrincipleCard
                icon={BookOpen}
                title="Academic Honesty"
                description="CritiqueLab is designed to improve your thinking, not replace it. We help you strengthen arguments you've already developed—we never generate content for you to pass off as your own."
              />
              <PrincipleCard
                icon={Lock}
                title="Data Privacy"
                description="Your submissions are encrypted end-to-end and never shared with third parties. We do not use your work to train our models or for any purpose beyond providing your critique."
              />
              <PrincipleCard
                icon={Scale}
                title="Intellectual Ownership"
                description="You retain full ownership of all your submissions and the improved versions you create using our feedback. CritiqueLab makes no claims to your intellectual property."
              />
              <PrincipleCard
                icon={Eye}
                title="Transparency"
                description="Our AI explains its reasoning. Every critique comes with clear explanations of why certain weaknesses were identified, helping you learn and grow as a thinker."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Policies */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-12 text-center">
              Academic Use Guidelines
            </h2>

            <div className="space-y-8">
              <GuidelineSection
                title="Appropriate Uses"
                items={[
                  "Strengthening your own arguments before peer review or submission",
                  "Identifying logical fallacies and weaknesses in your reasoning",
                  "Preparing counterarguments for thesis defense or debate",
                  "Learning to think more critically about your own work",
                  "Testing the robustness of research hypotheses",
                ]}
                isPositive
              />

              <GuidelineSection
                title="Inappropriate Uses"
                items={[
                  "Generating essays or papers to submit as your own work",
                  "Using CritiqueLab to bypass the learning process",
                  "Submitting AI-generated critiques as peer review",
                  "Violating your institution's academic integrity policies",
                  "Using the service for plagiarism or academic dishonesty",
                ]}
                isPositive={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Statement */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
              <Heart className="w-12 h-12 mx-auto mb-6 text-accent" />
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Our Promise
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-8">
                We believe that the best ideas are those that have survived rigorous scrutiny. CritiqueLab exists to help you produce work you can be proud of—work that reflects your thinking, strengthened by constructive challenge.
              </p>
              <blockquote className="font-display text-xl italic text-accent">
                "The test of a first-rate intelligence is the ability to hold two opposing ideas in mind at the same time and still retain the ability to function."
              </blockquote>
              <cite className="block mt-3 text-sm text-primary-foreground/60">
                — F. Scott Fitzgerald
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            Questions About Our Policies?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We're committed to transparency. If you have questions about how CritiqueLab handles your data or supports academic integrity, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard">
                Try CritiqueLab
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function PrincipleCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="p-6 md:p-8 bg-card rounded-lg border border-border hover:shadow-md transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function GuidelineSection({ title, items, isPositive }: { title: string; items: string[]; isPositive: boolean }) {
  return (
    <div className="bg-background rounded-lg border border-border p-6 md:p-8">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        {isPositive ? (
          <CheckCircle className="w-5 h-5 text-accent" />
        ) : (
          <Shield className="w-5 h-5 text-destructive" />
        )}
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isPositive ? 'bg-accent' : 'bg-destructive'}`} />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
