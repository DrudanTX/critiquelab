import { Layout } from "@/components/layout/Layout";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { 
  Shield, 
  Lock, 
  BookOpen, 
  Scale, 
  Eye, 
  Heart,
  ArrowRight,
  CheckCircle,
  FileText,
  ScrollText
} from "lucide-react";

export default function Trust() {
  const location = useLocation();
  const privacyRef = useRef<HTMLDivElement>(null);
  const termsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.hash === "#privacy") {
      privacyRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (location.hash === "#terms") {
      termsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

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
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              CritiqueLab is built on a foundation of academic honesty, intellectual rigor, and respect for the scholarly process. Here's how we uphold these values.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <a href="#privacy"><FileText className="w-4 h-4 mr-2" />Privacy Policy</a>
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <a href="#terms"><ScrollText className="w-4 h-4 mr-2" />Terms of Service</a>
              </Button>
            </div>
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

      {/* Privacy Policy */}
      <section ref={privacyRef} id="privacy" className="py-16 md:py-24 scroll-mt-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Privacy Policy
                </h2>
                <p className="text-sm text-muted-foreground">Last updated: March 12, 2026</p>
              </div>
            </div>

            <div className="space-y-8">
              <PolicySection
                title="1. Information We Collect"
                content={[
                  "Account Information: When you create an account, we collect your email address and display name. If you sign in via Google, we receive your name, email, and profile picture from Google.",
                  "User Content: We collect the text you submit for critique, including arguments, essays, and debate positions. This content is stored securely and associated with your account.",
                  "Usage Data: We collect anonymized usage analytics such as page views and feature usage to improve the service. We do not track individual behavior across third-party sites.",
                  "Device Information: We collect basic device and browser information (e.g., browser type, screen size) for compatibility and debugging purposes.",
                ]}
              />
              <PolicySection
                title="2. How We Use Your Information"
                content={[
                  "To provide, maintain, and improve the CritiqueLab service.",
                  "To process your submissions and deliver AI-powered critiques, scores, and feedback.",
                  "To personalize your experience, including tracking your progress and Elo rating.",
                  "To communicate with you about service updates or respond to support inquiries.",
                  "We do NOT use your submitted content to train AI models.",
                  "We do NOT sell, rent, or share your personal information with third parties for marketing purposes.",
                ]}
              />
              <PolicySection
                title="3. Data Storage & Security"
                content={[
                  "Your data is stored on secure, encrypted servers. We use industry-standard security measures including encryption in transit (TLS) and at rest.",
                  "Access to user data is restricted to essential service operations only.",
                  "We retain your account data and submission history for as long as your account is active. You may request deletion of your account and all associated data at any time.",
                ]}
              />
              <PolicySection
                title="4. Third-Party Services"
                content={[
                  "We use third-party AI models to generate critiques. Your submissions are sent to these providers for processing but are not stored by them beyond the request lifecycle.",
                  "We use analytics services to understand aggregate usage patterns. These services collect anonymized, non-personally-identifiable data.",
                  "We use Google OAuth for authentication. Google's use of your data is governed by Google's own Privacy Policy.",
                ]}
              />
              <PolicySection
                title="5. Your Rights"
                content={[
                  "Access: You can view all data associated with your account at any time through the Command Center.",
                  "Deletion: You may request complete deletion of your account and all associated data by contacting us.",
                  "Portability: You may request an export of your data in a machine-readable format.",
                  "Correction: You can update your profile information at any time.",
                ]}
              />
              <PolicySection
                title="6. Cookies"
                content={[
                  "We use essential cookies for authentication and session management. We do not use advertising or tracking cookies.",
                ]}
              />
              <PolicySection
                title="7. Changes to This Policy"
                content={[
                  "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification. Continued use of the service after changes constitutes acceptance of the updated policy.",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Service */}
      <section ref={termsRef} id="terms" className="py-16 md:py-24 bg-card scroll-mt-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <ScrollText className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Terms of Service
                </h2>
                <p className="text-sm text-muted-foreground">Last updated: March 12, 2026</p>
              </div>
            </div>

            <div className="space-y-8">
              <PolicySection
                title="1. Acceptance of Terms"
                content={[
                  "By accessing or using CritiqueLab, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.",
                  "You must be at least 13 years of age to use CritiqueLab. If you are under 18, you must have parental or guardian consent.",
                ]}
              />
              <PolicySection
                title="2. Description of Service"
                content={[
                  "CritiqueLab is an AI-powered platform designed to help users strengthen their critical thinking and argumentation skills. The service provides automated critique, scoring, debate simulation, and argument analysis.",
                  "CritiqueLab is an educational tool. It does not provide legal, medical, financial, or professional advice.",
                ]}
              />
              <PolicySection
                title="3. User Accounts"
                content={[
                  "You are responsible for maintaining the security of your account credentials.",
                  "You are responsible for all activity that occurs under your account.",
                  "You must provide accurate information when creating an account and keep it up to date.",
                  "We reserve the right to suspend or terminate accounts that violate these terms.",
                ]}
              />
              <PolicySection
                title="4. Acceptable Use"
                content={[
                  "You may use CritiqueLab to improve your own critical thinking and argumentation skills.",
                  "You may NOT use the service to generate content intended to be submitted as your own original academic work in violation of your institution's policies.",
                  "You may NOT use the service for any illegal, harmful, or abusive purpose.",
                  "You may NOT attempt to reverse-engineer, exploit, or compromise the service's security.",
                  "You may NOT use automated tools to scrape or bulk-access the service.",
                ]}
              />
              <PolicySection
                title="5. Intellectual Property"
                content={[
                  "You retain full ownership of all content you submit to CritiqueLab.",
                  "By submitting content, you grant CritiqueLab a limited, non-exclusive license to process your content solely for the purpose of providing the service.",
                  "The CritiqueLab platform, branding, and interface are the intellectual property of CritiqueLab and may not be copied or reproduced without permission.",
                ]}
              />
              <PolicySection
                title="6. AI-Generated Content"
                content={[
                  "Critiques, scores, counterarguments, and other AI-generated feedback are provided as educational guidance only.",
                  "AI-generated content may contain errors or inaccuracies. You are responsible for evaluating and verifying any feedback received.",
                  "CritiqueLab does not guarantee the accuracy, completeness, or suitability of AI-generated content for any particular purpose.",
                ]}
              />
              <PolicySection
                title="7. Limitation of Liability"
                content={[
                  "CritiqueLab is provided \"as is\" without warranties of any kind, express or implied.",
                  "We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.",
                  "Our total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.",
                ]}
              />
              <PolicySection
                title="8. Termination"
                content={[
                  "You may stop using CritiqueLab and delete your account at any time.",
                  "We may suspend or terminate your access if you violate these terms, with or without notice.",
                  "Upon termination, your right to use the service ceases immediately. We may delete your data after a reasonable retention period.",
                ]}
              />
              <PolicySection
                title="9. Changes to Terms"
                content={[
                  "We may modify these Terms of Service at any time. Material changes will be communicated via email or in-app notification.",
                  "Continued use of the service after changes take effect constitutes your acceptance of the revised terms.",
                ]}
              />
              <PolicySection
                title="10. Contact"
                content={[
                  "If you have questions about these Terms of Service or our Privacy Policy, please reach out through the CritiqueLab platform.",
                ]}
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

function PolicySection({ title, content }: { title: string; content: string[] }) {
  return (
    <div className="bg-background rounded-lg border border-border p-6 md:p-8">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {content.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-accent" />
            <span className="text-muted-foreground leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
