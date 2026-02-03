import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WeightEntry {
  date: string;
  actual: number | null;
  projected: number | null;
}

interface WeightTrackerProps {
  weightData: WeightEntry[];
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  onUpdateWeight: (weight: number) => Promise<boolean>;
}

export function WeightTracker({ 
  weightData, 
  startWeight, 
  currentWeight, 
  targetWeight,
  onUpdateWeight 
}: WeightTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentWeight.toString());
  const [saving, setSaving] = useState(false);

  const percentageLoss = startWeight > 0 
    ? ((startWeight - currentWeight) / startWeight * 100).toFixed(1) 
    : "0";

  const handleSave = useCallback(async () => {
    const weight = parseFloat(editValue);
    if (isNaN(weight) || weight <= 0) return;
    
    setSaving(true);
    const success = await onUpdateWeight(weight);
    setSaving(false);
    
    if (success) {
      setIsEditing(false);
    }
  }, [editValue, onUpdateWeight]);

  const handleCancel = useCallback(() => {
    setEditValue(currentWeight.toString());
    setIsEditing(false);
  }, [currentWeight]);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl font-medium text-foreground">Weight Journey</h3>
          <p className="text-sm text-muted-foreground">GLP-1 Treatment Progress</p>
        </div>
        <motion.div
          className="flex items-center gap-2 bg-success-light px-4 py-2 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <TrendingDown className="w-5 h-5 text-success-dark" />
          <span className="text-xl font-bold text-success-dark">-{percentageLoss}%</span>
        </motion.div>
      </div>

      <div className="h-[200px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weightData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#134E4A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#134E4A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              domain={['dataMin - 2', 'dataMax + 2']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                padding: "8px 12px",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            {/* Projected line (dotted) */}
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#134E4A"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              name="Projected"
            />
            {/* Actual line (solid) */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#134E4A"
              strokeWidth={3}
              fill="url(#actualGradient)"
              name="Actual"
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-eucalyptus" />
          <span className="text-xs text-muted-foreground">Actual Weight</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-eucalyptus border-t-2 border-dashed" />
          <span className="text-xs text-muted-foreground">Projected</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Start</p>
          <p className="text-lg font-semibold">{startWeight} kg</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Current</p>
          {isEditing ? (
            <div className="flex items-center gap-1 justify-center">
              <Input
                type="number"
                step="0.1"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-20 h-8 text-center text-sm"
                autoFocus
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8" 
                onClick={handleSave}
                disabled={saving}
              >
                <Check className="w-4 h-4 text-success" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8" 
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 justify-center hover:text-eucalyptus transition-colors group"
            >
              <span className="text-lg font-semibold text-eucalyptus">{currentWeight} kg</span>
              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Target</p>
          <p className="text-lg font-semibold">{targetWeight} kg</p>
        </div>
      </div>
    </motion.div>
  );
}
