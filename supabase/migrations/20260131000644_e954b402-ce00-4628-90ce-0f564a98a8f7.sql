-- Add onboarding_completed and weight/height fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS height_cm numeric,
ADD COLUMN IF NOT EXISTS current_weight_kg numeric,
ADD COLUMN IF NOT EXISTS target_weight_kg numeric,
ADD COLUMN IF NOT EXISTS activity_level text;

-- Create biomarkers table for blood test results
CREATE TABLE IF NOT EXISTS public.biomarkers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Low', 'Normal', 'High')),
  min_range NUMERIC,
  max_range NUMERIC,
  optimal_min NUMERIC,
  optimal_max NUMERIC,
  insight TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on biomarkers
ALTER TABLE public.biomarkers ENABLE ROW LEVEL SECURITY;

-- RLS policies for biomarkers
CREATE POLICY "Users can view their own biomarkers" 
  ON public.biomarkers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own biomarkers" 
  ON public.biomarkers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own biomarkers" 
  ON public.biomarkers FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own biomarkers" 
  ON public.biomarkers FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for lab results
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lab-results', 'lab-results', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for lab-results bucket
CREATE POLICY "Users can upload their own lab results"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'lab-results' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own lab results"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lab-results' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own lab results"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'lab-results' AND auth.uid()::text = (storage.foldername(name))[1]);