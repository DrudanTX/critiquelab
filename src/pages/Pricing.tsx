import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, AlertTriangle, Target, Shield, Globe } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "For individual thinkers exploring rigorous critique",
    price: "Free",
    period: "",
    features: [
      { text: "3 critiques total", included: true },
      { text: "Basic argument analysis", included: true },
      { text: "Logical fallacy detection", included: true },
      { text: "Email support", included: true },
      { text: "Priority processing", included: false },
      { text: "Advanced counterarguments", included: false },
      { text: "Citation analysis", included: false },
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Scholar",
    description: "For academics and researchers demanding excellence",
    price: "$10",
    period: "/month",
    features: [
      { text: "Unlimited critiques", included: true },
      { text: "Comprehensive argument analysis", included: true },
      { text: "Logical fallacy detection", included: true },
      { text: "Priority support", included: true },
      { text: "Priority processing", included: true },
      { text: "Advanced counterarguments", included: true },
      { text: "Citation analysis", included: true },
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Institution",
    description: "For universities and research organizations",
    price: "Custom",
    period: "",
    features: [
      { text: "Everything in Scholar", included: true },
      { text: "Team collaboration", included: true },
      { text: "Admin dashboard", included: true },
      { text: "SSO integration", included: true },
      { text: "Custom training", included: true },
      { text: "API access", included: true },
      { text: "Dedicated support", included: true },
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const sampleCritique = {
  primaryObjection: "The argument assumes correlation implies causation without establishing a causal mechanism. Just because two events occur together doesn't mean one causes the other.",
  logicalFlaws: [
    "Hasty generalization from limited examples",
    "Appeal to authority without relevant expertise",
    "False dichotomy presenting only two options when more exist"
  ],
  weakAssumptions: [
    "Assumes the current trend will continue indefinitely",
    "Presumes all stakeholders share the same values and priorities",
    "Takes for granted that the proposed solution has no significant drawbacks"
  ],
  counterarguments: [
    "Historical precedent shows similar approaches have failed in comparable contexts",
    "Alternative explanations account for the observed data more parsimoniously",
    "The argument ignores significant opportunity costs"
  ],
  realWorldFailures: [
    "Implementation would face regulatory hurdles not addressed in the argument",
    "Scaling this solution would encounter diminishing returns",
    "Behavioral economics research suggests people won't respond as predicted"
  ],
  argumentStrengthScore: 4
};

export default function Pricing() {
  const [demoInput, setDemoInput] = useState("");
  const [showDemoResult, setShowDemoResult] = useState(false);
  const [demoUsed, setDemoUsed] = useState(false);

  const handleDemo = () => {
    if (demoInput.trim().length < 10) return;
    setShowDemoResult(true);
    setDemoUsed(true);
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return "text-destructive";
    if (score <= 6) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28 subtle-gradient">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your intellectual ambitions. All plans include our core critique technology.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-12 md:py-16 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Try It Free
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                See the Critique Engine in Action
              </h2>
              <p className="text-muted-foreground">
                Enter any argument below and receive an instant adversarial analysis.
              </p>
            </div>

            {!showDemoResult ? (
              <div className="space-y-4">
                <textarea
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value.slice(0, 200))}
                  placeholder="Enter an argument to critique (max 200 characters)..."
                  className="w-full h-24 p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  disabled={demoUsed}
                  maxLength={200}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {demoInput.length}/200 characters
                  </span>
                  <Button
                    onClick={handleDemo}
                    disabled={demoInput.trim().length < 10 || demoUsed}
                    className="gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {demoUsed ? "Demo Used" : "Run Demo Critique"}
                  </Button>
                </div>
                {demoUsed && !showDemoResult && (
                  <p className="text-sm text-muted-foreground text-center">
                    You've used your free demo. Sign up to continue critiquing.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Your argument:</p>
                  <p className="text-foreground italic">"{demoInput}"</p>
                </div>

                {/* Score */}
                <div className="flex items-center justify-center gap-4 p-6 rounded-lg bg-background border border-border">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Argument Strength</p>
                    <p className={`text-5xl font-display font-bold ${getScoreColor(sampleCritique.argumentStrengthScore)}`}>
                      {sampleCritique.argumentStrengthScore}/10
                    </p>
                  </div>
                </div>

                {/* Critique Sections */}
                <div className="space-y-4">
                  <DemoSection icon={AlertTriangle} title="Primary Objection" iconColor="text-destructive">
                    <p className="text-sm text-muted-foreground">{sampleCritique.primaryObjection}</p>
                  </DemoSection>

                  <DemoSection icon={Target} title="Logical Flaws" iconColor="text-amber-500">
                    <ul className="space-y-1">
                      {sampleCritique.logicalFlaws.map((flaw, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          {flaw}
                        </li>
                      ))}
                    </ul>
                  </DemoSection>

                  <DemoSection icon={Shield} title="Weak Assumptions" iconColor="text-orange-500">
                    <ul className="space-y-1">
                      {sampleCritique.weakAssumptions.map((assumption, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          {assumption}
                        </li>
                      ))}
                    </ul>
                  </DemoSection>

                  <DemoSection icon={Globe} title="Real-World Failures" iconColor="text-rose-500">
                    <ul className="space-y-1">
                      {sampleCritique.realWorldFailures.map((failure, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-rose-500 mt-1">•</span>
                          {failure}
                        </li>
                      ))}
                    </ul>
                  </DemoSection>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Want more in-depth critiques? Sign up for full access.
                  </p>
                  <Button asChild>
                    <Link to="/dashboard">Get Started Free</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-6 md:p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-card border-accent shadow-lg shadow-accent/10 scale-[1.02]"
                    : "bg-card border-border hover:border-accent/30 hover:shadow-md"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-foreground" : "text-muted-foreground/60"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "hero" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link to="/dashboard">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <FAQItem
              question="Can I cancel my subscription anytime?"
              answer="Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
            />
            <FAQItem
              question="Is my data kept confidential?"
              answer="Absolutely. We take academic integrity and data privacy seriously. Your submissions are encrypted and never shared or used to train our models."
            />
            <FAQItem
              question="What file formats do you support?"
              answer="We support PDF, DOCX, TXT, and Markdown files. You can also paste text directly into the submission form."
            />
            <FAQItem
              question="How does the free trial work?"
              answer="The Scholar plan includes a 14-day free trial. No credit card required to start. Cancel anytime during the trial and you won't be charged."
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-background rounded-lg border border-border p-6">
      <h3 className="font-display font-semibold text-foreground mb-2">
        {question}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {answer}
      </p>
    </div>
  );
}

function DemoSection({ 
  icon: Icon, 
  title, 
  iconColor, 
  children 
}: { 
  icon: React.ElementType; 
  title: string; 
  iconColor: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-lg bg-background border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h4 className="font-display font-semibold text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}
