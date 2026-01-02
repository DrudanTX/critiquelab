import { AlertTriangle, Target, Brain, Shield, Globe, Gauge, Eye, Crosshair } from "lucide-react";

interface CritiqueData {
  primaryObjection: string;
  logicalFlaws: string[];
  weakAssumptions: string[];
  counterarguments: string[];
  realWorldFailures: string[];
  argumentStrengthScore: number;
  // Demo persona fields
  coreClaimUnderFire?: string;
  obviousWeaknesses?: string[];
  whatWouldBreakThis?: string[];
}

interface CritiqueResultProps {
  critique: CritiqueData;
}

export function CritiqueResult({ critique }: CritiqueResultProps) {
  const getScoreColor = (score: number) => {
    if (score <= 3) return "text-destructive";
    if (score <= 6) return "text-amber-500";
    return "text-accent";
  };

  // Check if this is a demo persona result (has demo-specific fields and no score)
  const isDemoResult = critique.coreClaimUnderFire && critique.obviousWeaknesses;

  if (isDemoResult) {
    return (
      <div className="space-y-6">
        {/* Argument Strength Score */}
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gauge className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Argument Strength Score
            </h3>
          </div>
          <p className={`text-5xl font-display font-bold ${getScoreColor(critique.argumentStrengthScore)}`}>
            {critique.argumentStrengthScore}<span className="text-2xl text-muted-foreground">/10</span>
          </p>
        </div>

        {/* Core Claim Under Fire */}
        <CritiqueSection
          icon={Target}
          title="Core Claim Under Fire"
          iconColor="text-destructive"
        >
          <p className="text-foreground">{critique.coreClaimUnderFire}</p>
        </CritiqueSection>

        {/* Obvious Weaknesses */}
        <CritiqueSection
          icon={Eye}
          title="Obvious Weaknesses"
          iconColor="text-amber-500"
        >
          <ul className="space-y-2">
            {critique.obviousWeaknesses?.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <span className="text-foreground">{weakness}</span>
              </li>
            ))}
          </ul>
        </CritiqueSection>

        {/* What Would Break This */}
        <CritiqueSection
          icon={Crosshair}
          title="What Would Break This"
          iconColor="text-orange-500"
        >
          <ul className="space-y-2">
            {critique.whatWouldBreakThis?.map((scenario, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <span className="text-foreground">{scenario}</span>
              </li>
            ))}
          </ul>
        </CritiqueSection>

        {/* Closing Statement */}
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <p className="text-lg font-display font-semibold text-accent">
            Prove me wrong.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Argument Strength Score */}
      <div className="bg-card rounded-lg border border-border p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gauge className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Argument Strength Score
          </h3>
        </div>
        <p className={`text-5xl font-display font-bold ${getScoreColor(critique.argumentStrengthScore)}`}>
          {critique.argumentStrengthScore}<span className="text-2xl text-muted-foreground">/10</span>
        </p>
      </div>

      {/* Primary Objection */}
      <CritiqueSection
        icon={Target}
        title="Primary Objection"
        iconColor="text-destructive"
      >
        <p className="text-foreground">{critique.primaryObjection}</p>
      </CritiqueSection>

      {/* Logical Flaws */}
      <CritiqueSection
        icon={AlertTriangle}
        title="Logical Flaws"
        iconColor="text-amber-500"
      >
        <ul className="space-y-2">
          {critique.logicalFlaws.map((flaw, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-muted-foreground mt-1">•</span>
              <span className="text-foreground">{flaw}</span>
            </li>
          ))}
        </ul>
      </CritiqueSection>

      {/* Weak Assumptions */}
      <CritiqueSection
        icon={Brain}
        title="Weak Assumptions"
        iconColor="text-purple-500"
      >
        <ul className="space-y-2">
          {critique.weakAssumptions.map((assumption, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-muted-foreground mt-1">•</span>
              <span className="text-foreground">{assumption}</span>
            </li>
          ))}
        </ul>
      </CritiqueSection>

      {/* Counterarguments */}
      <CritiqueSection
        icon={Shield}
        title="Counterarguments"
        iconColor="text-blue-500"
      >
        <ul className="space-y-2">
          {critique.counterarguments.map((counter, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-muted-foreground mt-1">•</span>
              <span className="text-foreground">{counter}</span>
            </li>
          ))}
        </ul>
      </CritiqueSection>

      {/* Real-World Failure Scenarios */}
      <CritiqueSection
        icon={Globe}
        title="Real-World Failure Scenarios"
        iconColor="text-orange-500"
      >
        <ul className="space-y-2">
          {critique.realWorldFailures.map((scenario, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-muted-foreground mt-1">•</span>
              <span className="text-foreground">{scenario}</span>
            </li>
          ))}
        </ul>
      </CritiqueSection>
    </div>
  );
}

function CritiqueSection({ 
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
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
