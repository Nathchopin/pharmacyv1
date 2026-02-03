import { useState, useMemo, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
type UnitSystem = "metric" | "imperial";

// Conversion utilities
const kgToStone = (kg: number) => kg * 0.157473;
const stoneToKg = (stone: number) => stone / 0.157473;
const cmToFeet = (cm: number) => cm / 30.48;
const feetToCm = (feet: number) => feet * 30.48;

// Pulsing reference dot component
function PulsingDot({
  cx,
  cy
}: {
  cx?: number;
  cy?: number;
}) {
  if (!cx || !cy) return null;
  return <g>
      {/* Outer pulse ring */}
      <motion.circle cx={cx} cy={cy} r={8} fill="hsl(var(--success))" opacity={0.3} initial={{
      scale: 1,
      opacity: 0.3
    }} animate={{
      scale: 2,
      opacity: 0
    }} transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeOut"
    }} />
      {/* Inner pulse ring */}
      <motion.circle cx={cx} cy={cy} r={8} fill="hsl(var(--success))" opacity={0.5} initial={{
      scale: 1,
      opacity: 0.5
    }} animate={{
      scale: 1.5,
      opacity: 0
    }} transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeOut",
      delay: 0.3
    }} />
      {/* Core dot */}
      <circle cx={cx} cy={cy} r={6} fill="hsl(var(--success))" />
      <circle cx={cx} cy={cy} r={3} fill="white" />
    </g>;
}
export function WeightLossCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [currentWeightKg, setCurrentWeightKg] = useState(85);
  const [heightCm, setHeightCm] = useState(170);

  // Spring physics for smooth slider feel
  const springWeight = useSpring(currentWeightKg, {
    stiffness: 300,
    damping: 30
  });
  const springHeight = useSpring(heightCm, {
    stiffness: 300,
    damping: 30
  });

  // Display values based on unit system
  const displayWeight = useMemo(() => {
    if (unitSystem === "imperial") {
      const stone = kgToStone(currentWeightKg);
      const wholeStone = Math.floor(stone);
      const lbs = Math.round((stone - wholeStone) * 14);
      return `${wholeStone}st ${lbs}lbs`;
    }
    return `${currentWeightKg} kg`;
  }, [currentWeightKg, unitSystem]);
  const displayHeight = useMemo(() => {
    if (unitSystem === "imperial") {
      const feet = cmToFeet(heightCm);
      const wholeFeet = Math.floor(feet);
      const inches = Math.round((feet - wholeFeet) * 12);
      return `${wholeFeet}'${inches}"`;
    }
    return `${heightCm} cm`;
  }, [heightCm, unitSystem]);

  // Slider ranges based on unit system
  const weightRange = useMemo(() => {
    if (unitSystem === "imperial") {
      return {
        min: 8,
        max: 25,
        step: 0.5
      }; // stone
    }
    return {
      min: 50,
      max: 150,
      step: 1
    }; // kg
  }, [unitSystem]);
  const heightRange = useMemo(() => {
    if (unitSystem === "imperial") {
      return {
        min: 4.5,
        max: 6.5,
        step: 0.1
      }; // feet
    }
    return {
      min: 140,
      max: 200,
      step: 1
    }; // cm
  }, [unitSystem]);

  // Handle weight change with unit conversion
  const handleWeightChange = useCallback(([value]: number[]) => {
    if (unitSystem === "imperial") {
      setCurrentWeightKg(Math.round(stoneToKg(value)));
    } else {
      setCurrentWeightKg(value);
    }
  }, [unitSystem]);

  // Handle height change with unit conversion
  const handleHeightChange = useCallback(([value]: number[]) => {
    if (unitSystem === "imperial") {
      setHeightCm(Math.round(feetToCm(value)));
    } else {
      setHeightCm(value);
    }
  }, [unitSystem]);

  // Current slider values for display
  const currentSliderWeight = useMemo(() => {
    return unitSystem === "imperial" ? kgToStone(currentWeightKg) : currentWeightKg;
  }, [currentWeightKg, unitSystem]);
  const currentSliderHeight = useMemo(() => {
    return unitSystem === "imperial" ? cmToFeet(heightCm) : heightCm;
  }, [heightCm, unitSystem]);
  const targetWeight = useMemo(() => {
    return Math.round(currentWeightKg * 0.85);
  }, [currentWeightKg]);
  const targetDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 12);
    return date.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric"
    });
  }, []);
  const chartData = useMemo(() => {
    const data = [];
    const weightLoss = currentWeightKg - targetWeight;
    for (let week = 0; week <= 52; week += 4) {
      // Bezier-style easing for smooth curve
      const t = week / 52;
      const progress = t * t * (3 - 2 * t); // Smooth step function
      data.push({
        week: `W${week}`,
        weekNum: week,
        withDeepFlow: Math.round((currentWeightKg - weightLoss * progress) * 10) / 10,
        without: currentWeightKg
      });
    }
    return data;
  }, [currentWeightKg, targetWeight]);
  const finalDataPoint = chartData[chartData.length - 1];
  const bmi = useMemo(() => {
    const heightM = heightCm / 100;
    return (currentWeightKg / (heightM * heightM)).toFixed(1);
  }, [currentWeightKg, heightCm]);
  const displayTargetWeight = useMemo(() => {
    if (unitSystem === "imperial") {
      const stone = kgToStone(targetWeight);
      const wholeStone = Math.floor(stone);
      const lbs = Math.round((stone - wholeStone) * 14);
      return `${wholeStone}st ${lbs}lbs`;
    }
    return `${targetWeight} kg`;
  }, [targetWeight, unitSystem]);
  return <motion.div initial={{
    opacity: 0,
    y: 30
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1]
  }} className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-xl border border-black/5">
      {/* Unit Toggle */}
      <div className="flex justify-center mb-10">
        <ToggleGroup type="single" value={unitSystem} onValueChange={value => value && setUnitSystem(value as UnitSystem)} className="bg-secondary rounded-full p-1">
          <ToggleGroupItem value="metric" className="rounded-full px-6 py-2 text-sm font-medium data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all duration-300">
            Metric (kg/cm)
          </ToggleGroupItem>
          <ToggleGroupItem value="imperial" className="rounded-full px-6 py-2 text-sm font-medium data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all duration-300">
            Imperial (st/ft)
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Controls */}
        <div className="space-y-10">
          <div>
            <h3 className="text-2xl font-serif font-medium mb-8">
              Your Weight Journey
            </h3>
            
            <div className="space-y-8">
              {/* Weight Slider */}
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.2
            }}>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium">Current Weight</label>
                  <motion.span className="text-sm font-semibold text-accent" key={displayWeight} initial={{
                  scale: 1.1
                }} animate={{
                  scale: 1
                }} transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}>
                    {displayWeight}
                  </motion.span>
                </div>
                <Slider value={[currentSliderWeight]} onValueChange={handleWeightChange} min={weightRange.min} max={weightRange.max} step={weightRange.step} className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-0 [&_[role=slider]]:w-6 [&_[role=slider]]:h-6 [&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-transform [&_[role=slider]]:hover:scale-110" />
              </motion.div>

              {/* Height Slider */}
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.3
            }}>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium">Height</label>
                  <motion.span className="text-sm font-semibold text-accent" key={displayHeight} initial={{
                  scale: 1.1
                }} animate={{
                  scale: 1
                }} transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}>
                    {displayHeight}
                  </motion.span>
                </div>
                <Slider value={[currentSliderHeight]} onValueChange={handleHeightChange} min={heightRange.min} max={heightRange.max} step={heightRange.step} className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-0 [&_[role=slider]]:w-6 [&_[role=slider]]:h-6 [&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-transform [&_[role=slider]]:hover:scale-110" />
              </motion.div>
            </div>
          </div>

          {/* Result Card */}
          <motion.div className="bg-secondary rounded-2xl p-6" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }}>
            <p className="text-sm text-muted-foreground mb-2">Your current BMI</p>
            <motion.p className="text-3xl font-serif font-medium mb-4" key={bmi} initial={{
            scale: 0.95
          }} animate={{
            scale: 1
          }} transition={{
            type: "spring",
            stiffness: 400
          }}>
              {bmi}
            </motion.p>
            <div className="h-px bg-border my-4" />
            <p className="text-sm text-muted-foreground mb-2">With Pharmacy, you could reach</p>
            <motion.p className="text-4xl font-serif font-medium text-accent mb-1" key={displayTargetWeight} initial={{
            scale: 0.95,
            opacity: 0.8
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            type: "spring",
            stiffness: 400
          }}>
              {displayTargetWeight}
            </motion.p>
            <p className="text-sm text-muted-foreground">by {targetDate}</p>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.3
      }}>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--success))]" />
              <span className="text-sm">With treatment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-muted-foreground" style={{
              width: 12,
              borderStyle: 'dashed'
            }} />
              <span className="text-sm text-muted-foreground">Without treatment</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{
            top: 10,
            right: 20,
            bottom: 5,
            left: 5
          }}>
              <defs>
                <linearGradient id="successGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{
              fontSize: 11
            }} stroke="hsl(var(--muted-foreground))" tickLine={false} />
              <YAxis tick={{
              fontSize: 11
            }} stroke="hsl(var(--muted-foreground))" domain={['dataMin - 5', 'dataMax + 5']} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              padding: '12px 16px'
            }} formatter={(value: number) => [`${value} kg`, '']} />
              <Line type="monotone" dataKey="without" stroke="hsl(var(--muted-foreground))" strokeDasharray="8 4" strokeWidth={2} dot={false} />
              <Line type="monotoneX" dataKey="withDeepFlow" stroke="url(#successGradient)" strokeWidth={4} dot={false} strokeLinecap="round" />
              <ReferenceDot x={finalDataPoint.week} y={finalDataPoint.withDeepFlow} shape={props => <PulsingDot {...props} />} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>;
}