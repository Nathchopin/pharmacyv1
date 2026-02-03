import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useHealthScore(userId: string | null) {
  const [score, setScore] = useState<number>(75);
  const [loading, setLoading] = useState(true);

  const fetchScore = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("health_score")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching health score:", error);
    } else if (data) {
      setScore(data.health_score || 75);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchScore();

    if (!userId) return;

    // Subscribe to realtime updates on profiles table
    const channel = supabase
      .channel('health-score-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'health_score' in payload.new) {
            setScore((payload.new as { health_score: number }).health_score || 75);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchScore]);

  // Function to manually recalculate (calls the DB function)
  const recalculate = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase.rpc('calculate_health_score', { 
      p_user_id: userId 
    });

    if (error) {
      console.error("Error recalculating health score:", error);
    } else {
      setScore(data || 75);
    }
  }, [userId]);

  return {
    score,
    loading,
    refetch: fetchScore,
    recalculate,
  };
}
