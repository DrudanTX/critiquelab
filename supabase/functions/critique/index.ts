/**
 * CritiqueLab Edge Function - Security Hardened
 * 
 * SECURITY FEATURES:
 * 1. Rate limiting (IP-based with in-memory store)
 * 2. Strict input validation with schema-based checks
 * 3. Input sanitization and length limits
 * 4. API key handling via environment variables only
 * 5. OWASP best practices applied
 * 
 * @see https://owasp.org/www-project-api-security/
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ============================================================================
// CORS Configuration
// ============================================================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// Rate Limiting Configuration
// SECURITY: Prevents abuse and DoS attacks
// ============================================================================
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limit store (resets on function restart)
// For production scale, consider using Redis or Supabase
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 10,           // Maximum requests per window
  windowMs: 60 * 1000,       // Time window in milliseconds (1 minute)
  cleanupIntervalMs: 5 * 60 * 1000, // Cleanup old entries every 5 minutes
};

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_CONFIG.cleanupIntervalMs);

/**
 * Extracts client IP address from request headers
 * Handles various proxy configurations (Cloudflare, standard proxies)
 * 
 * SECURITY: Validates IP format to prevent header injection
 */
function getClientIP(req: Request): string {
  // Check standard proxy headers in order of preference
  const headers = [
    "cf-connecting-ip",      // Cloudflare
    "x-real-ip",             // Nginx
    "x-forwarded-for",       // Standard proxy header
  ];

  for (const header of headers) {
    const value = req.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs; take the first one
      const ip = value.split(",")[0].trim();
      // Basic IP format validation (IPv4 or IPv6)
      if (/^[\d.:a-fA-F]+$/.test(ip)) {
        return ip;
      }
    }
  }

  return "unknown";
}

/**
 * Checks if a request should be rate limited
 * Returns true if request is allowed, false if rate limited
 * 
 * SECURITY: Prevents abuse by limiting request frequency per IP
 */
function checkRateLimit(clientIP: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = `ip:${clientIP}`;
  
  let entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    entry = {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
    rateLimitStore.set(key, entry);
    return { allowed: true };
  }
  
  if (entry.count >= RATE_LIMIT_CONFIG.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);
  return { allowed: true };
}

/**
 * Creates a graceful 429 response with helpful headers
 * 
 * SECURITY: Provides clear feedback without exposing internal details
 */
function createRateLimitResponse(retryAfter: number): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please slow down and try again.",
      retryAfter,
      message: "Rate limit exceeded. You can make up to 10 requests per minute.",
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(RATE_LIMIT_CONFIG.maxRequests),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

// ============================================================================
// Input Validation Configuration
// SECURITY: Schema-based validation prevents injection and malformed data
// ============================================================================

// Allowed persona values (whitelist approach)
const VALID_PERSONAS = ["demo", "free", "pro_general", "pro_business"] as const;
type Persona = typeof VALID_PERSONAS[number];

// Input constraints
const INPUT_CONSTRAINTS = {
  minTextLength: 10,         // Minimum characters for meaningful critique
  maxTextLength: 50000,      // Maximum characters (prevent DoS via large payloads)
  maxRequestBodySize: 100000, // Maximum request body size in bytes
};

/**
 * Validates and sanitizes the persona input
 * 
 * SECURITY: Whitelist validation - only allows predefined values
 */
function validatePersona(input: unknown): Persona {
  if (typeof input !== "string") {
    return "free"; // Default to free persona
  }
  
  const normalized = input.toLowerCase().trim();
  
  if (VALID_PERSONAS.includes(normalized as Persona)) {
    return normalized as Persona;
  }
  
  // Invalid persona - default to free (don't expose error to prevent enumeration)
  console.warn(`Invalid persona attempted: ${input.substring(0, 50)}`);
  return "free";
}

/**
 * Sanitizes text input by removing potentially harmful content
 * 
 * SECURITY: Prevents various injection attacks while preserving legitimate content
 */
function sanitizeText(text: string): string {
  return text
    // Remove null bytes (can cause issues in some systems)
    .replace(/\0/g, "")
    // Normalize line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Trim excessive whitespace
    .trim();
}

/**
 * Validates the input text for critique
 * Returns either the sanitized text or an error object
 * 
 * SECURITY: Comprehensive validation with specific error messages
 */
function validateText(input: unknown): { valid: true; text: string } | { valid: false; error: string } {
  // Type check
  if (typeof input !== "string") {
    return { valid: false, error: "Text must be a string" };
  }
  
  // Sanitize
  const sanitized = sanitizeText(input);
  
  // Length checks
  if (sanitized.length === 0) {
    return { valid: false, error: "Text cannot be empty" };
  }
  
  if (sanitized.length < INPUT_CONSTRAINTS.minTextLength) {
    return { 
      valid: false, 
      error: `Text must be at least ${INPUT_CONSTRAINTS.minTextLength} characters for meaningful critique` 
    };
  }
  
  if (sanitized.length > INPUT_CONSTRAINTS.maxTextLength) {
    return { 
      valid: false, 
      error: `Text exceeds maximum length of ${INPUT_CONSTRAINTS.maxTextLength} characters` 
    };
  }
  
  return { valid: true, text: sanitized };
}

/**
 * Validates the request body structure
 * Rejects unexpected fields that don't belong to CritiqueLab
 * 
 * SECURITY: Strict schema validation prevents injection via unexpected fields
 */
function validateRequestBody(body: unknown): { 
  valid: true; 
  data: { text: string; persona: Persona } 
} | { 
  valid: false; 
  error: string 
} {
  // Must be an object
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { valid: false, error: "Request body must be a JSON object" };
  }
  
  const obj = body as Record<string, unknown>;
  
  // Check for unexpected fields (whitelist approach)
  const allowedFields = new Set(["text", "persona"]);
  const unexpectedFields = Object.keys(obj).filter(key => !allowedFields.has(key));
  
  if (unexpectedFields.length > 0) {
    console.warn(`Unexpected fields in request: ${unexpectedFields.join(", ")}`);
    return { 
      valid: false, 
      error: "Request contains unexpected fields. Only 'text' and 'persona' are allowed." 
    };
  }
  
  // Validate text
  const textValidation = validateText(obj.text);
  if (!textValidation.valid) {
    return { valid: false, error: textValidation.error };
  }
  
  // Validate persona (with fallback to default)
  const persona = validatePersona(obj.persona);
  
  return {
    valid: true,
    data: {
      text: textValidation.text,
      persona,
    },
  };
}

// ============================================================================
// AI Prompt Configuration
// ============================================================================

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

// ============================================================================
// Main Request Handler
// ============================================================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json", "Allow": "POST, OPTIONS" } 
      }
    );
  }

  try {
    // ========================================================================
    // SECURITY: Rate Limiting Check
    // ========================================================================
    const clientIP = getClientIP(req);
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return createRateLimitResponse(rateLimitResult.retryAfter!);
    }

    // ========================================================================
    // SECURITY: Request Size Validation
    // ========================================================================
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > INPUT_CONSTRAINTS.maxRequestBodySize) {
      return new Response(
        JSON.stringify({ error: "Request body too large" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========================================================================
    // SECURITY: Parse and Validate Request Body
    // ========================================================================
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validation = validateRequestBody(rawBody);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { text, persona } = validation.data;

    // ========================================================================
    // SECURITY: API Key Handling
    // All API keys must be stored in environment variables, never in code
    // ========================================================================
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      // Log error but don't expose internal configuration details
      console.error("CRITICAL: LOVABLE_API_KEY is not configured in environment");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the system prompt
    const personaPrompt = getPersonaPrompt(persona);
    const fullSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${personaPrompt}`;

    // Log request metadata (never log the actual content or API keys)
    console.log(`Processing critique: IP=${clientIP}, textLength=${text.length}, persona=${persona}`);

    // ========================================================================
    // AI API Call
    // ========================================================================
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        // SECURITY: API key passed via Authorization header, never in URL or body
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

    // Handle API errors with appropriate user-facing messages
    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI service rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Log detailed error for debugging but return generic message
      const errorText = await response.text();
      console.error(`AI gateway error: status=${response.status}, body=${errorText.substring(0, 200)}`);
      return new Response(
        JSON.stringify({ error: "Failed to process your request. Please try again." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Empty response from AI");
      return new Response(
        JSON.stringify({ error: "Received empty response from AI service" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
      console.error("Failed to parse AI response:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse critique response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Critique completed: IP=${clientIP}, persona=${persona}`);

    return new Response(
      JSON.stringify({ 
        critique, 
        persona
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          // Security headers
          "X-Content-Type-Options": "nosniff",
        } 
      }
    );
  } catch (error) {
    // SECURITY: Never expose internal error details to clients
    console.error("Critique function error:", error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
