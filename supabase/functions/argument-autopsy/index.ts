 /**
  * Argument Autopsy Edge Function
  * Analyzes argument structure and classifies sentences
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
 
 const SYSTEM_PROMPT = `You are an Argument Autopsy tool for CritiqueLab. Your job is to analyze arguments and classify each sentence.
 
 CLASSIFICATION CATEGORIES:
 - claim: Central assertion or position being argued
 - reasoning: Explanation of WHY the claim is true (the warrant)
 - evidence: Facts, statistics, examples, or quotes that support
 - impact: Why this matters, consequences, significance
 - filler: Restatement, repetition, or content that adds no analytical value
 
 ANALYSIS REQUIREMENTS:
 1. Split the text into sentences
 2. Classify each sentence into exactly ONE category
 3. Provide a brief explanation (1 sentence) for why you classified it that way
 4. Calculate what percentage of the argument is actual analysis vs filler
 5. Identify missing components (e.g., "No impact detected", "Missing evidence")
 6. Calculate an overall argument strength score (0-100)
 7. Provide 3-5 actionable improvement suggestions in student-friendly language
 
 SCORING GUIDELINES:
 - 0-30: Mostly filler, lacks structure
 - 31-50: Has some elements but missing key components
 - 51-70: Decent structure, needs refinement
 - 71-85: Strong argument with minor gaps
 - 86-100: Exceptional, well-structured argument (rare)
 
 TONE:
 - Be encouraging but honest
 - Use student-friendly language (middle school to college level)
 - Focus on thinking, not grammar
 - Be specific and actionable
 
 You MUST respond with this exact JSON structure:
 {
   "sentences": [
     {
       "text": "The exact sentence text",
       "category": "claim|reasoning|evidence|impact|filler",
       "explanation": "Brief explanation of why this was classified this way"
     }
   ],
   "healthSummary": {
     "analysisPercentage": <number 0-100>,
     "fillerPercentage": <number 0-100>,
     "missingComponents": ["Array of missing components"],
     "argumentStrengthScore": <number 0-100>,
     "breakdown": {
       "claims": <count>,
       "reasoning": <count>,
       "evidence": <count>,
       "impact": <count>,
       "filler": <count>
     }
   },
   "suggestions": [
     {
       "type": "add_warrant|add_evidence|add_impact|reduce_filler|clarify_claim|strengthen_reasoning",
       "text": "Specific, actionable suggestion in student-friendly language",
       "targetSentence": <optional index of sentence this applies to, or null>
     }
   ]
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
           { role: "user", content: `Analyze this argument:\n\n${text.trim()}` }
         ],
         temperature: 0.3,
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
         JSON.stringify({ error: "Failed to analyze argument" }),
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
 
     // Parse JSON from response (handle markdown code blocks)
     let analysis;
     try {
       const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
       const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
       analysis = JSON.parse(jsonStr);
     } catch (e) {
       console.error("Failed to parse AI response:", content);
       return new Response(
         JSON.stringify({ error: "Failed to parse analysis" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({ analysis }),
       { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("Argument autopsy error:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });