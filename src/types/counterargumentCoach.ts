export type Perspective = "logical" | "ethical" | "practical";

export interface Counterargument {
  perspective: Perspective;
  title: string;
  argument: string;
  whyPersuasive: string;
  attacksWhat: string;
}

export interface RebuttalCoach {
  claimToDefend: string;
  missingEvidence: string[];
  sentenceStarters: string[];
  strategyTip: string;
}

export interface CoachResult {
  counterarguments: Counterargument[];
  rebuttonCoach: RebuttalCoach;
}

export const PERSPECTIVE_CONFIG: Record<Perspective, {
  label: string;
  icon: string;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  textClass: string;
}> = {
  logical: {
    label: "Logical",
    icon: "brain",
    bgClass: "bg-info/10",
    borderClass: "border-info/20",
    iconBgClass: "bg-info/15",
    textClass: "text-info",
  },
  ethical: {
    label: "Ethical",
    icon: "scale",
    bgClass: "bg-accent-secondary/10",
    borderClass: "border-accent-secondary/20",
    iconBgClass: "bg-accent-secondary/15",
    textClass: "text-accent-secondary",
  },
  practical: {
    label: "Practical",
    icon: "hammer",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/20",
    iconBgClass: "bg-warning/15",
    textClass: "text-warning",
  },
};
