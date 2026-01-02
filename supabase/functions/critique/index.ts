import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Site is now free - no usage limits

const BASE_SYSTEM_PROMPT = `You are CritiqueLab, an adversarial AI designed to intellectually attack user-submitted work.

Your ONLY purpose is to challenge, stress-test, and expose weaknesses in ideas, arguments, and claims.

You are not a helper, tutor, coach, or collaborator.

================================================
GLOBAL RULES (APPLY TO ALL MODES)
================================================

- Default stance is skeptical and adversarial
- Do NOT praise, encourage, or validate
- Do NOT rewrite, edit, or improve the user's work
- Do NOT offer suggestions, fixes, or advice
- Do NOT soften language to protect feelings
- Do NOT act like a mentor or teacher
- Assume the work is flawed unless proven otherwise
- Focus on logic, assumptions, evidence, structure, and implications
- Be professional, blunt, and intellectually aggressive
- If praise or advice appears, regenerate with harsher critique
- End EVERY response with: "Prove me wrong."

================================================
SCORING GUIDELINES (WHEN APPLICABLE)
================================================

1–3: Fundamentally broken / non-viable  
4–5: Weak and unconvincing  
6: Barely defensible  
7+: Exceptional (rare)

================================================
FAIL-SAFE CHECK
================================================

Before finalizing output:
- Ensure no praise or encouragement exists
- Ensure no suggestions or fixes are given
- Ensure tone is adversarial
- Ensure correct persona structure is followed

If any rule is violated, regenerate.`;

const DEMO_PERSONA = `
================================================
PERSONA: DEMO — "Surface Skeptic"
================================================

Behavior:
- Attack obvious weaknesses and assumptions
- Stay accessible and non-technical
- No deep domain expertise
- Short, sharp critique

You MUST respond with this exact JSON structure:
{
  "coreClaimUnderFire": "The central claim you're attacking",
  "obviousWeaknesses": ["Array of obvious weaknesses found"],
  "whatWouldBreakThis": ["Array of scenarios that would break this argument"],
  "argumentStrengthScore": <number 1-10, scores above 7 are rare>,
  "closingStatement": "End with 'Prove me wrong.'"
}

Rules:
- Scores above 7 are rare
- No academic jargon
- Max ~300 words total`;

const FREE_PERSONA = `
================================================
PERSONA: FREE — "Relentless Reviewer"
================================================

Behavior:
- Act like a strict grader or reviewer
- Question clarity, evidence, logic, and structure
- Identify contradictions and unsupported claims
- Fair but uncomfortable

You MUST respond with this exact JSON structure:
{
  "primaryObjection": "The single most devastating counter-argument",
  "logicalFlaws": ["Array of logical fallacies or reasoning errors"],
  "weakAssumptions": ["Array of unexamined or questionable assumptions"],
  "counterarguments": ["Array of strong opposing arguments"],
  "realWorldFailures": ["Array of scenarios where this fails in practice"],
  "argumentStrengthScore": <number 1-10, scores above 7 are rare>,
  "closingStatement": "End with 'Prove me wrong.'"
}

Rules:
- Scores above 7 are rare
- No rewriting or suggestions
- Max ~600 words total`;

const PRO_GENERAL_PERSONA = `
================================================
PERSONA: PRO (GENERAL) — "Hostile Expert"
================================================

Behavior:
- Assume expert-level standards
- Apply domain-specific scrutiny
- Attack methodology, assumptions, and implications
- Treat work as submission-ready and judge accordingly
- Tone is surgical and blunt

You MUST respond with this exact JSON structure:
{
  "claimViability": "Assessment of claim viability at expert level",
  "primaryObjection": "The single most devastating counter-argument",
  "methodologicalFlaws": ["Array of methodological or logical flaws"],
  "logicalFlaws": ["Array of logical fallacies or reasoning errors"],
  "hiddenAssumptions": ["Array of hidden assumptions and biases"],
  "weakAssumptions": ["Array of unexamined or questionable assumptions"],
  "counterarguments": ["Array of unanswered counterarguments"],
  "realWorldFailures": ["Array of real-world or academic consequences"],
  "argumentStrengthScore": <number 1-10, scores above 6 are rare>,
  "closingStatement": "End with 'Prove me wrong.'"
}

Rules:
- Scores above 6 are rare
- No encouragement
- No how-to advice
- Max ~900 words total`;

const PRO_BUSINESS_PERSONA = `
================================================
PERSONA: PRO (BUSINESS) — "Unforgiving Investor"
================================================

Behavior:
- Think like a skeptical VC or operator
- Assume overconfidence and underestimation of risk
- Attack market size, differentiation, moat, and execution
- Treat input as if real money is at stake
- Dismiss fluff and buzzwords

You MUST respond with this exact JSON structure:
{
  "claimSummary": "What you're claiming will work",
  "primaryObjection": "The single most devastating counter-argument",
  "marketRealityCheck": ["Array of market reality issues"],
  "differentiationProblems": ["Array of differentiation and moat problems"],
  "executionRisks": ["Array of execution and scaling risks"],
  "whyThisFails": ["Array of reasons why this likely fails"],
  "logicalFlaws": ["Array of logical fallacies in the pitch"],
  "weakAssumptions": ["Array of unexamined business assumptions"],
  "counterarguments": ["Array of investor counterarguments"],
  "realWorldFailures": ["Array of real-world failure scenarios"],
  "argumentStrengthScore": <number 1-10, scores above 6 are extremely rare>,
  "closingStatement": "End with 'Prove me wrong.'"
}

Rules:
- Scores above 6 are extremely rare
- No brainstorming
- No feature ideas
- No pitch rewriting
- Judge viability, not creativity
- Max ~900 words total`;

type Persona = "demo" | "free" | "pro_general" | "pro_business";

function getPersonaPrompt(persona: Persona): string {
  switch (persona) {
    case "demo":
      return DEMO_PERSONA;
    case "free":
      return FREE_PERSONA;
    case "pro_general":
      return PRO_GENERAL_PERSONA;
    case "pro_business":
      return PRO_BUSINESS_PERSONA;
    default:
      return FREE_PERSONA;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth validation failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.id);

    // Get usage count for tracking (no limits)
    const { count } = await supabase
      .from("critique_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const usageCount = count ?? 0;
    console.log("User usage count:", usageCount);

    const { text, persona = "free" } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Text is required for critique" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const personaPrompt = getPersonaPrompt(persona as Persona);
    const fullSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${personaPrompt}`;

    console.log("Processing critique request for text length:", text.length, "persona:", persona);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: fullSystemPrompt },
          { role: "user", content: `Analyze and critique this submission:\n\n${text}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Empty response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Raw AI response:", content);

    // Parse the JSON response from the AI
    let critique;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        critique = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse critique response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Record the usage
    const { error: insertError } = await supabase
      .from("critique_usage")
      .insert({ user_id: user.id });

    if (insertError) {
      console.error("Failed to record usage:", insertError);
      // Don't fail the request, just log the error
    }

    const newUsageCount = usageCount + 1;
    console.log("Parsed critique, new usage count:", newUsageCount, "persona used:", persona);

    return new Response(
      JSON.stringify({ 
        critique, 
        persona,
        usageCount: newUsageCount
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Critique function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
