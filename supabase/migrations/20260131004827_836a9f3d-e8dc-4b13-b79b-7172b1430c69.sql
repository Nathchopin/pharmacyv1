-- Drop existing triggers if they exist to avoid conflicts
DROP TRIGGER IF EXISTS recalc_health_score_biomarkers ON public.biomarkers;
DROP TRIGGER IF EXISTS recalc_health_score_checkins ON public.treatment_checkins;
DROP TRIGGER IF EXISTS recalc_health_score_health_data ON public.health_data;

-- Create triggers to automatically recalculate health score
-- Trigger on biomarkers table (blood test results)
CREATE TRIGGER recalc_health_score_biomarkers
AFTER INSERT OR UPDATE ON public.biomarkers
FOR EACH ROW
EXECUTE FUNCTION public.trigger_recalculate_health_score();

-- Trigger on treatment_checkins table (hair/weight adherence)
CREATE TRIGGER recalc_health_score_checkins
AFTER INSERT OR UPDATE ON public.treatment_checkins
FOR EACH ROW
EXECUTE FUNCTION public.trigger_recalculate_health_score();

-- Trigger on health_data table (weight logging)
CREATE TRIGGER recalc_health_score_health_data
AFTER INSERT OR UPDATE ON public.health_data
FOR EACH ROW
EXECUTE FUNCTION public.trigger_recalculate_health_score();