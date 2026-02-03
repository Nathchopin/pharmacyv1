import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  health_score: number | null;
  height_cm: number | null;
  current_weight_kg: number | null;
  target_weight_kg: number | null;
  activity_level: string | null;
  onboarding_completed: boolean | null;
}

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url, health_score, height_cm, current_weight_kg, target_weight_kg, activity_level, onboarding_completed")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateWeight = useCallback(async (newWeight: number) => {
    if (!userId) return false;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ current_weight_kg: newWeight })
        .eq("user_id", userId);

      if (profileError) throw profileError;

      // Calculate new health score based on weight
      if (profile?.height_cm) {
        const height = profile.height_cm / 100;
        const bmi = newWeight / (height * height);
        const idealBMI = 22;
        const bmiDeviation = Math.abs(bmi - idealBMI);
        const baseScore = Math.max(0, Math.min(100, 100 - (bmiDeviation * 3)));
        
        const activityBonus: Record<string, number> = {
          sedentary: 0,
          light: 3,
          moderate: 6,
          active: 10,
          athlete: 12,
        };
        
        const newScore = Math.round(Math.min(100, baseScore + (activityBonus[profile.activity_level || "sedentary"] || 0)));
        
        await supabase
          .from("profiles")
          .update({ health_score: newScore })
          .eq("user_id", userId);
      }

      // Log weight to health_data
      await supabase.from("health_data").insert({
        user_id: userId,
        data_type: "weight",
        value: { weight: newWeight },
        recorded_at: new Date().toISOString(),
      });

      // Refresh profile
      await fetchProfile();
      
      toast({
        title: "Weight Updated",
        description: `Your current weight is now ${newWeight} kg`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [userId, profile, fetchProfile, toast]);

  return {
    profile,
    loading,
    refetch: fetchProfile,
    updateWeight,
  };
}
