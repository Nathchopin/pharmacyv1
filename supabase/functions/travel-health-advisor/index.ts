import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TRAVEL_HEALTH_PROMPT = `You are an expert travel health advisor working at a UK pharmacy. You have extensive knowledge of:
- Required and recommended vaccinations for every country
- Malaria risk zones and prophylaxis recommendations
- Health risks specific to destinations
- Food and water safety advice
- Travel medicine best practices

CRITICAL INSTRUCTIONS:
1. The user may type destination names with typos, misspellings, or grammatical errors. You MUST understand their intent and provide accurate information.
2. Be flexible with country name variations (e.g., "USA", "United States", "America" are all the same)
3. Provide practical, actionable advice

FORMAT YOUR RESPONSE AS JSON:
{
  "destination": "Corrected/full country name",
  "riskLevel": "low" | "medium" | "high",
  "summary": "Brief 1-2 sentence overview of health considerations",
  "requiredVaccines": [
    {
      "name": "Vaccine name",
      "description": "Brief description of why needed",
      "timing": "When to get it before travel"
    }
  ],
  "recommendedVaccines": [
    {
      "name": "Vaccine name", 
      "description": "Brief description of why recommended",
      "timing": "When to get it before travel"
    }
  ],
  "malariaInfo": {
    "risk": true | false,
    "zones": "Description of risk zones if applicable",
    "prophylaxis": "Recommended medication if needed"
  },
  "healthAdvice": [
    "Specific health tip 1",
    "Specific health tip 2"
  ],
  "foodWaterSafety": {
    "tapWaterSafe": true | false,
    "tips": ["Tip 1", "Tip 2"]
  },
  "emergencyInfo": {
    "ukEmbassy": "Contact info if known",
    "localEmergency": "Emergency number"
  },
  "bestTimeToVisit": "Health-related travel timing advice",
  "travelBundle": {
    "essentialKit": ["Item 1", "Item 2"],
    "medications": ["Medication 1", "Medication 2"],
    "estimatedVaccineCost": "Approximate UK cost range"
  }
}

If you cannot determine the destination, return:
{
  "error": true,
  "message": "I couldn't identify that destination. Could you please provide more details or check the spelling?"
}`;

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[travel-health-advisor:${requestId}] ${req.method} received`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Authentication check - require valid user token
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    console.log(`[travel-health-advisor:${requestId}] Unauthorized - no auth header`);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
  
  if (claimsError || !claims?.claims?.sub) {
    // Fallback to getUser for compatibility
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.log(`[travel-health-advisor:${requestId}] Unauthorized - invalid token`);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log(`[travel-health-advisor:${requestId}] User authenticated via getUser: ${user.id}`);
  } else {
    console.log(`[travel-health-advisor:${requestId}] User authenticated via getClaims: ${claims.claims.sub}`);
  }

  try {
    const { destination } = await req.json();

    if (!destination || typeof destination !== "string" || destination.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Please provide a destination" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error(`[travel-health-advisor:${requestId}] LOVABLE_API_KEY not configured`);
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[travel-health-advisor:${requestId}] Querying for destination: ${destination}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: TRAVEL_HEALTH_PROMPT },
          { 
            role: "user", 
            content: `Provide comprehensive travel health advice for: "${destination}". Remember to handle any typos or spelling errors in the destination name.` 
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error(`[travel-health-advisor:${requestId}] AI gateway error:`, response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get travel advice" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const aiContent = result.choices?.[0]?.message?.content;

    if (!aiContent) {
      console.error(`[travel-health-advisor:${requestId}] No content in AI response`);
      return new Response(JSON.stringify({ error: "Failed to generate travel advice" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the JSON response
    let travelAdvice;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleaned = aiContent
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      // Check if response is an array (multiple destinations) or single object
      const isArray = cleaned.trimStart().startsWith("[");
      
      if (isArray) {
        // Handle array - find matching brackets
        const jsonStart = cleaned.indexOf("[");
        const jsonEnd = cleaned.lastIndexOf("]");
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
        }
        const parsed = JSON.parse(cleaned);
        // Take the first destination if multiple are returned
        travelAdvice = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
      } else {
        // Handle single object
        const jsonStart = cleaned.indexOf("{");
        const jsonEnd = cleaned.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
        }
        travelAdvice = JSON.parse(cleaned);
      }
    } catch (e) {
      console.error(`[travel-health-advisor:${requestId}] Failed to parse AI response:`, e);
      console.error("Raw response:", aiContent);
      return new Response(JSON.stringify({ 
        error: "Failed to parse travel advice",
        rawResponse: aiContent.substring(0, 500)
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[travel-health-advisor:${requestId}] Successfully generated advice for: ${travelAdvice.destination || destination}`);

    return new Response(JSON.stringify({ advice: travelAdvice }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(`[travel-health-advisor:${requestId}] Error:`, error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
