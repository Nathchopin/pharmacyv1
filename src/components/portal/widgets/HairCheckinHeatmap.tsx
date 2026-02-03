import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Pill, Flame, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HairCheckinHeatmapProps {
  checkins: { checkin_date: string; checked_in: boolean }[];
  streak: number;
  onToggleToday: (checked: boolean) => Promise<boolean>;
}

export function HairCheckinHeatmap({ checkins, streak, onToggleToday }: HairCheckinHeatmapProps) {
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const todayCheckedIn = checkins.find(c => c.checkin_date === today)?.checked_in || false;

  // Generate last 12 weeks of dates (84 days)
  const heatmapData = useMemo(() => {
    const weeks: { date: string; checked: boolean }[][] = [];
    const checkinMap = new Map(checkins.map(c => [c.checkin_date, c.checked_in]));
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 83);
    
    let currentWeek: { date: string; checked: boolean }[] = [];
    
    for (let i = 0; i < 84; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      currentWeek.push({
        date: dateStr,
        checked: checkinMap.get(dateStr) || false,
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [checkins]);

  const handleCheckin = async () => {
    setLoading(true);
    await onToggleToday(!todayCheckedIn);
    setLoading(false);
  };

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-eucalyptus-muted flex items-center justify-center">
            <Pill className="w-5 h-5 text-eucalyptus" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Hair Treatment</h3>
            <p className="text-sm text-muted-foreground">Daily Finasteride Check-in</p>
          </div>
        </div>
        <motion.div
          className="flex items-center gap-2 bg-success-light px-3 py-1.5 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Flame className="w-4 h-4 text-success-dark" />
          <span className="font-semibold text-success-dark">{streak} day streak</span>
        </motion.div>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-6">
        <div className="flex gap-1 mb-2">
          <div className="w-6" /> {/* Spacer for labels */}
          {heatmapData.map((_, weekIndex) => (
            <div key={weekIndex} className="flex-1 h-3" />
          ))}
        </div>
        
        {weekLabels.map((label, dayIndex) => (
          <div key={label} className="flex gap-1 items-center mb-1">
            <span className="w-6 text-[10px] text-muted-foreground">{label.slice(0, 1)}</span>
            {heatmapData.map((week, weekIndex) => {
              const day = week[dayIndex];
              if (!day) return <div key={weekIndex} className="w-3 h-3" />;
              
              const isToday = day.date === today;
              const isFuture = new Date(day.date) > new Date();
              
              return (
                <motion.div
                  key={day.date}
                  className={cn(
                    "w-3 h-3 rounded-sm transition-colors",
                    isFuture ? "bg-muted/30" :
                    day.checked ? "bg-eucalyptus" : "bg-muted",
                    isToday && "ring-2 ring-eucalyptus ring-offset-1"
                  )}
                  whileHover={{ scale: 1.2 }}
                  title={`${day.date}: ${day.checked ? 'Taken' : 'Missed'}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Today's Check-in */}
      <Button
        onClick={handleCheckin}
        disabled={loading}
        className={cn(
          "w-full rounded-xl h-12 text-base font-medium transition-all",
          todayCheckedIn 
            ? "bg-success hover:bg-success/90 text-white" 
            : "bg-eucalyptus hover:bg-eucalyptus-dark text-white"
        )}
      >
        {loading ? (
          <span className="animate-pulse">Saving...</span>
        ) : todayCheckedIn ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Taken Today! 
          </>
        ) : (
          <>
            <Pill className="w-5 h-5 mr-2" />
            Take Today's Pill
          </>
        )}
      </Button>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <span className="text-xs text-muted-foreground">Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-eucalyptus" />
          <span className="text-xs text-muted-foreground">Taken</span>
        </div>
      </div>
    </motion.div>
  );
}
