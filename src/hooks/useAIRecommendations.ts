import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  notes?: string;
}

export interface PriorityConcern {
  biomarker: string;
  currentValue: string;
  status: string;
  clinicalMeaning: string;
  possibleCauses: string[];
  risks: string;
}

export interface TreatmentProtocol {
  target: string;
  lifestyle: string[];
  diet: string[];
  supplements: Supplement[];
  retestIn: string;
  redFlags: string[];
}

export interface EvolutionAssessment {
  improving: string[];
  declining: string[];
  analysis: string;
}

export interface ActionPlan {
  weeks1to2: string[];
  weeks3to4: string[];
  weeks5to8: string[];
  weeks9to12: string[];
}

export interface AIRecommendations {
  healthSummary: string;
  priorityConcerns: PriorityConcern[];
  treatmentProtocols: TreatmentProtocol[];
  positiveFindings: string[];
  evolutionAssessment: EvolutionAssessment;
  actionPlan: ActionPlan;
}

interface BiomarkerTrend {
  name: string;
  unit: string;
  optimalMin: number;
  optimalMax: number;
  latestStatus: string;
  data: { date: string; value: number }[];
}

// Generate a hash from biomarker data to detect changes
function generateBiomarkerHash(biomarkerTrends: BiomarkerTrend[]): string {
  const dataString = biomarkerTrends
    .map(t => `${t.name}:${t.data.map(d => `${d.date}:${d.value}`).join(",")}`)
    .sort()
    .join("|");
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

export function useAIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCache, setLoadingCache] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cachedHash, setCachedHash] = useState<string | null>(null);
  const { toast } = useToast();

  // Load cached recommendations on mount
  const loadCachedRecommendations = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setLoadingCache(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("ai_recommendations_cache")
        .select("recommendations, biomarker_hash, updated_at")
        .eq("user_id", session.session.user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error loading cached recommendations:", fetchError);
      } else if (data) {
        setRecommendations(data.recommendations as unknown as AIRecommendations);
        setCachedHash(data.biomarker_hash);
      }
    } catch (err) {
      console.error("Error loading cache:", err);
    } finally {
      setLoadingCache(false);
    }
  }, []);

  useEffect(() => {
    loadCachedRecommendations();
  }, [loadCachedRecommendations]);

  // Save recommendations to cache
  const saveToCache = useCallback(async (recs: AIRecommendations, hash: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const userId = session.session.user.id;

      // Check if cache exists
      const { data: existing } = await supabase
        .from("ai_recommendations_cache")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        // Update existing
        await supabase
          .from("ai_recommendations_cache")
          .update({
            recommendations: JSON.parse(JSON.stringify(recs)),
            biomarker_hash: hash,
          })
          .eq("user_id", userId);
      } else {
        // Insert new - bypass strict types
        const client = supabase as any;
        await client
          .from("ai_recommendations_cache")
          .insert({
            user_id: userId,
            recommendations: JSON.parse(JSON.stringify(recs)),
            biomarker_hash: hash,
          });
      }
    } catch (err) {
      console.error("Error saving cache:", err);
    }
  }, []);

  const fetchRecommendations = useCallback(async (
    biomarkerTrends: BiomarkerTrend[], 
    forceRefresh: boolean = false
  ) => {
    if (biomarkerTrends.length === 0) {
      setError("No biomarker data to analyze");
      return null;
    }

    // Check if data has changed
    const currentHash = generateBiomarkerHash(biomarkerTrends);
    
    // If we have cached recommendations and data hasn't changed, skip API call
    if (!forceRefresh && recommendations && cachedHash === currentHash) {
      console.log("Using cached AI recommendations (data unchanged)");
      return recommendations;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `https://fpykqpprbzqbvedwugap.supabase.co/functions/v1/ai-health-recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({ biomarkerTrends }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to get AI recommendations");
      }

      setRecommendations(result.recommendations);
      setCachedHash(currentHash);
      
      // Save to database cache
      await saveToCache(result.recommendations, currentHash);
      
      return result.recommendations;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate recommendations";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, recommendations, cachedHash, saveToCache]);

  // Clear cache (for data reset)
  const clearCache = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      await supabase
        .from("ai_recommendations_cache")
        .delete()
        .eq("user_id", session.session.user.id);

      setRecommendations(null);
      setCachedHash(null);
    } catch (err) {
      console.error("Error clearing cache:", err);
    }
  }, []);

  return {
    recommendations,
    loading,
    loadingCache,
    error,
    cachedHash,
    fetchRecommendations,
    clearCache,
  };
}
