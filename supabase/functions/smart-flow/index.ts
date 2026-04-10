import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, debateHistory, opponent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const transcript = debateHistory
      .map((e: any) => `[${e.role === "user" ? "AFFIRMATIVE (User)" : "NEGATIVE (AI)"}] (Round ${e.round}): ${e.content}`)
      .join("\n\n");

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
            content: `You are a competitive debate flow analyst. Analyze the debate transcript and create a structured debate flow.

Break each speech into discrete arguments. Group them under contentions. Track which arguments get responded to vs dropped. Score argument strength.

The USER is the Affirmative side. The AI opponent is the Negative side.

You MUST respond using the analyze_flow tool.`,
          },
          {
            role: "user",
            content: `Topic: "${topic}"\nOpponent style: ${opponent}\n\nTranscript:\n${transcript}\n\nAnalyze this into a structured debate flow.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_flow",
              description: "Return structured debate flow analysis",
              parameters: {
                type: "object",
                properties: {
                  contentions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        contention: { type: "string", description: "Contention label e.g. 'Economic Impact'" },
                        claim: { type: "string", description: "The core claim in 1-2 sentences" },
                        speaker: { type: "string", enum: ["affirmative", "negative"] },
                        round: { type: "integer" },
                        roundLabel: { type: "string" },
                        responses: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              content: { type: "string", description: "Response summary in 1-2 sentences" },
                              speaker: { type: "string", enum: ["affirmative", "negative"] },
                              round: { type: "integer" },
                              roundLabel: { type: "string" },
                              type: { type: "string", enum: ["rebuttal", "extension", "new-argument"] },
                            },
                            required: ["id", "content", "speaker", "round", "roundLabel", "type"],
                          },
                        },
                        status: { type: "string", enum: ["dropped", "extended", "contested", "neutral"] },
                        strengthScore: { type: "integer", description: "0-100 strength score" },
                      },
                      required: ["id", "contention", "claim", "speaker", "round", "roundLabel", "responses", "status", "strengthScore"],
                    },
                  },
                  droppedArguments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        claim: { type: "string" },
                        speaker: { type: "string", enum: ["affirmative", "negative"] },
                        round: { type: "integer" },
                        impact: { type: "string", description: "Why this drop matters" },
                      },
                      required: ["claim", "speaker", "round", "impact"],
                    },
                  },
                  winningVoters: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        issue: { type: "string" },
                        winner: { type: "string", enum: ["affirmative", "negative"] },
                        reason: { type: "string" },
                      },
                      required: ["issue", "winner", "reason"],
                    },
                  },
                  rfd: { type: "string", description: "Reason for decision - 2-3 sentences explaining who wins and why" },
                  overallWinner: { type: "string", enum: ["affirmative", "negative", "draw"] },
                },
                required: ["contentions", "droppedArguments", "winningVoters", "rfd", "overallWinner"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_flow" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Add funds to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const flowData = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ flow: flowData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("smart-flow error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
