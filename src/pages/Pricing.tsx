import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "For individual thinkers exploring rigorous critique",
    price: "Free",
    period: "",
    features: [
      { text: "3 critiques per month", included: true },
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
    price: "$19",
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

export default function Pricing() {
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

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 -mt-8">
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
