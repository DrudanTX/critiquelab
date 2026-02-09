/**
 * Counterargument Coach Edge Function
 * Generates 3 strong counterarguments (logical, ethical, practical)
 * plus a rebuttal coaching section
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limiting
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT = { maxRequests: 10, windowMs: 60 * 1000 };

function getClientIP(req: Request): string {
  const headers = ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"];
  for (const header of headers) {
    const value = req.headers.get(header);
    if (value) {
      const ip = value.split(",")[0].trim();
      if (/^[\d.:a-fA-F]+$/.test(ip)) return ip;
    }
  }
  return "unknown";
}

function checkRateLimit(clientIP: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = `ip:${clientIP}`;
  let entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    entry = { count: 1, resetTime: now + RATE_LIMIT.windowMs };
    rateLimitStore.set(key, entry);
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
  }

  entry.count++;
  rateLimitStore.set(key, entry);
  return { allowed: true };
}

const SYSTEM_PROMPT = `You are a Counterargument Coach — a sharp, articulate debate opponent. Your job is to challenge the user's position with strong, well-reasoned counterarguments from three distinct perspectives. You are NOT a teacher, grammar checker, or general feedback tool. You are a debate sparring partner.

YOUR TASK:
1. Read the user's argument/position carefully
2. Generate exactly 3 strong counterarguments, one from each perspective:
   - LOGICAL: Attack the reasoning, logic, or internal consistency of the argument
   - ETHICAL: Challenge the moral, ethical, or values-based foundations
   - PRACTICAL: Attack real-world feasibility, consequences, or implementation
3. For each counterargument, explain:
   - The counterargument itself (2-4 sentences, forceful but fair)
   - Why it's persuasive (1-2 sentences)
   - Which specific part of the original argument it targets (quote or reference the exact claim)
4. Provide a Rebuttal Coach section that guides the user on how to defend their position WITHOUT writing the rebuttal for them

TONE:
- Challenging but constructive — like a tough debate partner who wants you to get better
- Confident, direct, no hedging
- NOT teacher-like, NOT school-like, NOT condescending
- Think: "Here's what a smart opponent would throw at you"

REBUTTAL COACH RULES:
- Do NOT write the rebuttal
- Identify what claim needs defending
- Point out what evidence or reasoning is missing
- Provide sentence starters or structural guidance
- Be specific — reference the counterarguments you just made

You MUST respond with this exact JSON structure:
{
  "counterarguments": [
    {
      "perspective": "logical",
      "title": "Short, punchy title for the counterargument",
      "argument": "The counterargument itself — 2-4 sentences, forceful",
      "whyPersuasive": "Why this hits hard — 1-2 sentences",
      "attacksWhat": "The specific part of the original argument this targets"
    },
    {
      "perspective": "ethical",
      "title": "Short title",
      "argument": "The counterargument",
      "whyPersuasive": "Why it's persuasive",
      "attacksWhat": "What it attacks"
    },
    {
      "perspective": "practical",
      "title": "Short title",
      "argument": "The counterargument",
      "whyPersuasive": "Why it's persuasive",
      "attacksWhat": "What it attacks"
    }
  ],
  "rebuttonCoach": {
    "claimToDefend": "The core claim that needs the strongest defense",
    "missingEvidence": ["Array of specific evidence or reasoning gaps the user should fill"],
    "sentenceStarters": ["Array of 3-4 sentence starters to help structure the rebuttal"],
    "strategyTip": "One key strategic insight for building a stronger defense"
  }
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const clientIP = getClientIP(req);
    const rateLimitResult = checkRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests", retryAfter: rateLimitResult.retryAfter }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Please provide at least 20 characters of text to analyze." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text.length > 10000) {
      return new Response(
        JSON.stringify({ error: "Text exceeds maximum length of 10,000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Challenge this position:\n\n${text.trim()}` },
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate counterarguments" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      result = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse counterarguments" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Counterargument coach error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
