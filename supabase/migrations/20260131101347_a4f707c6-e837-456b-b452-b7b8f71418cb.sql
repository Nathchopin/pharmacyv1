-- Create table to cache AI health recommendations
CREATE TABLE public.ai_recommendations_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendations JSONB NOT NULL,
  biomarker_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint on user_id (one cache per user)
CREATE UNIQUE INDEX idx_ai_recommendations_cache_user ON public.ai_recommendations_cache(user_id);

-- Enable Row Level Security
ALTER TABLE public.ai_recommendations_cache ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own cached recommendations"
ON public.ai_recommendations_cache
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cached recommendations"
ON public.ai_recommendations_cache
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cached recommendations"
ON public.ai_recommendations_cache
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cached recommendations"
ON public.ai_recommendations_cache
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_ai_recommendations_cache_updated_at
BEFORE UPDATE ON public.ai_recommendations_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();