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
    const { text, source } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Text too short" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an argument scoring engine. Analyze the given text and score it across 4 categories, each 0-25 points.

Categories:
1. Clarity (0-25): Is the argument clear, focused, and well-structured?
2. Logic (0-25): Does the reasoning follow logically? Are there fallacies?
3. Evidence (0-25): Is support sufficient, relevant, and well-cited?
4. Defense (0-25): How well would this hold up against counterarguments?

Be fair but rigorous. Most arguments score 40-70 total. Scores above 85 are exceptional.

You MUST respond using the score_argument tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Score this argument:\n\n${text.slice(0, 50000)}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "score_argument",
              description: "Return the argument score breakdown",
              parameters: {
                type: "object",
                properties: {
                  clarity_score: { type: "integer", minimum: 0, maximum: 25 },
                  logic_score: { type: "integer", minimum: 0, maximum: 25 },
                  evidence_score: { type: "integer", minimum: 0, maximum: 25 },
                  defense_score: { type: "integer", minimum: 0, maximum: 25 },
                  clarity_explanation: { type: "string", description: "One sentence on clarity" },
                  logic_explanation: { type: "string", description: "One sentence on logic" },
                  evidence_explanation: { type: "string", description: "One sentence on evidence" },
                  defense_explanation: { type: "string", description: "One sentence on defense" },
                  clarity_suggestion: { type: "string", description: "One actionable suggestion for clarity" },
                  logic_suggestion: { type: "string", description: "One actionable suggestion for logic" },
                  evidence_suggestion: { type: "string", description: "One actionable suggestion for evidence" },
                  defense_suggestion: { type: "string", description: "One actionable suggestion for defense" },
                },
                required: [
                  "clarity_score", "logic_score", "evidence_score", "defense_score",
                  "clarity_explanation", "logic_explanation", "evidence_explanation", "defense_explanation",
                  "clarity_suggestion", "logic_suggestion", "evidence_suggestion", "defense_suggestion",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "score_argument" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const scores = JSON.parse(toolCall.function.arguments);
    const totalScore = scores.clarity_score + scores.logic_score + scores.evidence_score + scores.defense_score;

    return new Response(JSON.stringify({ 
      score: { ...scores, total_score: totalScore },
      source: source || "critique",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("score-argument error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
