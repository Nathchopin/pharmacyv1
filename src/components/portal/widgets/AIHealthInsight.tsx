import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Heart, Droplets, Activity, Zap, Moon, Pill, Calendar, Target,
  RefreshCw, ChevronDown, ChevronUp, Stethoscope, Salad, Dumbbell,
  Minimize2, Maximize2
} from "lucide-react";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BiomarkerTrend {
  name: string;
  unit: string;
  optimalMin: number;
  optimalMax: number;
  latestInsight: string;
  latestStatus: string;
  data: { date: string; value: number }[];
}

interface AIHealthInsightProps {
  biomarkerTrends: BiomarkerTrend[];
  uploadsCount: number;
  /** Incremented by parent ONLY when a new upload succeeds */
  refreshSignal?: number;
}

// Biomarker categories for icons
const BIOMARKER_CATEGORIES: Record<string, { icon: typeof Heart; color: string }> = {
  "Total Cholesterol": { icon: Heart, color: "text-rose-500" },
  "HDL Cholesterol": { icon: Heart, color: "text-rose-500" },
  "LDL Cholesterol": { icon: Heart, color: "text-rose-500" },
  "Triglycerides": { icon: Heart, color: "text-rose-500" },
  "Hemoglobin": { icon: Droplets, color: "text-red-500" },
  "Hematocrit": { icon: Droplets, color: "text-red-500" },
  "RBC": { icon: Droplets, color: "text-red-500" },
  "WBC": { icon: Droplets, color: "text-red-500" },
  "Platelets": { icon: Droplets, color: "text-red-500" },
  "Glucose": { icon: Activity, color: "text-amber-500" },
  "HbA1c": { icon: Activity, color: "text-amber-500" },
  "Insulin": { icon: Activity, color: "text-amber-500" },
  "Testosterone": { icon: Zap, color: "text-purple-500" },
  "TSH": { icon: Zap, color: "text-purple-500" },
  "Free T4": { icon: Zap, color: "text-purple-500" },
  "Free T3": { icon: Zap, color: "text-purple-500" },
  "Vitamin D": { icon: Moon, color: "text-yellow-500" },
  "Vitamin B12": { icon: Moon, color: "text-yellow-500" },
  "Iron": { icon: Moon, color: "text-yellow-500" },
  "Ferritin": { icon: Moon, color: "text-yellow-500" },
};

export function AIHealthInsight({ biomarkerTrends, uploadsCount, refreshSignal }: AIHealthInsightProps) {
  const { recommendations, loading, fetchRecommendations } = useAIRecommendations();
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "protocols" | "plan">("overview");
  const previousRefreshSignal = useRef<number | null>(null);

  // Calculate basic stats for fallback display
  const basicStats = useMemo(() => {
    const total = biomarkerTrends.length;
    let optimal = 0;
    const needsAttention: BiomarkerTrend[] = [];

    biomarkerTrends.forEach(trend => {
      const latest = trend.data[trend.data.length - 1]?.value || 0;
      if (latest >= trend.optimalMin && latest <= trend.optimalMax) {
        optimal++;
      } else {
        needsAttention.push(trend);
      }
    });

    return { total, optimal, needsAttention: needsAttention.length };
  }, [biomarkerTrends]);

  // Refresh ONLY when the parent explicitly signals a successful new upload
  useEffect(() => {
    if (!refreshSignal) return;

    // Don't fire on first mount if refreshSignal already has a value
    if (previousRefreshSignal.current === null) {
      previousRefreshSignal.current = refreshSignal;
      return;
    }

    if (refreshSignal > previousRefreshSignal.current && biomarkerTrends.length > 0) {
      console.log("Upload refresh signal received, regenerating AI recommendations...");
      fetchRecommendations(biomarkerTrends, true);
    }

    previousRefreshSignal.current = refreshSignal;
  }, [refreshSignal, biomarkerTrends, fetchRecommendations]);

  if (uploadsCount === 0 || biomarkerTrends.length === 0) return null;

  const healthScore = Math.round((basicStats.optimal / basicStats.total) * 100);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Header with gradient - Always visible */}
        <CollapsibleTrigger asChild>
          <div className="bg-gradient-to-r from-eucalyptus via-eucalyptus/90 to-eucalyptus/80 p-4 sm:p-6 text-white cursor-pointer transition-colors">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg sm:text-xl font-medium mb-0.5 truncate">AI Medical Analysis</h3>
                <p className="text-white/80 text-xs sm:text-sm truncate">
                  {isOpen ? `Doctor-level insights from ${basicStats.total} biomarkers` : `${healthScore}% optimal • ${basicStats.needsAttention} need attention`}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {isOpen && (
                  <div className="text-right hidden sm:block">
                    <div className="text-2xl sm:text-3xl font-bold">{healthScore}%</div>
                    <div className="text-xs text-white/70">Optimal Score</div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchRecommendations(biomarkerTrends);
                  }}
                  disabled={loading}
                  className="text-white hover:bg-transparent hover:opacity-90 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? "animate-spin" : ""}`} />
                </Button>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent flex items-center justify-center">
                  {isOpen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 divide-x divide-border/50 border-b border-border/50">
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{basicStats.total}</div>
          <div className="text-xs text-muted-foreground">Tracked</div>
        </div>
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-success">{basicStats.optimal}</div>
          <div className="text-xs text-muted-foreground">Optimal</div>
        </div>
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{basicStats.needsAttention}</div>
          <div className="text-xs text-muted-foreground">Review</div>
        </div>
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-eucalyptus">{uploadsCount}</div>
          <div className="text-xs text-muted-foreground">Tests</div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4"
          >
            <Sparkles className="w-12 h-12 text-eucalyptus" />
          </motion.div>
          <p className="text-muted-foreground">Analyzing your biomarkers with AI...</p>
          <p className="text-xs text-muted-foreground mt-1">Generating doctor-level recommendations</p>
        </div>
      )}

      {/* AI Recommendations Content */}
      {recommendations && !loading && (
        <>
          {/* Health Summary */}
          <div className="p-5 bg-gradient-to-r from-eucalyptus/5 to-transparent border-b border-border/50">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-eucalyptus shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{recommendations.healthSummary}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border/50">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "protocols", label: "Treatment Protocols", icon: Pill },
              { id: "plan", label: "90-Day Plan", icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-eucalyptus border-b-2 border-eucalyptus bg-eucalyptus/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Priority Concerns */}
                  {recommendations.priorityConcerns.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Priority Concerns
                      </h4>
                      <div className="space-y-3">
                        {recommendations.priorityConcerns.map((concern, i) => {
                          const category = BIOMARKER_CATEGORIES[concern.biomarker] || { icon: Activity, color: "text-gray-500" };
                          const IconComponent = category.icon;
                          return (
                            <div key={i} className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 ${category.color}`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{concern.biomarker}</span>
                                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                                      {concern.currentValue} ({concern.status})
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{concern.clinicalMeaning}</p>
                                  <div className="text-xs text-amber-700">
                                    <strong>Possible causes:</strong> {concern.possibleCauses.join(", ")}
                                  </div>
                                  <div className="text-xs text-rose-600 mt-1">
                                    <strong>Risk if untreated:</strong> {concern.risks}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Evolution Assessment */}
                  {recommendations.evolutionAssessment && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-eucalyptus" />
                        Evolution Analysis
                      </h4>
                      <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                        {recommendations.evolutionAssessment.improving.length > 0 && (
                          <div className="flex items-start gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                            <p className="text-sm">
                              <span className="font-medium text-success">Improving:</span>{" "}
                              {recommendations.evolutionAssessment.improving.join(", ")}
                            </p>
                          </div>
                        )}
                        {recommendations.evolutionAssessment.declining.length > 0 && (
                          <div className="flex items-start gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <p className="text-sm">
                              <span className="font-medium text-rose-600">Declining:</span>{" "}
                              {recommendations.evolutionAssessment.declining.join(", ")}
                            </p>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">{recommendations.evolutionAssessment.analysis}</p>
                      </div>
                    </div>
                  )}

                  {/* Positive Findings */}
                  {recommendations.positiveFindings.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        What's Going Well
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {recommendations.positiveFindings.map((finding, i) => (
                          <div key={i} className="p-3 rounded-lg bg-success/10 border border-success/20 text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                            <span>{finding}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "protocols" && (
                <motion.div
                  key="protocols"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {recommendations.treatmentProtocols.map((protocol, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-eucalyptus" />
                        {protocol.target}
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {/* Lifestyle */}
                        {protocol.lifestyle.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground">
                              <Dumbbell className="w-3 h-3" />
                              LIFESTYLE
                            </div>
                            <ul className="space-y-1">
                              {protocol.lifestyle.map((item, j) => (
                                <li key={j} className="text-xs text-foreground pl-3 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-eucalyptus before:rounded-full">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Diet */}
                        {protocol.diet.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground">
                              <Salad className="w-3 h-3" />
                              DIET
                            </div>
                            <ul className="space-y-1">
                              {protocol.diet.map((item, j) => (
                                <li key={j} className="text-xs text-foreground pl-3 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-green-500 before:rounded-full">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Supplements */}
                      {protocol.supplements.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground">
                            <Pill className="w-3 h-3" />
                            SUPPLEMENTS
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {protocol.supplements.map((supp, j) => (
                              <div key={j} className="p-2 bg-white rounded-lg border border-border/50">
                                <p className="font-medium text-xs">{supp.name}</p>
                                <p className="text-xs text-eucalyptus">{supp.dosage}</p>
                                <p className="text-xs text-muted-foreground">{supp.timing}</p>
                                {supp.notes && <p className="text-xs text-muted-foreground italic mt-1">{supp.notes}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                        <span>⏱️ Retest in: <strong className="text-foreground">{protocol.retestIn}</strong></span>
                        {protocol.redFlags.length > 0 && (
                          <span className="text-rose-500">⚠️ Watch for: {protocol.redFlags[0]}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "plan" && (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="space-y-4">
                    {[
                      { weeks: "1-2", label: "Weeks 1-2: Foundation", items: recommendations.actionPlan.weeks1to2, color: "bg-eucalyptus" },
                      { weeks: "3-4", label: "Weeks 3-4: Build Momentum", items: recommendations.actionPlan.weeks3to4, color: "bg-blue-500" },
                      { weeks: "5-8", label: "Weeks 5-8: Accelerate", items: recommendations.actionPlan.weeks5to8, color: "bg-purple-500" },
                      { weeks: "9-12", label: "Weeks 9-12: Optimize", items: recommendations.actionPlan.weeks9to12, color: "bg-amber-500" },
                    ].map((phase, i) => (
                      <div key={i} className="relative pl-6">
                        <div className={`absolute left-0 top-0 w-4 h-4 rounded-full ${phase.color}`} />
                        {i < 3 && <div className="absolute left-[7px] top-4 w-0.5 h-full bg-border" />}
                        <div className="pb-4">
                          <h5 className="font-medium text-sm mb-2">{phase.label}</h5>
                          <ul className="space-y-1">
                            {phase.items.map((item, j) => (
                              <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="text-eucalyptus mt-0.5">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Fallback when no recommendations yet and not loading */}
      {!recommendations && !loading && (
        <div className="p-6 text-center">
          <Button
            onClick={() => fetchRecommendations(biomarkerTrends)}
            className="bg-eucalyptus hover:bg-eucalyptus/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Analysis
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Get personalized, doctor-level recommendations
          </p>
        </div>
      )}
        </CollapsibleContent>
      </motion.div>
    </Collapsible>
  );
}
