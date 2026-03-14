import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Swords, 
  BarChart3, 
  Microscope, 
  Shield, 
  FileText,
  ArrowRight,
  Trophy,
  TrendingUp,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, ScaleOnHover, StaggerContainer, StaggerItem } from "@/components/animations";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container px-4 md:px-6 py-8">
          {/* Welcome Header */}
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Training Hub
              </h1>
              <p className="text-muted-foreground mt-1">
                Sharpen your reasoning. Win every argument.
              </p>
            </div>
          </FadeIn>

          {/* Primary: Two Hero Cards */}
          <FadeIn delay={0.1}>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Debate Arena Card */}
              <PrimaryCard
                icon={Swords}
                title="Debate Arena"
                description="Challenge AI opponents in structured 3-round debates. Pick a topic, choose your rival, and sharpen your persuasion skills."
                stats={[
                  { icon: Trophy, label: "Ranked Matches" },
                  { icon: TrendingUp, label: "ELO Rating" },
                ]}
                ctaLabel="Enter Arena"
                onClick={() => navigate("/debate")}
                accentClass="bg-accent/10 border-accent/20 hover:border-accent/40"
                iconAccentClass="bg-accent/15 text-accent"
              />

              {/* Command Center Card */}
              <PrimaryCard
                icon={BarChart3}
                title="Command Center"
                description="Track your progress with ELO ratings, achievement badges, weakness heatmaps, and performance analytics across all modes."
                stats={[
                  { icon: Zap, label: "Achievements" },
                  { icon: TrendingUp, label: "Progress" },
                ]}
                ctaLabel="View Stats"
                onClick={() => navigate("/command-center")}
                accentClass="bg-secondary border-border hover:border-accent/30"
                iconAccentClass="bg-secondary text-muted-foreground group-hover:text-accent"
              />
            </div>
          </FadeIn>

          {/* Secondary: Training Tools */}
          <FadeIn delay={0.2}>
            <div className="mb-6">
              <h2 className="text-lg font-display font-semibold text-foreground mb-1">
                Training Tools
              </h2>
              <p className="text-sm text-muted-foreground">
                Supporting drills to target specific skills
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10" staggerDelay={0.1}>
            <StaggerItem>
              <ToolCard
                icon={Microscope}
                title="Argument Autopsy"
                description="Sentence-by-sentence analysis of your reasoning"
                onClick={() => navigate("/autopsy")}
              />
            </StaggerItem>
            <StaggerItem>
              <ToolCard
                icon={Shield}
                title="Counterargument Coach"
                description="Practice defending your position against challenges"
                onClick={() => navigate("/coach")}
              />
            </StaggerItem>
            <StaggerItem>
              <ToolCard
                icon={FileText}
                title="Quick Critique"
                description="Get fast feedback on any essay or argument"
                onClick={() => navigate("/critique")}
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </Layout>
  );
}

function PrimaryCard({
  icon: Icon,
  title,
  description,
  stats,
  ctaLabel,
  onClick,
  accentClass,
  iconAccentClass,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  stats: { icon: React.ElementType; label: string }[];
  ctaLabel: string;
  onClick: () => void;
  accentClass: string;
  iconAccentClass: string;
}) {
  return (
    <ScaleOnHover scale={1.01}>
      <motion.div
        className={`group relative rounded-2xl border p-6 md:p-8 cursor-pointer transition-all duration-300 ${accentClass}`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${iconAccentClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ x: 3 }}
          >
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>

        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex items-center gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <stat.icon className="w-3.5 h-3.5" />
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <Button variant="hero" size="sm" className="rounded-xl">
          {ctaLabel}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </ScaleOnHover>
  );
}

function ToolCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <ScaleOnHover scale={1.02}>
      <motion.div
        className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-accent/30 transition-all"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
        </div>
        <div className="min-w-0">
          <h4 className="font-display text-sm font-semibold text-foreground mb-0.5">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
      </motion.div>
    </ScaleOnHover>
  );
}
