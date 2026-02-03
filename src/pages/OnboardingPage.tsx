import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OnboardingWizard, OnboardingData } from "@/components/onboarding/OnboardingWizard";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      
      // Check if already onboarded
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (profile?.onboarding_completed) {
        navigate("/dashboard");
        return;
      }
      
      setCheckingAuth(false);
    };
    
    checkSession();
  }, [navigate]);

  const calculateHealthScore = (data: OnboardingData): number => {
    const height = parseFloat(data.height_cm) / 100; // convert to meters
    const weight = parseFloat(data.current_weight_kg);
    
    if (!height || !weight) return 75;
    
    let score = 100;
    
    // BMI factor (max -30 points)
    const bmi = weight / (height * height);
    const idealBMI = 22;
    const bmiDeviation = Math.abs(bmi - idealBMI);
    score -= Math.min(30, bmiDeviation * 3);
    
    // Activity level bonus (0-12 points)
    const activityBonus: Record<string, number> = {
      sedentary: 0,
      light: 3,
      moderate: 6,
      active: 10,
      athlete: 12,
    };
    score += activityBonus[data.activity_level] || 0;
    
    // Sleep quality factor (-10 to +5 points)
    const sleepFactor: Record<string, number> = {
      poor: -10,
      fair: -3,
      good: 2,
      excellent: 5,
    };
    score += sleepFactor[data.sleep_quality] || 0;
    
    // Stress level factor (-15 to 0 points)
    const stressFactor: Record<string, number> = {
      low: 0,
      moderate: -3,
      high: -8,
      very_high: -15,
    };
    score += stressFactor[data.stress_level] || 0;
    
    // Smoking factor (-20 to 0 points)
    const smokingFactor: Record<string, number> = {
      never: 0,
      former: -5,
      occasional: -12,
      regular: -20,
    };
    score += smokingFactor[data.smoking_status] || 0;
    
    // Alcohol factor (-10 to 0 points)
    const alcoholFactor: Record<string, number> = {
      never: 0,
      rarely: -2,
      moderate: -5,
      regular: -10,
    };
    score += alcoholFactor[data.alcohol_consumption] || 0;
    
    return Math.round(Math.min(100, Math.max(0, score)));
  };

  const handleComplete = async (data: OnboardingData) => {
    if (!userId) return;
    
    setLoading(true);

    try {
      const healthScore = calculateHealthScore(data);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          height_cm: parseFloat(data.height_cm),
          current_weight_kg: parseFloat(data.current_weight_kg),
          target_weight_kg: parseFloat(data.target_weight_kg),
          date_of_birth: data.date_of_birth,
          activity_level: data.activity_level,
          health_score: healthScore,
          onboarding_completed: true,
        })
        .eq("user_id", userId);

      if (error) throw error;

      // Save initial weight to health_data for tracking
      await supabase.from("health_data").insert({
        user_id: userId,
        data_type: "weight",
        value: { weight: parseFloat(data.current_weight_kg), week: 1 },
        recorded_at: new Date().toISOString(),
      });

      // Save lifestyle factors
      await supabase.from("health_data").insert({
        user_id: userId,
        data_type: "lifestyle",
        value: {
          sleep_quality: data.sleep_quality,
          stress_level: data.stress_level,
          smoking_status: data.smoking_status,
          alcohol_consumption: data.alcohol_consumption,
        },
        recorded_at: new Date().toISOString(),
      });

      toast({
        title: "Profile Complete!",
        description: `Your initial health score is ${healthScore}. Let's begin your journey.`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portal-bg">
        <Loader2 className="w-8 h-8 animate-spin text-eucalyptus" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eucalyptus-dark via-eucalyptus to-eucalyptus-light">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          className="py-6 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-medium text-white">DeepFlow</span>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          className="flex-1 flex items-center justify-center p-4 pb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-140px)]">
            <OnboardingWizard onComplete={handleComplete} loading={loading} />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
