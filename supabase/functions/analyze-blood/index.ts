import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.32.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================
// CANONICAL SCHEMA - Standard Units & Names
// ============================================
const STANDARD_UNITS: Record<string, string> = {
  // Lipid Panel
  "Total Cholesterol": "mmol/L",
  "HDL Cholesterol": "mmol/L",
  "LDL Cholesterol": "mmol/L",
  "Triglycerides": "mmol/L",
  // Hormones
  "Testosterone": "nmol/L",
  "Free Testosterone": "pmol/L",
  "Estradiol": "pmol/L",
  "TSH": "mIU/L",
  "Free T4": "pmol/L",
  "Free T3": "pmol/L",
  // Vitamins & Minerals
  "Vitamin D": "nmol/L",
  "Vitamin B12": "pmol/L",
  "Folate": "nmol/L",
  "Ferritin": "µg/L",
  "Iron": "µmol/L",
  // Glucose & Diabetes
  "Glucose": "mmol/L",
  "HbA1c": "%",
  // Kidney Function
  "Creatinine": "µmol/L",
  "eGFR": "mL/min/1.73m²",
  "Urea": "mmol/L",
  "BUN": "mmol/L",
  // Liver Function
  "ALT": "U/L",
  "AST": "U/L",
  "GGT": "U/L",
  "ALP": "U/L",
  "Bilirubin": "µmol/L",
  "Albumin": "g/L",
  // Blood Count
  "Hemoglobin": "g/L",
  "Hematocrit": "L/L",
  "RBC": "x10¹²/L",
  "WBC": "x10⁹/L",
  "Platelets": "x10⁹/L",
  "MCV": "fL",
  "MCH": "pg",
  "MCHC": "g/L",
  // Electrolytes
  "Sodium": "mmol/L",
  "Potassium": "mmol/L",
  "Chloride": "mmol/L",
  "Calcium": "mmol/L",
  "Magnesium": "mmol/L",
  // Inflammation
  "CRP": "mg/L",
  "ESR": "mm/hr",
  // Proteins
  "Total Protein": "g/L",
  "Globulin": "g/L",
};

// Name standardization mapping
const NAME_ALIASES: Record<string, string> = {
  // Hemoglobin variations
  "hgb": "Hemoglobin",
  "haemoglobin": "Hemoglobin",
  "hb": "Hemoglobin",
  // HbA1c variations
  "hemoglobin a1c": "HbA1c",
  "haemoglobin a1c": "HbA1c",
  "glycated hemoglobin": "HbA1c",
  "glycosylated hemoglobin": "HbA1c",
  "a1c": "HbA1c",
  // Cholesterol variations
  "total cholesterol": "Total Cholesterol",
  "fasting cholesterol": "Total Cholesterol",
  "cholesterol": "Total Cholesterol",
  "hdl": "HDL Cholesterol",
  "hdl-c": "HDL Cholesterol",
  "ldl": "LDL Cholesterol",
  "ldl-c": "LDL Cholesterol",
  // Liver enzymes
  "alt (sgpt)": "ALT",
  "sgpt": "ALT",
  "alanine aminotransferase": "ALT",
  "ast (sgot)": "AST",
  "sgot": "AST",
  "aspartate aminotransferase": "AST",
  "alkaline phosphatase": "ALP",
  "gamma gt": "GGT",
  "gamma-glutamyl transferase": "GGT",
  // Kidney
  "blood urea nitrogen": "BUN",
  "egfr if nonaffrican am": "eGFR",
  "egfr if african am": "eGFR",
  "estimated gfr": "eGFR",
  "glomerular filtration rate": "eGFR",
  // Blood count
  "red blood cell count": "RBC",
  "red cell count": "RBC",
  "white blood cell count": "WBC",
  "white cell count": "WBC",
  "platelet count": "Platelets",
  "hct": "Hematocrit",
  "haematocrit": "Hematocrit",
  // Vitamins
  "vitamin d": "Vitamin D",
  "25-oh vitamin d": "Vitamin D",
  "vitamin d3": "Vitamin D",
  "vitamin b12": "Vitamin B12",
  "cobalamin": "Vitamin B12",
  // Thyroid
  "thyroid stimulating hormone": "TSH",
  "thyroxine": "Free T4",
  "t4": "Free T4",
  "t3": "Free T3",
  "triiodothyronine": "Free T3",
  // Iron
  "serum iron": "Iron",
  "serum ferritin": "Ferritin",
  "tibc": "TIBC",
  "t.i.b.c": "TIBC",
  "transferrin saturation": "Transferrin Saturation",
  // Proteins
  "total protein": "Total Protein",
  "protein, total": "Total Protein",
  "globulin, total": "Globulin",
  "bilirubin, total": "Bilirubin",
  "carbon dioxide, total": "Bicarbonate",
  // Ratios
  "a/g ratio": "A/G Ratio",
  "bun/creatinine ratio": "BUN/Creatinine Ratio",
  "hdl % of total": "HDL Ratio",
};

// Unit conversion factors (from -> to standard)
const UNIT_CONVERSIONS: Record<string, { factor: number; targetUnit: string }> = {
  // Cholesterol: mg/dL -> mmol/L (divide by 38.67)
  "cholesterol_mg/dl": { factor: 0.02586, targetUnit: "mmol/L" },
  // Triglycerides: mg/dL -> mmol/L (divide by 88.57)
  "triglycerides_mg/dl": { factor: 0.01129, targetUnit: "mmol/L" },
  // Glucose: mg/dL -> mmol/L (divide by 18.02)
  "glucose_mg/dl": { factor: 0.0555, targetUnit: "mmol/L" },
  // Testosterone: ng/dL -> nmol/L (multiply by 0.0347)
  "testosterone_ng/dl": { factor: 0.0347, targetUnit: "nmol/L" },
  // Vitamin D: ng/mL -> nmol/L (multiply by 2.496)
  "vitamind_ng/ml": { factor: 2.496, targetUnit: "nmol/L" },
  // Creatinine: mg/dL -> µmol/L (multiply by 88.4)
  "creatinine_mg/dl": { factor: 88.4, targetUnit: "µmol/L" },
  // Hemoglobin: g/dL -> g/L (multiply by 10)
  "hemoglobin_g/dl": { factor: 10, targetUnit: "g/L" },
  // Bilirubin: mg/dL -> µmol/L (multiply by 17.1)
  "bilirubin_mg/dl": { factor: 17.1, targetUnit: "µmol/L" },
  // Calcium: mg/dL -> mmol/L (divide by 4.0)
  "calcium_mg/dl": { factor: 0.25, targetUnit: "mmol/L" },
  // Iron: µg/dL -> µmol/L (divide by 5.587)
  "iron_ug/dl": { factor: 0.179, targetUnit: "µmol/L" },
  // B12: pg/mL -> pmol/L (multiply by 0.738)
  "b12_pg/ml": { factor: 0.738, targetUnit: "pmol/L" },
  // Folate: ng/mL -> nmol/L (multiply by 2.266)
  "folate_ng/ml": { factor: 2.266, targetUnit: "nmol/L" },
  // Albumin: g/dL -> g/L (multiply by 10)
  "albumin_g/dl": { factor: 10, targetUnit: "g/L" },
  // Total Protein: g/dL -> g/L (multiply by 10)
  "protein_g/dl": { factor: 10, targetUnit: "g/L" },
  // Urea/BUN: mg/dL -> mmol/L (divide by 2.8)
  "urea_mg/dl": { factor: 0.357, targetUnit: "mmol/L" },
};

interface RawBiomarker {
  name: string;
  value: number;
  unit: string;
  status: "Low" | "Normal" | "High";
  insight: string;
  min_range?: number;
  max_range?: number;
  optimal_min?: number;
  optimal_max?: number;
}

interface NormalizedBiomarker extends RawBiomarker {
  original_value?: number;
  original_unit?: string;
}

// Standardize biomarker name
function standardizeName(name: string): string {
  const lowerName = name.toLowerCase().trim();
  return NAME_ALIASES[lowerName] || name;
}

// Convert value to standard unit if needed
function convertToStandardUnit(
  name: string,
  value: number,
  unit: string
): { value: number; unit: string; converted: boolean } {
  const lowerUnit = unit.toLowerCase().replace(/\s/g, "");
  const standardName = standardizeName(name);
  
  // Check if already in standard unit
  const expectedUnit = STANDARD_UNITS[standardName];
  if (expectedUnit && unit.toLowerCase().includes(expectedUnit.toLowerCase().substring(0, 3))) {
    return { value, unit: expectedUnit, converted: false };
  }

  // Build conversion key
  let conversionKey = "";
  
  // Cholesterol conversions
  if (standardName.includes("Cholesterol") || standardName === "Triglycerides") {
    if (lowerUnit.includes("mg")) {
      conversionKey = "cholesterol_mg/dl";
    }
  }
  // Glucose conversion
  else if (standardName === "Glucose" && lowerUnit.includes("mg")) {
    conversionKey = "glucose_mg/dl";
  }
  // Testosterone conversion
  else if (standardName.includes("Testosterone") && lowerUnit.includes("ng")) {
    conversionKey = "testosterone_ng/dl";
  }
  // Vitamin D conversion
  else if (standardName === "Vitamin D" && lowerUnit.includes("ng")) {
    conversionKey = "vitamind_ng/ml";
  }
  // Creatinine conversion
  else if (standardName === "Creatinine" && lowerUnit.includes("mg")) {
    conversionKey = "creatinine_mg/dl";
  }
  // Hemoglobin conversion
  else if (standardName === "Hemoglobin" && lowerUnit === "g/dl") {
    conversionKey = "hemoglobin_g/dl";
  }
  // Bilirubin conversion
  else if (standardName === "Bilirubin" && lowerUnit.includes("mg")) {
    conversionKey = "bilirubin_mg/dl";
  }
  // Calcium conversion
  else if (standardName === "Calcium" && lowerUnit.includes("mg")) {
    conversionKey = "calcium_mg/dl";
  }
  // Albumin/Protein conversion
  else if ((standardName === "Albumin" || standardName === "Total Protein" || standardName === "Globulin") && lowerUnit === "g/dl") {
    conversionKey = "albumin_g/dl";
  }
  // BUN/Urea conversion
  else if ((standardName === "BUN" || standardName === "Urea") && lowerUnit.includes("mg")) {
    conversionKey = "urea_mg/dl";
  }
  // B12 conversion
  else if (standardName === "Vitamin B12" && lowerUnit.includes("pg")) {
    conversionKey = "b12_pg/ml";
  }

  // Apply conversion if found
  if (conversionKey && UNIT_CONVERSIONS[conversionKey]) {
    const conv = UNIT_CONVERSIONS[conversionKey];
    return {
      value: Math.round(value * conv.factor * 100) / 100,
      unit: conv.targetUnit,
      converted: true,
    };
  }

  // Return original if no conversion needed/found
  return { value, unit: expectedUnit || unit, converted: false };
}

// Robust JSON extraction that handles markdown and truncation
function extractJsonFromResponse(response: string): { biomarkers: RawBiomarker[] } {
  let cleaned = response
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");

  if (jsonStart === -1) {
    throw new Error("No JSON object found in response");
  }

  if (jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  } else {
    cleaned = cleaned.substring(jsonStart);
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to salvage truncated array
    const biomarkersMatch = cleaned.match(/"biomarkers"\s*:\s*\[/);
    if (biomarkersMatch) {
      const arrayStart = cleaned.indexOf("[", biomarkersMatch.index);
      let bracketCount = 0;
      let lastCompleteObject = -1;
      
      for (let i = arrayStart; i < cleaned.length; i++) {
        if (cleaned[i] === "{") bracketCount++;
        if (cleaned[i] === "}") {
          bracketCount--;
          if (bracketCount === 0) {
            lastCompleteObject = i;
          }
        }
      }
      
      if (lastCompleteObject > arrayStart) {
        const salvaged = cleaned.substring(0, lastCompleteObject + 1) + "]}";
        try {
          const result = JSON.parse(salvaged);
          console.log(`Salvaged ${result.biomarkers?.length || 0} biomarkers from truncated response`);
          return result;
        } catch {
          // Fall through to error
        }
      }
    }
    
    cleaned = cleaned
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[\x00-\x1F\x7F]/g, "");
    
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      throw new Error(`Failed to parse JSON: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }
}

// The Medical Data Normalizer prompt
const NORMALIZER_PROMPT = `You are a Medical Data Normalizer. Extract ALL biomarkers from this lab report document.

CRITICAL REQUIREMENTS:
1. Extract EVERY biomarker visible in the document
2. Use STANDARDIZED names (see mappings below)
3. Convert ALL values to STANDARD UNITS using these conversions:

STANDARD UNITS & CONVERSIONS:
- Cholesterol (Total, HDL, LDL): mmol/L (if mg/dL: divide by 38.67)
- Triglycerides: mmol/L (if mg/dL: divide by 88.57)
- Glucose: mmol/L (if mg/dL: divide by 18.02)
- HbA1c: % (percentage)
- Testosterone: nmol/L (if ng/dL: multiply by 0.0347)
- Vitamin D: nmol/L (if ng/mL: multiply by 2.496)
- Vitamin B12: pmol/L (if pg/mL: multiply by 0.738)
- Creatinine: µmol/L (if mg/dL: multiply by 88.4)
- Hemoglobin: g/L (if g/dL: multiply by 10)
- Bilirubin: µmol/L (if mg/dL: multiply by 17.1)
- Calcium: mmol/L (if mg/dL: divide by 4.0)
- BUN/Urea: mmol/L (if mg/dL: divide by 2.8)
- Albumin/Proteins: g/L (if g/dL: multiply by 10)
- Iron: µmol/L
- Sodium/Potassium/Chloride: mmol/L
- Liver enzymes (ALT, AST, GGT, ALP): U/L
- WBC: x10⁹/L
- RBC: x10¹²/L
- Platelets: x10⁹/L
- eGFR: mL/min/1.73m²
- ESR: mm/hr
- CRP: mg/L

NAME STANDARDIZATION:
- "Hgb", "Haemoglobin", "Hb" → "Hemoglobin"
- "HbA1c", "A1C", "Glycated Hemoglobin" → "HbA1c"
- "Total Cholesterol", "Fasting Cholesterol" → "Total Cholesterol"
- "ALT (SGPT)", "SGPT" → "ALT"
- "AST (SGOT)", "SGOT" → "AST"
- "Blood Urea Nitrogen" → "BUN"
- "eGFR Non-African American", "eGFR African American" → "eGFR"
- "Red Cell Count" → "RBC"
- "White Cell Count" → "WBC"
- "Platelet Count" → "Platelets"

Return ONLY this JSON structure with NO markdown or explanation:
{
  "biomarkers": [
    {
      "name": "Standard Name",
      "value": number (AFTER conversion to standard unit),
      "unit": "Standard Unit",
      "status": "Low" | "Normal" | "High",
      "insight": "Brief clinical insight about this result",
      "min_range": number (reference range minimum in standard unit),
      "max_range": number (reference range maximum in standard unit),
      "optimal_min": number (optimal range minimum, if available),
      "optimal_max": number (optimal range maximum, if available)
    }
  ]
}

If you cannot identify clear biomarker data, return: {"biomarkers": []}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { file_path } = await req.json();

    if (!file_path) {
      return new Response(JSON.stringify({ error: "file_path is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Security: Validate file_path starts with user's folder to prevent path traversal
    const userId = user.id;
    if (!file_path.startsWith(`${userId}/`)) {
      console.warn(`Path traversal attempt blocked: user ${userId} tried to access ${file_path}`);
      return new Response(JSON.stringify({ error: "Invalid file path" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("lab-results")
      .download(file_path);

    if (downloadError) {
      console.error("Download error:", downloadError);
      return new Response(JSON.stringify({ error: "Failed to download file" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert file to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = base64Encode(arrayBuffer);
    const mimeType = fileData.type || "image/png";
    
    let claudeMediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" = "image/png";
    if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
      claudeMediaType = "image/jpeg";
    } else if (mimeType.includes("gif")) {
      claudeMediaType = "image/gif";
    } else if (mimeType.includes("webp")) {
      claudeMediaType = "image/webp";
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fileName = file_path.split('/').pop() || 'unknown';
    console.log("===========================================");
    console.log("ANALYZING LAB REPORT:", fileName);
    console.log("File size:", arrayBuffer.byteLength, "bytes");
    console.log("User ID:", user.id);
    console.log("===========================================");

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    // Call Claude with the Medical Data Normalizer prompt
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: claudeMediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: NORMALIZER_PROMPT,
            },
          ],
        },
      ],
    });

    console.log("Claude response received, tokens used:", message.usage);

    const textContent = message.content.find(block => block.type === 'text');
    const content = textContent?.type === 'text' ? textContent.text : null;

    if (!content) {
      console.error("No text content in Claude response");
      return new Response(JSON.stringify({ error: "No response from AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Raw Claude response (first 500 chars):", content.substring(0, 500));

    // Parse the JSON response
    let parsedBiomarkers: { biomarkers: RawBiomarker[] };
    try {
      parsedBiomarkers = extractJsonFromResponse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Parsed biomarkers count:", parsedBiomarkers.biomarkers?.length || 0);

    if (!parsedBiomarkers.biomarkers || parsedBiomarkers.biomarkers.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        biomarkers: [],
        message: "No biomarkers detected in the uploaded image. Please upload a clear lab result document."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // NORMALIZE all biomarkers
    const testDate = new Date().toISOString().split('T')[0];
    const normalizedBiomarkers: NormalizedBiomarker[] = parsedBiomarkers.biomarkers.map((b: RawBiomarker) => {
      // Standardize name
      const standardName = standardizeName(b.name);
      
      // Convert unit if needed (double-check Claude's work)
      const { value: convertedValue, unit: standardUnit, converted } = convertToStandardUnit(
        standardName,
        b.value,
        b.unit
      );

      if (converted) {
        console.log(`Converted ${b.name}: ${b.value} ${b.unit} → ${convertedValue} ${standardUnit}`);
      }

      return {
        name: standardName,
        value: convertedValue,
        unit: standardUnit || "N/A",
        status: b.status,
        insight: b.insight,
        min_range: b.min_range,
        max_range: b.max_range,
        optimal_min: b.optimal_min,
        optimal_max: b.optimal_max,
        original_value: converted ? b.value : undefined,
        original_unit: converted ? b.unit : undefined,
      };
    });

    // Prepare data for insertion (exclude tracking fields)
    const biomarkersToInsert = normalizedBiomarkers.map(b => ({
      user_id: user.id,
      name: b.name,
      value: b.value,
      unit: b.unit,
      status: b.status,
      insight: b.insight,
      min_range: b.min_range,
      max_range: b.max_range,
      optimal_min: b.optimal_min,
      optimal_max: b.optimal_max,
      recorded_at: new Date().toISOString(),
      test_date: testDate,
    }));

    // CRITICAL: Await the database insert
    const { data: insertedData, error: insertError } = await supabase
      .from("biomarkers")
      .insert(biomarkersToInsert)
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save biomarkers to database" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Successfully saved", insertedData.length, "normalized biomarkers");

    // Track the upload in lab_uploads table
    const { error: uploadTrackError } = await supabase.from("lab_uploads").insert({
      user_id: user.id,
      file_name: fileName,
      file_path: file_path,
      test_date: testDate,
      biomarker_count: insertedData.length,
    });

    if (uploadTrackError) {
      console.warn("Failed to track upload:", uploadTrackError);
    }

    // CRITICAL: Await health score recalculation
    const { data: healthScore, error: healthError } = await supabase.rpc('calculate_health_score', { 
      p_user_id: user.id 
    });

    if (healthError) {
      console.warn("Health score calculation error:", healthError);
    } else {
      console.log("Updated health score:", healthScore);
    }

    console.log("===========================================");
    console.log("ANALYSIS COMPLETE for user", user.id);
    console.log("Saved:", insertedData.length, "biomarkers");
    console.log("New health score:", healthScore);
    console.log("===========================================");

    return new Response(JSON.stringify({ 
      success: true, 
      biomarkers: insertedData,
      healthScore: healthScore,
      message: `Analyzed and saved ${insertedData.length} biomarkers with standardized units`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
