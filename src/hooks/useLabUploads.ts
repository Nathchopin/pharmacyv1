import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LabUpload {
  id: string;
  file_name: string;
  file_path: string;
  test_date: string;
  biomarker_count: number;
  created_at: string;
}

export function useLabUploads(userId: string | null) {
  const [uploads, setUploads] = useState<LabUpload[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUploads = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("lab_uploads")
      .select("*")
      .eq("user_id", userId)
      .order("test_date", { ascending: false });

    if (error) {
      console.error("Error fetching lab uploads:", error);
    } else {
      setUploads(data as LabUpload[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  return {
    uploads,
    loading,
    refetch: fetchUploads,
  };
}
