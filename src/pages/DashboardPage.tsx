import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { HealthScoreRing } from "@/components/portal/HealthScoreRing";
import { QuickStats } from "@/components/portal/widgets/QuickStats";
import { BiomarkerCard } from "@/components/portal/widgets/BiomarkerCard";
import { WeightTracker } from "@/components/portal/widgets/WeightTracker";
import { TreatmentStreak } from "@/components/portal/widgets/TreatmentStreak";
import { UpcomingReminders } from "@/components/portal/widgets/UpcomingReminders";
import { RecentMessages } from "@/components/portal/widgets/RecentMessages";
import { LabResultsUploader } from "@/components/portal/widgets/LabResultsUploader";
import { WeightLossTreatmentCard } from "@/components/portal/widgets/WeightLossTreatmentCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useBiomarkers } from "@/hooks/useBiomarkers";
import { useWeightHistory } from "@/hooks/useWeightHistory";
import { useHealthScore } from "@/hooks/useHealthScore";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const isMobile = useIsMobile();

  const { profile, loading: profileLoading, updateWeight } = useProfile(userId);
  const { biomarkers, uploading, uploadAndAnalyze } = useBiomarkers(userId);
  const { score: healthScore } = useHealthScore(userId);

  const startWeight = profile?.current_weight_kg || 95;
  const currentWeight = profile?.current_weight_kg || 95;
  const targetWeight = profile?.target_weight_kg || 80;

  const { weightData } = useWeightHistory(userId, startWeight, targetWeight);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!profileLoading && profile && profile.onboarding_completed === false) {
      navigate("/onboarding");
    }
  }, [profile, profileLoading, navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = profile?.first_name || "User";
  const initials = `${profile?.first_name?.[0] || "U"}${profile?.last_name?.[0] || ""}`;

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

  // Get latest biomarkers for display (group by name, take most recent)
  const latestBiomarkers = biomarkers.reduce((acc, biomarker) => {
    if (!acc[biomarker.name] || new Date(biomarker.recorded_at) > new Date(acc[biomarker.name].recorded_at)) {
      acc[biomarker.name] = biomarker;
    }
    return acc;
  }, {} as Record<string, typeof biomarkers[0]>);

  const biomarkerList = Object.values(latestBiomarkers).slice(0, 3);

  return (
    <PortalLayout>
      {/* Top Bar - Hidden on mobile (uses mobile header instead) */}
      <motion.header
        className="hidden lg:flex h-16 bg-white border-b border-border items-center justify-between px-8 sticky top-0 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search treatments, results..."
              className="pl-10 rounded-xl border-border bg-secondary/50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative rounded-xl">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <div className="h-8 w-px bg-border" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{getGreeting()}, {firstName}</p>
              <p className="text-xs text-muted-foreground">Patient Portal</p>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10 border-2 border-eucalyptus">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-eucalyptus text-white">{initials}</AvatarFallback>
              </Avatar>
              <HealthScoreRing score={healthScore} size={40} strokeWidth={3} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Dashboard Content */}
      <div className="p-4 lg:p-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-2xl lg:text-3xl font-medium text-foreground mb-1 lg:mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Here's an overview of your health journey
          </p>
        </motion.div>

        {/* Mobile Health Score Card */}
        {isMobile && (
          <motion.div
            className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <div className="flex items-center gap-4">
              <HealthScoreRing score={healthScore} size={64} strokeWidth={5} />
              <div>
                <p className="text-sm text-muted-foreground">Your Health Score</p>
                <p className="text-2xl font-semibold">{healthScore}/100</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <QuickStats />
        </motion.div>

        {/* Main Grid - Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - Weight Tracker */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <WeightTracker
              weightData={weightData}
              startWeight={startWeight}
              currentWeight={currentWeight}
              targetWeight={targetWeight}
              onUpdateWeight={updateWeight}
            />

            <div className="mt-6">
              <WeightLossTreatmentCard />
            </div>

          </motion.div>

          {/* Right Column - Lab Results Uploader */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <LabResultsUploader
              onUpload={uploadAndAnalyze}
              uploading={uploading}
            />
          </motion.div>

          {/* Dynamic Biomarker Cards from DB or defaults */}
          {biomarkerList.length > 0 ? (
            biomarkerList.map((biomarker, index) => (
              <motion.div
                key={biomarker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <BiomarkerCard
                  name={biomarker.name}
                  value={biomarker.value}
                  unit={biomarker.unit}
                  min={biomarker.min_range || 0}
                  max={biomarker.max_range || 100}
                  optimalMin={biomarker.optimal_min || biomarker.min_range || 0}
                  optimalMax={biomarker.optimal_max || biomarker.max_range || 100}
                  aiInsight={biomarker.insight || undefined}
                />
              </motion.div>
            ))
          ) : (
            <>
              {/* Default biomarker cards when no data */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <BiomarkerCard
                  name="Ferritin (Iron)"
                  value={18}
                  unit="ng/mL"
                  min={10}
                  max={150}
                  optimalMin={30}
                  optimalMax={100}
                  previousValue={15}
                  aiInsight="Upload your lab results to get personalized insights. This is sample data."
                />
              </motion.div>
            </>
          )}

          {/* Treatment Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <TreatmentStreak />
          </motion.div>

          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <RecentMessages />
          </motion.div>

          {/* Upcoming Reminders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <UpcomingReminders />
          </motion.div>
        </div>
      </div>
    </PortalLayout>
  );
}
