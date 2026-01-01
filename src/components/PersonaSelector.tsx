import { Eye, ClipboardCheck, Zap, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Persona = "demo" | "free" | "pro_general" | "pro_business";

interface PersonaOption {
  value: Persona;
  label: string;
  description: string;
  tooltip: string;
  icon: React.ReactNode;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    value: "demo",
    label: "Surface Skeptic",
    description: "Challenges obvious flaws and weak assumptions.",
    tooltip: "Quick, accessible critique targeting surface-level weaknesses. No deep expertise required.",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    value: "free",
    label: "Relentless Reviewer",
    description: "Grades your argument with strict but fair scrutiny.",
    tooltip: "Acts like a strict grader — questions clarity, evidence, logic, and structure.",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    value: "pro_general",
    label: "Hostile Expert",
    description: "Applies expert-level standards to tear apart your work.",
    tooltip: "Assumes expert-level standards. Attacks methodology, assumptions, and implications.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    value: "pro_business",
    label: "Unforgiving Investor",
    description: "Evaluates your idea as if real money is at stake.",
    tooltip: "Thinks like a skeptical VC. Attacks market size, differentiation, moat, and execution.",
    icon: <TrendingDown className="h-5 w-5" />,
  },
];

function getDefaultPersona(): Persona {
  return "free";
}

export { getDefaultPersona };

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  disabled?: boolean;
}

export function PersonaSelector({
  selectedPersona,
  onSelectPersona,
  disabled = false,
}: PersonaSelectorProps) {
  const handleCardClick = (option: PersonaOption) => {
    if (disabled) return;
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
                      isSelected
                        ? "border-teal bg-teal/5 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/30",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {/* Icon and label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "p-1.5 rounded",
                        isSelected 
                          ? "text-teal bg-teal/10" 
                          : "text-muted-foreground bg-muted"
                      )}>
                        {option.icon}
                      </div>
                      <span className={cn(
                        "font-medium text-sm",
                        isSelected ? "text-foreground" : "text-foreground/80"
                      )}>
                        {option.label}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                    
                    {/* Selection indicator */}
                    {isSelected && (
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
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
