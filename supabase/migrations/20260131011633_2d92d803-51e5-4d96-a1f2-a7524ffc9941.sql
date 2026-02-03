-- Fix: Add authorization check to calculate_health_score RPC
-- This prevents users from calculating/updating other users' health scores

CREATE OR REPLACE FUNCTION public.calculate_health_score(p_user_id uuid)
RETURNS integer
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
  -- Authorization check: Only allow users to calculate their own score
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Cannot calculate score for other users';
  END IF;

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