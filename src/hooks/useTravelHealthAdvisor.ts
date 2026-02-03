import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface VaccineInfo {
  name: string;
  description: string;
  timing: string;
}

export interface MalariaInfo {
  risk: boolean;
  zones: string;
  prophylaxis: string;
}

export interface FoodWaterSafety {
  tapWaterSafe: boolean;
  tips: string[];
}

export interface EmergencyInfo {
  ukEmbassy: string;
  localEmergency: string;
}

export interface TravelBundle {
  essentialKit: string[];
  medications: string[];
  estimatedVaccineCost: string;
}

export interface TravelHealthAdvice {
  destination: string;
  riskLevel: "low" | "medium" | "high";
  summary: string;
  requiredVaccines: VaccineInfo[];
  recommendedVaccines: VaccineInfo[];
  malariaInfo: MalariaInfo;
  healthAdvice: string[];
  foodWaterSafety: FoodWaterSafety;
  emergencyInfo: EmergencyInfo;
  bestTimeToVisit: string;
  travelBundle: TravelBundle;
  error?: boolean;
  message?: string;
}

export function useTravelHealthAdvisor() {
  const [advice, setAdvice] = useState<TravelHealthAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAdvice = useCallback(async (destination: string) => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return null;
    }

    setLoading(true);
    setError(null);
    setAdvice(null);

    try {
      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setError("Please log in to use the travel health advisor");
        toast({
          title: "Authentication Required",
          description: "Please log in to access travel health advice",
          variant: "destructive",
        });
        return null;
      }

      const response = await fetch(
        `https://fpykqpprbzqbvedwugap.supabase.co/functions/v1/travel-health-advisor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ destination }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to get travel advice");
      }

      if (result.advice?.error) {
        setError(result.advice.message || "Could not identify destination");
        return null;
      }

      setAdvice(result.advice);
      return result.advice;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get travel advice";
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
  }, [toast]);

  const clearAdvice = useCallback(() => {
    setAdvice(null);
    setError(null);
  }, []);

  return {
    advice,
    loading,
    error,
    fetchAdvice,
    clearAdvice,
  };
}
