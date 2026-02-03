import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TreatmentCheckin {
  id: string;
  treatment_type: string;
  checked_in: boolean;
  checkin_date: string;
  notes: string | null;
  created_at: string;
}

export function useTreatmentCheckins(userId: string | null, treatmentType: string) {
  const [checkins, setCheckins] = useState<TreatmentCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  const fetchCheckins = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("treatment_checkins")
      .select("*")
      .eq("user_id", userId)
      .eq("treatment_type", treatmentType)
      .order("checkin_date", { ascending: false })
      .limit(90); // Last 90 days

    if (error) {
      console.error("Error fetching checkins:", error);
    } else {
      setCheckins(data as TreatmentCheckin[]);
      
      // Calculate streak
      let currentStreak = 0;
      const today = new Date().toISOString().split('T')[0];
      const sortedDates = data
        .filter(c => c.checked_in)
        .map(c => c.checkin_date)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);
        const expected = expectedDate.toISOString().split('T')[0];
        
        if (sortedDates[i] === expected) {
          currentStreak++;
        } else {
          break;
        }
      }
      setStreak(currentStreak);
    }
    setLoading(false);
  }, [userId, treatmentType]);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  const toggleCheckin = useCallback(async (date: string, checked: boolean) => {
    if (!userId) return false;

    try {
      if (checked) {
        // Insert or update
        const { error } = await supabase
          .from("treatment_checkins")
          .upsert({
            user_id: userId,
            treatment_type: treatmentType,
            checkin_date: date,
            checked_in: true,
          }, {
            onConflict: "user_id,treatment_type,checkin_date"
          });

        if (error) throw error;
      } else {
        // Update to unchecked
        const { error } = await supabase
          .from("treatment_checkins")
          .update({ checked_in: false })
          .eq("user_id", userId)
          .eq("treatment_type", treatmentType)
          .eq("checkin_date", date);

        if (error) throw error;
      }

      await fetchCheckins();
      
      toast({
        title: checked ? "Checked in!" : "Check-in removed",
        description: checked ? "Keep up the great work!" : "Check-in has been removed",
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
  }, [userId, treatmentType, fetchCheckins, toast]);

  return {
    checkins,
    loading,
    streak,
    refetch: fetchCheckins,
    toggleCheckin,
  };
}
