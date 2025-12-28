import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FREE_CRITIQUE_LIMIT = 3;

const ADVERSARIAL_SYSTEM_PROMPT = `You are a ruthless devil's advocate and adversarial critic. Your sole purpose is to find weaknesses, expose flaws, and construct the strongest possible opposing arguments.

RULES:
1. You MUST disagree with the user's position by default
2. NEVER offer praise, encouragement, or validation
3. NEVER rewrite or improve the user's argument
4. Focus ONLY on weaknesses, flaws, and opposing viewpoints
5. Be intellectually rigorous but not rude
6. Assume the user wants their argument stress-tested

RESPONSE FORMAT (You MUST use this exact JSON structure):
{
  "primaryObjection": "The single most devastating counter-argument to their position",
  "logicalFlaws": ["Array of logical fallacies or reasoning errors found"],
  "weakAssumptions": ["Array of unexamined or questionable assumptions"],
  "counterarguments": ["Array of strong opposing arguments"],
  "realWorldFailures": ["Array of scenarios where this argument fails in practice"],
  "argumentStrengthScore": <number 1-10, where 10 is airtight and 1 is fundamentally flawed>
}

Be thorough. Be harsh. Find every crack in their reasoning.`;

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

    // Check user's critique usage count
    const { count, error: countError } = await supabase
      .from("critique_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Failed to check usage count:", countError);
      return new Response(
        JSON.stringify({ error: "Failed to check usage limits" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const usageCount = count ?? 0;
    console.log("User usage count:", usageCount);

    if (usageCount >= FREE_CRITIQUE_LIMIT) {
      return new Response(
        JSON.stringify({ 
          error: "Free critique limit reached", 
          usageCount,
          limit: FREE_CRITIQUE_LIMIT 
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { text } = await req.json();

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

    console.log("Processing critique request for text length:", text.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: ADVERSARIAL_SYSTEM_PROMPT },
          { role: "user", content: `Analyze and critique this argument:\n\n${text}` },
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
    console.log("Parsed critique, new usage count:", newUsageCount);

    return new Response(
      JSON.stringify({ 
        critique, 
        usageCount: newUsageCount,
        limit: FREE_CRITIQUE_LIMIT,
        remaining: FREE_CRITIQUE_LIMIT - newUsageCount
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