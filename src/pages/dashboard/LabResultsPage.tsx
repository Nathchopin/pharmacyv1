import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { BiomarkerSparkline } from "@/components/portal/widgets/BiomarkerSparkline";
import { LabResultsUploader } from "@/components/portal/widgets/LabResultsUploader";
import { AIHealthInsight } from "@/components/portal/widgets/AIHealthInsight";
import { useBiomarkers } from "@/hooks/useBiomarkers";
import { useLabUploads } from "@/hooks/useLabUploads";
import { FileText, Calendar, TrendingUp, Activity, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

export default function LabResultsPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [showAllBiomarkers, setShowAllBiomarkers] = useState(false);
  const [aiRefreshSignal, setAiRefreshSignal] = useState(0);

  const { biomarkers, uploading, uploadAndAnalyze, refetch } = useBiomarkers(userId);
  const { uploads, refetch: refetchUploads } = useLabUploads(userId);

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

  const handleUpload = async (file: File) => {
    const success = await uploadAndAnalyze(file);
    if (success) {
      refetchUploads();
      // Only refresh AI analysis when a NEW upload succeeds (prevents reruns on page revisit)
      setAiRefreshSignal((v) => v + 1);
    }
    return success;
  };

  // Group biomarkers by name for sparkline data, using test_date for historical ordering
  const biomarkerTrends = useMemo(() => {
    const grouped: Record<string, {
      name: string;
      unit: string;
      optimalMin: number;
      optimalMax: number;
      latestInsight: string;
      latestStatus: string;
      data: { date: string; value: number }[];
    }> = {};

    // Sort by test_date ascending (oldest first for timeline)
    const sorted = [...biomarkers].sort((a, b) => 
      new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    );

    sorted.forEach(b => {
      if (!grouped[b.name]) {
        grouped[b.name] = {
          name: b.name,
          unit: b.unit,
          optimalMin: b.optimal_min || b.min_range || 0,
          optimalMax: b.optimal_max || b.max_range || 100,
          latestInsight: b.insight || "",
          latestStatus: b.status,
          data: [],
        };
      }
      grouped[b.name].data.push({
        date: format(new Date(b.recorded_at), "MMM d"),
        value: b.value,
      });
      // Update to latest values
      grouped[b.name].latestInsight = b.insight || grouped[b.name].latestInsight;
      grouped[b.name].latestStatus = b.status;
      grouped[b.name].optimalMin = b.optimal_min || b.min_range || grouped[b.name].optimalMin;
      grouped[b.name].optimalMax = b.optimal_max || b.max_range || grouped[b.name].optimalMax;
    });

    return Object.values(grouped).filter(g => g.data.length > 0);
  }, [biomarkers]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = biomarkerTrends.length;
    const optimal = biomarkerTrends.filter(t => {
      const latest = t.data[t.data.length - 1]?.value || 0;
      return latest >= t.optimalMin && latest <= t.optimalMax;
    }).length;
    const needsReview = total - optimal;
    
    // Count improvements since last test
    const improved = biomarkerTrends.filter(t => {
      if (t.data.length < 2) return false;
      const latest = t.data[t.data.length - 1].value;
      const previous = t.data[t.data.length - 2].value;
      const isInOptimal = latest >= t.optimalMin && latest <= t.optimalMax;
      const wasInOptimal = previous >= t.optimalMin && previous <= t.optimalMax;
      return isInOptimal && !wasInOptimal;
    }).length;

    return { total, optimal, needsReview, improved };
  }, [biomarkerTrends]);

  // Display limit for biomarkers
  const displayLimit = showAllBiomarkers ? biomarkerTrends.length : 6;

  if (authChecking) {
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
            Lab Results
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Time-travel through your biology with AI-powered insights
          </p>
        </motion.div>

        {/* Stats Cards */}
        {biomarkerTrends.length > 0 && (
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-eucalyptus/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-eucalyptus" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold">{summaryStats.total}</p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">Biomarkers</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-success" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold text-success-dark">{summaryStats.optimal}</p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">Optimal</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-warning-dark" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold text-warning-dark">{summaryStats.needsReview}</p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">Review</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm border border-border/50">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-eucalyptus/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-eucalyptus" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold">{uploads.length}</p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">Tests</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Health Insight Summary */}
        {biomarkerTrends.length > 0 && (
          <motion.div
            className="mb-6 lg:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <AIHealthInsight 
              biomarkerTrends={biomarkerTrends}
              uploadsCount={uploads.length}
              refreshSignal={aiRefreshSignal}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - Upload & History */}
          <motion.div
            className="space-y-4 lg:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LabResultsUploader 
              onUpload={handleUpload}
              uploading={uploading}
            />

            {/* Upload History */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-muted flex items-center justify-center">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-sm lg:text-base text-foreground">Upload History</h3>
              </div>

              <div className="space-y-2 lg:space-y-3 max-h-[240px] lg:max-h-[300px] overflow-y-auto">
                {uploads.length === 0 ? (
                  <p className="text-xs lg:text-sm text-muted-foreground text-center py-4">
                    No uploads yet. Upload your first lab result above.
                  </p>
                ) : (
                  uploads.map((upload, index) => (
                    <motion.div
                      key={upload.id}
                      className="flex items-center gap-3 p-2 lg:p-3 rounded-lg lg:rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-medium truncate">{upload.file_name}</p>
                        <p className="text-[10px] lg:text-xs text-muted-foreground">
                          {format(new Date(upload.test_date), "MMM d, yyyy")} · {upload.biomarker_count} biomarkers
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Biomarker Trends */}
          <motion.div
            className="lg:col-span-2 space-y-4 lg:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {biomarkerTrends.length === 0 ? (
              <div className="bg-white rounded-xl lg:rounded-2xl p-8 lg:p-12 shadow-sm border border-border/50 text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">No Biomarker Data Yet</h3>
                <p className="text-xs lg:text-sm text-muted-foreground max-w-sm mx-auto">
                  Upload your lab results to see trend visualizations and AI-powered insights about your health
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm lg:text-base text-foreground">All Biomarkers</h3>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">
                    Showing {Math.min(displayLimit, biomarkerTrends.length)} of {biomarkerTrends.length}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  {biomarkerTrends.slice(0, displayLimit).map((trend, index) => (
                    <motion.div
                      key={trend.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(0.1 * index, 0.5) }}
                    >
                      <BiomarkerSparkline
                        name={trend.name}
                        data={trend.data}
                        unit={trend.unit}
                        optimalMin={trend.optimalMin}
                        optimalMax={trend.optimalMax}
                        latestInsight={trend.latestInsight}
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* Show More/Less Toggle */}
                {biomarkerTrends.length > 6 && (
                  <motion.button
                    onClick={() => setShowAllBiomarkers(!showAllBiomarkers)}
                    className="w-full py-3 px-4 bg-white rounded-xl border border-border/50 flex items-center justify-center gap-2 text-xs lg:text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {showAllBiomarkers ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show All {biomarkerTrends.length} Biomarkers
                      </>
                    )}
                  </motion.button>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </PortalLayout>
  );
}
