import { Eye, ClipboardCheck, Zap, TrendingDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type Persona = "demo" | "free" | "pro_general" | "pro_business";
export type UserTier = "demo" | "free" | "pro";

interface PersonaOption {
  value: Persona;
  label: string;
  description: string;
  tooltip: string;
  icon: React.ReactNode;
  requiredTier: UserTier;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    value: "demo",
    label: "Surface Skeptic",
    description: "Challenges obvious flaws and weak assumptions.",
    tooltip: "Quick, accessible critique targeting surface-level weaknesses. No deep expertise required.",
    icon: <Eye className="h-5 w-5" />,
    requiredTier: "demo",
  },
  {
    value: "free",
    label: "Relentless Reviewer",
    description: "Grades your argument with strict but fair scrutiny.",
    tooltip: "Acts like a strict grader — questions clarity, evidence, logic, and structure.",
    icon: <ClipboardCheck className="h-5 w-5" />,
    requiredTier: "free",
  },
  {
    value: "pro_general",
    label: "Hostile Expert",
    description: "Applies expert-level standards to tear apart your work.",
    tooltip: "Assumes expert-level standards. Attacks methodology, assumptions, and implications.",
    icon: <Zap className="h-5 w-5" />,
    requiredTier: "pro",
  },
  {
    value: "pro_business",
    label: "Unforgiving Investor",
    description: "Evaluates your idea as if real money is at stake.",
    tooltip: "Thinks like a skeptical VC. Attacks market size, differentiation, moat, and execution.",
    icon: <TrendingDown className="h-5 w-5" />,
    requiredTier: "pro",
  },
];

const TIER_HIERARCHY: Record<UserTier, number> = {
  demo: 0,
  free: 1,
  pro: 2,
};

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  userTier: UserTier;
  disabled?: boolean;
}

function canAccessPersona(userTier: UserTier, requiredTier: UserTier): boolean {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier];
}

function getDefaultPersonaForTier(tier: UserTier): Persona {
  switch (tier) {
    case "pro":
      return "pro_general";
    case "free":
      return "free";
    default:
      return "demo";
  }
}

export { getDefaultPersonaForTier };

export function PersonaSelector({
  selectedPersona,
  onSelectPersona,
  userTier,
  disabled = false,
}: PersonaSelectorProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (option: PersonaOption) => {
    if (disabled) return;
    
    if (!canAccessPersona(userTier, option.requiredTier)) {
      setShowUpgradeModal(true);
      return;
    }
    
    onSelectPersona(option.value);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Critique Mode
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PERSONA_OPTIONS.map((option) => {
            const isLocked = !canAccessPersona(userTier, option.requiredTier);
            const isSelected = selectedPersona === option.value;
            
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleCardClick(option)}
                    disabled={disabled}
                    className={cn(
                      "relative flex flex-col items-start p-4 rounded-lg border text-left transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-teal/50",
                      isSelected && !isLocked
                        ? "border-teal bg-teal/5 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/30",
                      isLocked && "opacity-60 cursor-not-allowed",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {/* Lock badge for locked personas */}
                    {isLocked && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        <Lock className="h-3 w-3" />
                        <span>Pro</span>
                      </div>
                    )}
                    
                    {/* Icon and label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "p-1.5 rounded",
                        isSelected && !isLocked 
                          ? "text-teal bg-teal/10" 
                          : "text-muted-foreground bg-muted"
                      )}>
                        {option.icon}
                      </div>
                      <span className={cn(
                        "font-medium text-sm",
                        isSelected && !isLocked ? "text-foreground" : "text-foreground/80"
                      )}>
                        {option.label}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                    
                    {/* Selection indicator */}
                    {isSelected && !isLocked && (
                      <div className="absolute bottom-2 right-2">
                        <div className="h-2 w-2 rounded-full bg-teal" />
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="max-w-xs bg-popover border-border"
                >
                  <p className="text-sm">{option.tooltip}</p>
                  {isLocked && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Upgrade to Pro to unlock this mode.
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to Pro</DialogTitle>
            <DialogDescription>
              Pro personas provide expert-level critique with deeper analysis and domain-specific scrutiny.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Hostile Expert:</strong> Academic and technical rigor</p>
              <p><strong className="text-foreground">Unforgiving Investor:</strong> Business viability analysis</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button 
                onClick={() => {
                  setShowUpgradeModal(false);
                  navigate("/pricing");
                }}
                className="flex-1 bg-teal hover:bg-teal/90 text-white"
              >
                View Plans
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
