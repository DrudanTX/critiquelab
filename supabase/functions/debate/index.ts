import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPPONENT_PROMPTS: Record<string, string> = {
  skeptic: "You are The Skeptic. Challenge every assumption. Ask 'how do you know that?' and 'what evidence supports this?' Demand proof for every claim. Be intellectually rigorous but fair.",
  lawyer: "You are The Lawyer. Focus on evidence, precedent, and logical consistency. Point out gaps in reasoning, demand citations, and structure your arguments like legal briefs. Be precise and methodical.",
  philosopher: "You are The Philosopher. Attack the underlying reasoning and philosophical foundations. Question definitions, expose logical fallacies, and challenge the framework of the argument itself.",
  troll: "You are The Troll. Make intentionally weak or absurd counterarguments to test the user's ability to identify and dismantle bad reasoning. Use strawmen, red herrings, and emotional appeals. Be obviously wrong but entertaining.",
  politician: "You are The Politician. Use emotional persuasion, anecdotes, and rhetorical tricks. Reframe the debate, appeal to values and identity, and try to win the audience rather than the argument.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, topic, opponent, round, userArgument, debateHistory } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (action === "respond") {
      // AI responds to user's argument in the debate
      const opponentPrompt = OPPONENT_PROMPTS[opponent] || OPPONENT_PROMPTS.skeptic;
      const roundLabels: Record<number, string> = {
        1: "Opening Arguments",
        2: "Rebuttals",
        3: "Closing Statements",
      };
      const roundLabel = roundLabels[round] || `Round ${round}`;

      const messages = [
        {
          role: "system",
          content: `${opponentPrompt}

You are debating the topic: "${topic}"
Current phase: ${roundLabel} (Round ${round} of 3)
You are arguing AGAINST the user's position.

Rules:
- Keep responses concise (150-250 words)
- Stay on topic
- Be challenging but intellectually honest (unless you're The Troll)
- In Round 1: Present your strongest counter-position
- In Round 2: Directly address the user's points and counter them
- In Round 3: Summarize why your position is stronger, acknowledge any strong points the user made

Do NOT use markdown headers. Use plain text with occasional bold (**text**) for emphasis.`,
        },
        ...debateHistory.map((entry: any) => ({
          role: entry.role === "user" ? "user" : "assistant",
          content: entry.content,
        })),
        { role: "user", content: userArgument },
      ];

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (response.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error("AI gateway error");
      }

      const result = await response.json();
      const aiResponse = result.choices?.[0]?.message?.content;

      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "analyze") {
      // Post-debate analysis
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a debate performance analyst. Analyze the user's performance in this debate and score them. Be fair but rigorous. Most debaters score 5-7 out of 10.

You MUST respond using the analyze_debate tool.`,
            },
            {
              role: "user",
              content: `Topic: "${topic}"
Opponent style: ${opponent}

Debate transcript:
${debateHistory.map((e: any) => `[${e.role === "user" ? "USER" : "AI"}]: ${e.content}`).join("\n\n")}

Analyze the USER's debate performance.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "analyze_debate",
                description: "Return debate performance analysis",
                parameters: {
                  type: "object",
                  properties: {
                    overall_score: { type: "number", description: "Overall score 0-10 with one decimal" },
                    clarity_score: { type: "integer", minimum: 0, maximum: 25 },
                    evidence_score: { type: "integer", minimum: 0, maximum: 25 },
                    logic_score: { type: "integer", minimum: 0, maximum: 25 },
                    rebuttal_score: { type: "integer", minimum: 0, maximum: 25 },
                    strengths: { type: "array", items: { type: "string" }, description: "2-3 key strengths" },
                    weaknesses: { type: "array", items: { type: "string" }, description: "2-3 key weaknesses" },
                    verdict: { type: "string", enum: ["user_wins", "ai_wins", "draw"], description: "Who won the debate" },
                    summary: { type: "string", description: "2-3 sentence summary of the debate performance" },
                  },
                  required: ["overall_score", "clarity_score", "evidence_score", "logic_score", "rebuttal_score", "strengths", "weaknesses", "verdict", "summary"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "analyze_debate" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (response.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error("AI gateway error");
      }

      const result = await response.json();
      const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in response");

      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ analysis }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("debate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
