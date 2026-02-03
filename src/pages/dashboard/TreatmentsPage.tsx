import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { WeightTracker } from "@/components/portal/widgets/WeightTracker";
import { HairCheckinHeatmap } from "@/components/portal/widgets/HairCheckinHeatmap";
import { useProfile } from "@/hooks/useProfile";
import { useWeightHistory } from "@/hooks/useWeightHistory";
import { useTreatmentCheckins } from "@/hooks/useTreatmentCheckins";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Scale, Scissors, TrendingDown, Flame } from "lucide-react";

export default function TreatmentsPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const { profile, loading: profileLoading, updateWeight } = useProfile(userId);
  const { checkins, streak, toggleCheckin } = useTreatmentCheckins(userId, "hair");
  
  const startWeight = profile?.current_weight_kg || 95;
  const currentWeight = profile?.current_weight_kg || 95;
  const targetWeight = profile?.target_weight_kg || 80;
  
  const { weightData, refetch: refetchWeight } = useWeightHistory(userId, startWeight, targetWeight);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      setAuthChecking(false);
    };

    checkAuth();
  }, [navigate]);

  const handleUpdateWeight = async (weight: number) => {
    const success = await updateWeight(weight);
    if (success) {
      refetchWeight();
    }
    return success;
  };

  const handleHairCheckin = async (checked: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    return toggleCheckin(today, checked);
  };

  if (authChecking || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portal-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-eucalyptus border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <PortalLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-2xl lg:text-3xl font-medium text-foreground mb-1 lg:mb-2">
            My Treatments
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Track your treatment progress and daily routines
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="grid w-full max-w-[280px] lg:max-w-md grid-cols-2 mb-6 lg:mb-8 h-10 lg:h-11">
            <TabsTrigger value="weight" className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm">
              <Scale className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              Weight Loss
            </TabsTrigger>
            <TabsTrigger value="hair" className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm">
              <Scissors className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              Hair Growth
            </TabsTrigger>
          </TabsList>

          {/* Weight Loss Tab */}
          <TabsContent value="weight">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Main Weight Tracker */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <WeightTracker
                  weightData={weightData}
                  startWeight={startWeight}
                  currentWeight={currentWeight}
                  targetWeight={targetWeight}
                  onUpdateWeight={handleUpdateWeight}
                />
              </motion.div>

              {/* Weight Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 lg:space-y-4"
              >
                <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-border/50">
                  <div className="flex items-center gap-3 mb-3 lg:mb-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-success-light flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 lg:w-5 lg:h-5 text-success-dark" />
                    </div>
                    <h3 className="font-medium text-sm lg:text-base text-foreground">Progress Summary</h3>
                  </div>

                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm text-muted-foreground">Total Lost</span>
                      <span className="font-semibold text-sm lg:text-base text-success-dark">
                        {(startWeight - currentWeight).toFixed(1)} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm text-muted-foreground">To Target</span>
                      <span className="font-semibold text-sm lg:text-base">
                        {(currentWeight - targetWeight).toFixed(1)} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm text-muted-foreground">Progress</span>
                      <span className="font-semibold text-sm lg:text-base text-eucalyptus">
                        {startWeight > targetWeight 
                          ? Math.round((startWeight - currentWeight) / (startWeight - targetWeight) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-border">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-eucalyptus rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min(100, Math.round((startWeight - currentWeight) / (startWeight - targetWeight) * 100))}%` 
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* GLP-1 Info Card */}
                <div className="bg-eucalyptus-muted rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h4 className="font-medium text-sm lg:text-base text-foreground mb-2">GLP-1 Treatment</h4>
                  <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">
                    Your next injection is scheduled. Track your weight regularly for best results.
                  </p>
                  <div className="text-[10px] lg:text-xs text-muted-foreground">
                    💡 Tip: Log your weight at the same time each day for accurate tracking
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Hair Growth Tab */}
          <TabsContent value="hair">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Hair Heatmap */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <HairCheckinHeatmap
                  checkins={checkins}
                  streak={streak}
                  onToggleToday={handleHairCheckin}
                />
              </motion.div>

              {/* Hair Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 lg:space-y-4"
              >
                <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-border/50">
                  <div className="flex items-center gap-3 mb-3 lg:mb-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-success-light flex items-center justify-center">
                      <Flame className="w-4 h-4 lg:w-5 lg:h-5 text-success-dark" />
                    </div>
                    <h3 className="font-medium text-sm lg:text-base text-foreground">Consistency Stats</h3>
                  </div>

                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm text-muted-foreground">Current Streak</span>
                      <span className="font-semibold text-sm lg:text-base text-success-dark">
                        {streak} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm text-muted-foreground">This Month</span>
                      <span className="font-semibold text-sm lg:text-base">
                        {checkins.filter(c => c.checked_in && c.checkin_date.startsWith(new Date().toISOString().slice(0, 7))).length} / {new Date().getDate()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm text-muted-foreground">Adherence</span>
                      <span className="font-semibold text-sm lg:text-base text-eucalyptus">
                        {Math.round(checkins.filter(c => c.checked_in).length / Math.max(checkins.length, 1) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Finasteride Info */}
                <div className="bg-eucalyptus-muted rounded-xl lg:rounded-2xl p-4 lg:p-6">
                  <h4 className="font-medium text-sm lg:text-base text-foreground mb-2">Finasteride 1mg</h4>
                  <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">
                    Take one tablet daily. Consistency is key for results.
                  </p>
                  <div className="text-[10px] lg:text-xs text-muted-foreground">
                    💡 Tip: Set a daily reminder to take your medication at the same time
                  </div>
                </div>

                {/* Streak Bonus */}
                {streak >= 7 && (
                  <motion.div
                    className="bg-success-light rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <Flame className="w-6 h-6 lg:w-8 lg:h-8 text-success-dark mx-auto mb-2" />
                    <h4 className="font-semibold text-sm lg:text-base text-success-dark">+5 Health Score Bonus!</h4>
                    <p className="text-xs lg:text-sm text-success-dark/80 mt-1">
                      You've maintained a 7+ day streak
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
