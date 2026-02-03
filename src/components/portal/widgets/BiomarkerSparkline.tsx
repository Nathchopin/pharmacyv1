import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";
import { TrendingUp, TrendingDown, Minus, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";

interface DataPoint {
  date: string;
  value: number;
}

interface BiomarkerSparklineProps {
  name: string;
  data: DataPoint[];
  unit: string;
  optimalMin: number;
  optimalMax: number;
  latestInsight?: string;
}

export function BiomarkerSparkline({ 
  name, 
  data, 
  unit, 
  optimalMin, 
  optimalMax,
  latestInsight 
}: BiomarkerSparklineProps) {
  const latestValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value;
  const change = previousValue ? ((latestValue - previousValue) / previousValue * 100) : null;
  const isInOptimal = latestValue >= optimalMin && latestValue <= optimalMax;
  const wasInOptimal = previousValue ? previousValue >= optimalMin && previousValue <= optimalMax : true;
  
  // Calculate domain with padding
  const allValues = data.map(d => d.value);
  const minValue = Math.min(...allValues, optimalMin) * 0.85;
  const maxValue = Math.max(...allValues, optimalMax) * 1.15;

  // Determine trend direction and significance
  const getTrendInfo = () => {
    if (!change) return { icon: Minus, color: "text-muted-foreground", label: "First reading" };
    
    if (Math.abs(change) < 2) {
      return { icon: Minus, color: "text-muted-foreground", label: "Stable" };
    }
    
    // For most biomarkers, moving INTO optimal range is good
    if (!wasInOptimal && isInOptimal) {
      return { icon: CheckCircle, color: "text-success", label: "Improved!" };
    }
    
    // Moving OUT of optimal range is concerning
    if (wasInOptimal && !isInOptimal) {
      return { icon: AlertTriangle, color: "text-warning-dark", label: "Review needed" };
    }
    
    if (change > 0) {
      return { icon: TrendingUp, color: isInOptimal ? "text-muted-foreground" : "text-warning-dark", label: `+${change.toFixed(1)}%` };
    }
    return { icon: TrendingDown, color: isInOptimal ? "text-muted-foreground" : "text-warning-dark", label: `${change.toFixed(1)}%` };
  };

  const trendInfo = getTrendInfo();
  const TrendIcon = trendInfo.icon;

  // Generate AI delta insight
  const deltaInsight = previousValue && change ? (
    !wasInOptimal && isInOptimal 
      ? `Great progress! ${name} has moved into the optimal range.`
      : wasInOptimal && !isInOptimal
      ? `${name} has moved outside the optimal range. Consider discussing with your pharmacist.`
      : Math.abs(change) > 10
      ? `${name} changed by ${Math.abs(change).toFixed(0)}% since your last test.`
      : null
  ) : null;

  return (
    <motion.div
      className="bg-white rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-foreground text-sm">{name}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight">{latestValue}</span>
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            isInOptimal 
              ? "bg-success/10 text-success-dark border border-success/20" 
              : "bg-warning/10 text-warning-dark border border-warning/20"
          }`}>
            {isInOptimal ? "Optimal" : latestValue < optimalMin ? "Low" : "High"}
          </div>
          {change !== null && (
            <div className={`flex items-center gap-1 text-xs ${trendInfo.color}`}>
              <TrendIcon className="w-3 h-3" />
              <span>{trendInfo.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="h-[100px] -mx-2 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--eucalyptus))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--eucalyptus))" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* Optimal zone background */}
            <ReferenceArea 
              y1={optimalMin} 
              y2={optimalMax} 
              fill="hsl(var(--success))" 
              fillOpacity={0.08}
              strokeOpacity={0}
            />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[minValue, maxValue]}
              hide
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                padding: "8px 12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value} ${unit}`, name]}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            {/* Data area with gradient */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--eucalyptus))"
              strokeWidth={2.5}
              fill={`url(#gradient-${name})`}
              dot={{ fill: "hsl(var(--eucalyptus))", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: "hsl(var(--eucalyptus))", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Optimal Range Indicator */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Optimal: {optimalMin}–{optimalMax} {unit}</span>
          <span>{data.length} reading{data.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* AI Insight */}
      {(deltaInsight || latestInsight) && (
        <motion.div 
          className="mt-3 p-3 bg-eucalyptus/5 rounded-xl flex items-start gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-eucalyptus shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/80 leading-relaxed">
            {deltaInsight || latestInsight}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
