import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface BiomarkerCardProps {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
  previousValue?: number;
  aiInsight?: string;
}

export function BiomarkerCard({
  name,
  value,
  unit,
  min,
  max,
  optimalMin,
  optimalMax,
  previousValue,
  aiInsight,
}: BiomarkerCardProps) {
  const range = max - min;
  const position = ((value - min) / range) * 100;
  const optimalStart = ((optimalMin - min) / range) * 100;
  const optimalWidth = ((optimalMax - optimalMin) / range) * 100;

  const getStatus = () => {
    if (value >= optimalMin && value <= optimalMax) return "optimal";
    if (value < optimalMin) return "low";
    return "high";
  };

  const status = getStatus();
  const statusColors = {
    optimal: "text-success bg-success-light",
    low: "text-amber-600 bg-amber-50",
    high: "text-destructive bg-red-50",
  };

  const trend = previousValue ? value - previousValue : 0;

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-medium text-foreground">{name}</h4>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold">{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
            {previousValue && (
              <span className={`flex items-center text-xs ${trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {trend > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : trend < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <Minus className="w-3 h-3 mr-0.5" />}
                {Math.abs(trend).toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {/* Range Bar */}
      <div className="relative h-3 bg-gradient-to-r from-destructive/30 via-success/50 to-destructive/30 rounded-full overflow-hidden mb-4">
        {/* Optimal Zone */}
        <div
          className="absolute top-0 bottom-0 bg-success/40"
          style={{
            left: `${optimalStart}%`,
            width: `${optimalWidth}%`,
          }}
        />
        {/* Marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-white shadow-md"
          initial={{ left: "0%" }}
          animate={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* Range Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mb-4">
        <span>{min}</span>
        <span>Optimal: {optimalMin} - {optimalMax}</span>
        <span>{max}</span>
      </div>

      {/* AI Insight */}
      {aiInsight && (
        <div className="bg-eucalyptus-muted rounded-xl p-4 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-eucalyptus flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-eucalyptus mb-1">Dr. AI Insight</p>
            <p className="text-sm text-foreground/80">{aiInsight}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}