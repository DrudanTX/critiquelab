export interface FlowArgument {
  id: string;
  contention: string;
  claim: string;
  speaker: "affirmative" | "negative";
  round: number;
  roundLabel: string;
  responses: FlowResponse[];
  status: "dropped" | "extended" | "contested" | "neutral";
  strengthScore: number; // 0-100
}

export interface FlowResponse {
  id: string;
  content: string;
  speaker: "affirmative" | "negative";
  round: number;
  roundLabel: string;
  type: "rebuttal" | "extension" | "new-argument";
}

export interface DroppedArgument {
  claim: string;
  speaker: "affirmative" | "negative";
  round: number;
  impact: string;
}

export interface WinningVoter {
  issue: string;
  winner: "affirmative" | "negative";
  reason: string;
}

export interface SmartFlowData {
  contentions: FlowArgument[];
  droppedArguments: DroppedArgument[];
  winningVoters: WinningVoter[];
  rfd: string; // Reason for Decision
  overallWinner: "affirmative" | "negative" | "draw";
}
