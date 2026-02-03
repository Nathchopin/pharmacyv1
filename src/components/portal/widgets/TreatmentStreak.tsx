import { motion } from "framer-motion";
import { Pill, Flame } from "lucide-react";

// Generate mock adherence data for the last 12 weeks
const generateAdherenceData = () => {
  const weeks = [];
  for (let w = 0; w < 12; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      // More recent weeks have higher adherence
      const probability = 0.7 + (w / 24);
      days.push(Math.random() < probability);
    }
    weeks.push(days);
  }
  return weeks;
};

const adherenceData = generateAdherenceData();
const currentStreak = 23; // days
const totalDays = adherenceData.flat().filter(Boolean).length;
const adherenceRate = Math.round((totalDays / 84) * 100);

export function TreatmentStreak() {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl font-medium text-foreground">Treatment Streak</h3>
          <p className="text-sm text-muted-foreground">Finasteride Daily Adherence</p>
        </div>
        <motion.div
          className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-600">{currentStreak} days</span>
        </motion.div>
      </div>

      {/* GitHub-style Contribution Grid */}
      <div className="space-y-2 mb-6">
        <div className="flex gap-1 text-xs text-muted-foreground mb-2">
          <span className="w-8" />
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <span key={i} className="w-4 text-center">{day}</span>
          ))}
        </div>
        
        {adherenceData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1 items-center">
            <span className="w-8 text-xs text-muted-foreground">W{weekIndex + 1}</span>
            {week.map((taken, dayIndex) => (
              <motion.div
                key={dayIndex}
                className={`w-4 h-4 rounded-sm ${
                  taken 
                    ? "bg-eucalyptus" 
                    : "bg-border"
                }`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: weekIndex * 0.05 + dayIndex * 0.02,
                  type: "spring",
                  stiffness: 200
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-border" />
          <div className="w-3 h-3 rounded-sm bg-eucalyptus/40" />
          <div className="w-3 h-3 rounded-sm bg-eucalyptus/70" />
          <div className="w-3 h-3 rounded-sm bg-eucalyptus" />
        </div>
        <span>More</span>
      </div>

      {/* Status Banner */}
      <div className="bg-eucalyptus-muted rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-eucalyptus flex items-center justify-center">
          <Pill className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">Regrowth Phase: Active</p>
          <p className="text-sm text-muted-foreground">
            {adherenceRate}% adherence rate • Keep it up!
          </p>
        </div>
      </div>
    </motion.div>
  );
}