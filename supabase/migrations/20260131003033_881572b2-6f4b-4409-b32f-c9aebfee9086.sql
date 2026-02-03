-- Add test_date to biomarkers for timeline tracking
ALTER TABLE public.biomarkers 
ADD COLUMN IF NOT EXISTS test_date date DEFAULT CURRENT_DATE;

-- Create treatment_checkins table for hair pill tracking
CREATE TABLE public.treatment_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  treatment_type TEXT NOT NULL, -- 'hair', 'weight', etc.
  checked_in BOOLEAN NOT NULL DEFAULT true,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, treatment_type, checkin_date)
);

-- Enable RLS
ALTER TABLE public.treatment_checkins ENABLE ROW LEVEL SECURITY;

-- RLS policies for treatment_checkins
CREATE POLICY "Users can view their own checkins"
ON public.treatment_checkins FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkins"
ON public.treatment_checkins FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkins"
ON public.treatment_checkins FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checkins"
ON public.treatment_checkins FOR DELETE
USING (auth.uid() = user_id);

-- Create lab_uploads table to track upload history
CREATE TABLE public.lab_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  biomarker_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lab_uploads ENABLE ROW LEVEL SECURITY;

-- RLS policies for lab_uploads
CREATE POLICY "Users can view their own uploads"
ON public.lab_uploads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads"
ON public.lab_uploads FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create the calculate_health_score function
CREATE OR REPLACE FUNCTION public.calculate_health_score(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score INTEGER := 100;
  v_height NUMERIC;
  v_weight NUMERIC;
  v_bmi NUMERIC;
  v_high_risk_count INTEGER;
  v_streak_days INTEGER;
BEGIN
  -- Get user's height and weight
  SELECT height_cm, current_weight_kg INTO v_height, v_weight
  FROM profiles WHERE user_id = p_user_id;
  
  -- BMI Penalty: If BMI > 25, subtract (BMI - 25) * 2
  IF v_height IS NOT NULL AND v_weight IS NOT NULL AND v_height > 0 THEN
    v_bmi := v_weight / ((v_height / 100) * (v_height / 100));
    IF v_bmi > 25 THEN
      v_score := v_score - LEAST(30, ROUND((v_bmi - 25) * 2)::INTEGER);
    END IF;
  END IF;
  
  -- Blood Penalty: For every "High" status biomarker in latest test, subtract 5 points
  SELECT COUNT(*) INTO v_high_risk_count
  FROM biomarkers
  WHERE user_id = p_user_id
    AND status = 'High'
    AND recorded_at = (SELECT MAX(recorded_at) FROM biomarkers WHERE user_id = p_user_id);
  
  v_score := v_score - LEAST(25, v_high_risk_count * 5);
  
  -- Consistency Bonus: If hair treatment streak > 7 days, add 5 points
  SELECT COUNT(*) INTO v_streak_days
  FROM (
    SELECT checkin_date
    FROM treatment_checkins
    WHERE user_id = p_user_id
      AND treatment_type = 'hair'
      AND checked_in = true
      AND checkin_date >= CURRENT_DATE - INTERVAL '7 days'
  ) streak;
  
  IF v_streak_days >= 7 THEN
    v_score := v_score + 5;
  END IF;
  
  -- Ensure score is between 0 and 100
  v_score := GREATEST(0, LEAST(100, v_score));
  
  -- Update the profile with new score
  UPDATE profiles SET health_score = v_score WHERE user_id = p_user_id;
  
  RETURN v_score;
END;
$$;

-- Create trigger function to recalculate score
CREATE OR REPLACE FUNCTION public.trigger_recalculate_health_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM calculate_health_score(NEW.user_id);
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER recalc_score_on_biomarker
AFTER INSERT OR UPDATE ON public.biomarkers
FOR EACH ROW
EXECUTE FUNCTION trigger_recalculate_health_score();

CREATE TRIGGER recalc_score_on_checkin
AFTER INSERT OR UPDATE ON public.treatment_checkins
FOR EACH ROW
EXECUTE FUNCTION trigger_recalculate_health_score();

CREATE TRIGGER recalc_score_on_health_data
AFTER INSERT OR UPDATE ON public.health_data
FOR EACH ROW
EXECUTE FUNCTION trigger_recalculate_health_score();