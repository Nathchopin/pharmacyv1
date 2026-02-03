import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "Low" | "Normal" | "High";
  min_range: number | null;
  max_range: number | null;
  optimal_min: number | null;
  optimal_max: number | null;
  insight: string | null;
  recorded_at: string;
}

export function useBiomarkers(userId: string | null) {
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchBiomarkers = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("biomarkers")
      .select("*")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: false });

    if (error) {
      console.error("Error fetching biomarkers:", error);
    } else {
      setBiomarkers(data as Biomarker[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchBiomarkers();
  }, [fetchBiomarkers]);

  const uploadAndAnalyze = useCallback(async (file: File) => {
    if (!userId) return false;
    
    setUploading(true);

    try {
      // Upload to Supabase Storage
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("lab-results")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      toast({
        title: "File Uploaded",
        description: "Analyzing your lab results with AI...",
      });

      // Call the edge function to analyze
      const { data: session } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-blood`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session?.access_token}`,
          },
          body: JSON.stringify({ file_path: filePath }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze lab results");
      }

      toast({
        title: "Analysis Complete!",
        description: result.message,
      });

      // CRITICAL: Refresh biomarkers immediately after successful save
      await fetchBiomarkers();
      
      // Force a small delay to ensure DB has propagated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  }, [userId, fetchBiomarkers, toast]);

  return {
    biomarkers,
    loading,
    uploading,
    refetch: fetchBiomarkers,
    uploadAndAnalyze,
  };
}
