import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WeightEntry {
  date: string;
  actual: number | null;
  projected: number | null;
}

export function useWeightHistory(userId: string | null, startWeight: number, targetWeight: number) {
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWeightHistory = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("health_data")
      .select("value, recorded_at")
      .eq("user_id", userId)
      .eq("data_type", "weight")
      .order("recorded_at", { ascending: true });

    if (error) {
      console.error("Error fetching weight history:", error);
      setLoading(false);
      return;
    }

    // Generate 12 weeks of data
    const weeks: WeightEntry[] = [];
    const weightLossPerWeek = (startWeight - targetWeight) / 12;
    
    for (let i = 1; i <= 12; i++) {
      const projectedWeight = startWeight - (weightLossPerWeek * i);
      
      // Find actual weight for this week
      const weekData = data?.find((entry, index) => {
        // Match by week number based on order
        return index === i - 1;
      });

      const valueObj = weekData?.value as { weight?: number } | undefined;
      
      weeks.push({
        date: `Week ${i}`,
        actual: valueObj?.weight || null,
        projected: parseFloat(projectedWeight.toFixed(1)),
      });
    }

    setWeightData(weeks);
    setLoading(false);
  }, [userId, startWeight, targetWeight]);

  useEffect(() => {
    fetchWeightHistory();
  }, [fetchWeightHistory]);

  return {
    weightData,
    loading,
    refetch: fetchWeightHistory,
  };
}
