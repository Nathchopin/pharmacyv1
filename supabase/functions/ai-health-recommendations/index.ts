import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.32.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BiomarkerTrend {
  name: string;
  unit: string;
  optimalMin: number;
  optimalMax: number;
  latestStatus: string;
  data: { date: string; value: number }[];
}

const MEDICAL_ADVISOR_PROMPT = `You are an expert clinical consultant with specialization in preventive medicine, functional medicine, and lifestyle optimization. You have decades of experience interpreting lab results and providing evidence-based, actionable medical guidance.

CRITICAL: You are providing doctor-level advice. Be specific, practical, and evidence-based. Don't give vague platitudes like "eat healthy" - give concrete, actionable protocols.

Analyze the following biomarker data and provide:

1. **HEALTH SUMMARY**: A 2-3 sentence executive summary of overall health status based on these results. Be direct about what's good and what needs attention.

2. **PRIORITY CONCERNS**: Identify the 2-4 most important biomarkers that need attention, ranked by clinical urgency. For each:
   - What the abnormal value means physiologically
   - What could be causing it (differential diagnosis thinking)
   - What complications could arise if not addressed

3. **TREATMENT PROTOCOLS**: For each concern, provide specific interventions:
   - **Lifestyle modifications**: Specific exercises (type, frequency, duration), sleep protocols, stress management techniques
   - **Dietary interventions**: Specific foods to add/remove, meal timing, portion guidance. Include specific quantities (e.g., "2-3 servings of fatty fish weekly" not "eat more fish")
   - **Supplements to consider**: Specific compounds, dosages, timing, and forms (e.g., "Vitamin D3 2000-5000 IU daily with fatty meal" or "Magnesium glycinate 400mg at bedtime")
   - **When to retest**: Specific timeline for follow-up testing
   - **Red flags**: Symptoms that should prompt immediate medical attention

4. **POSITIVE FINDINGS**: Highlight what's going well and what the patient is doing right. This is important for motivation.

5. **EVOLUTION ASSESSMENT**: Based on the historical data points:
   - Are trends moving in the right direction?
   - What trajectory changes are most concerning?
   - What lifestyle factors might explain improvements or declines?

6. **90-DAY ACTION PLAN**: A prioritized, week-by-week outline of what to focus on first.

FORMAT YOUR RESPONSE AS JSON:
{
  "healthSummary": "string - 2-3 sentence executive summary",
  "priorityConcerns": [
    {
      "biomarker": "name",
      "currentValue": "value with unit",
      "status": "High/Low",
      "clinicalMeaning": "what this means physiologically",
      "possibleCauses": ["cause1", "cause2"],
      "risks": "what could happen if not addressed"
    }
  ],
  "treatmentProtocols": [
    {
      "target": "what we're addressing",
      "lifestyle": ["specific action 1", "specific action 2"],
      "diet": ["specific dietary change 1", "specific dietary change 2"],
      "supplements": [
        {
          "name": "supplement name",
          "dosage": "specific dose",
          "timing": "when to take",
          "notes": "additional info"
        }
      ],
      "retestIn": "timeframe",
      "redFlags": ["symptom to watch for"]
    }
  ],
  "positiveFindings": ["finding 1", "finding 2"],
  "evolutionAssessment": {
    "improving": ["biomarker trending better"],
    "declining": ["biomarker trending worse"],
    "analysis": "paragraph explaining the trends and what they suggest about the patient's current lifestyle"
  },
  "actionPlan": {
    "weeks1to2": ["priority action 1", "priority action 2"],
    "weeks3to4": ["action 1", "action 2"],
    "weeks5to8": ["action 1", "action 2"],
    "weeks9to12": ["action 1", "action 2"]
  }
}

IMPORTANT CLINICAL GUIDANCE:
- Reference ranges are population averages. Optimal ranges are different from "normal" ranges.
- Consider biomarker interactions (e.g., high glucose + high triglycerides suggests insulin resistance)
- Consider age, sex, and lifestyle context when relevant
- Be specific about supplement forms (e.g., magnesium glycinate vs oxide, vitamin D3 vs D2)
- Include evidence-based alternatives to medications where appropriate
- Acknowledge when something warrants physician consultation
- Never provide advice that could be dangerous without medical supervision`;

serve(async (req) => {
  const requestId = crypto.randomUUID();
  const url = new URL(req.url);
  console.log(`[ai-health-recommendations:${requestId}] ${req.method} ${url.pathname}`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        `[ai-health-recommendations:${requestId}] Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars`
      );
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.warn(`[ai-health-recommendations:${requestId}] Missing Authorization header`);
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!bearerMatch) {
      console.warn(
        `[ai-health-recommendations:${requestId}] Invalid Authorization header format (expected Bearer token)`
      );
      return new Response(JSON.stringify({ error: "Invalid authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = bearerMatch[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    let userId: string | null = null;

    // Preferred: signing-keys compatible validation
    try {
      const { data, error: claimsError } = await supabase.auth.getClaims(token);
      if (!claimsError && data?.claims?.sub) {
        userId = data.claims.sub;
      } else {
        console.error(
          `[ai-health-recommendations:${requestId}] JWT getClaims() failed`,
          claimsError
        );
      }
    } catch (e) {
      console.error(
        `[ai-health-recommendations:${requestId}] JWT getClaims() threw`,
        e
      );
    }

    // Fallback: getUser() (still validated server-side)
    if (!userId) {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (!userError && userData?.user?.id) {
          userId = userData.user.id;
        } else {
          console.error(
            `[ai-health-recommendations:${requestId}] JWT getUser() failed`,
            userError
          );
        }
      } catch (e) {
        console.error(
          `[ai-health-recommendations:${requestId}] JWT getUser() threw`,
          e
        );
      }
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized (token rejected)" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { biomarkerTrends } = await req.json() as { biomarkerTrends: BiomarkerTrend[] };

    if (!biomarkerTrends || biomarkerTrends.length === 0) {
      return new Response(JSON.stringify({ error: "No biomarker data provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format biomarker data for Claude
    const biomarkerSummary = biomarkerTrends.map(trend => {
      const latestValue = trend.data[trend.data.length - 1]?.value ?? 0;
      const previousValue = trend.data.length > 1 ? trend.data[trend.data.length - 2]?.value : null;
      const change = previousValue ? ((latestValue - previousValue) / previousValue * 100).toFixed(1) : null;
      
      return {
        name: trend.name,
        currentValue: latestValue,
        unit: trend.unit,
        status: trend.latestStatus,
        optimalRange: `${trend.optimalMin} - ${trend.optimalMax}`,
        isOptimal: latestValue >= trend.optimalMin && latestValue <= trend.optimalMax,
        historyPoints: trend.data.length,
        trend: change ? `${change}% from previous` : "first measurement",
        history: trend.data.slice(-5), // Last 5 data points
      };
    });

    // Calculate overall stats
    const optimalCount = biomarkerSummary.filter(b => b.isOptimal).length;
    const abnormalBiomarkers = biomarkerSummary.filter(b => !b.isOptimal);

    console.log("===========================================");
    console.log("AI HEALTH RECOMMENDATION REQUEST");
    console.log("User ID:", userId);
    console.log("Total biomarkers:", biomarkerTrends.length);
    console.log("Optimal:", optimalCount);
    console.log("Needs attention:", abnormalBiomarkers.length);
    console.log("===========================================");

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    const userPrompt = `Please analyze the following biomarker data and provide comprehensive, doctor-level recommendations:

PATIENT BIOMARKER DATA:
${JSON.stringify(biomarkerSummary, null, 2)}

SUMMARY STATS:
- Total biomarkers tracked: ${biomarkerTrends.length}
- Optimal range: ${optimalCount}
- Needs attention: ${abnormalBiomarkers.length}

Provide your analysis in the JSON format specified in your instructions.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: MEDICAL_ADVISOR_PROMPT,
    });

    console.log("Claude response received");

    // Extract the text content
    const textContent = message.content.find(c => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse the JSON response
    let recommendations;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleaned = textContent.text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }

      recommendations = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse Claude response:", e);
      console.error("Raw response:", textContent.text);
      
      // Return a structured error response
      return new Response(JSON.stringify({ 
        error: "Failed to parse AI recommendations",
        rawResponse: textContent.text.substring(0, 500)
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Successfully generated recommendations");

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-health-recommendations:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
