import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface WeightLossProjectionChartProps {
    currentWeight: number;
    medication: "wegovy" | "mounjaro";
}

export function WeightLossProjectionChart({ currentWeight, medication }: WeightLossProjectionChartProps) {
    // Calculate projections
    // Mounjaro: ~20% loss over 12 months
    // Wegovy: ~15% loss over 12 months
    const maxLossPercentage = medication === "mounjaro" ? 0.20 : 0.15;
    const months = 12;

    const data = Array.from({ length: months + 1 }, (_, i) => {
        const progress = i / months;
        // Logarithmic curve for weight loss (faster at start, plateaus)
        // Loss factor = 1 - (maxLoss * (1 - e^(-3 * progress))) / (1 - e^(-3))
        // Simplified: Linear progress for now or simple easing

        // Using a simple ease-out curve: 1 - (1-x)^2 is too fast, let's use quadratic ease out
        const curve = 1 - Math.pow(1 - progress, 2);
        const weightLoss = currentWeight * maxLossPercentage * curve;
        const projectedWeight = currentWeight - weightLoss;

        // Natural weight (without medication) - fluctuations
        const naturalWeight = currentWeight + (Math.sin(i * 0.5) * 0.5);

        return {
            month: i === 0 ? "Now" : `Month ${i}`,
            Projected: Number(projectedWeight.toFixed(1)),
            Natural: Number(naturalWeight.toFixed(1)),
        };
    });

    const targetWeight = data[data.length - 1].Projected;
    const totalLost = (currentWeight - targetWeight).toFixed(1);

    return (
        <Card className="p-6 overflow-hidden">
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-1">Projected Progress</h3>
                <p className="text-muted-foreground text-sm">
                    With {medication === "mounjaro" ? "Mounjaro" : "Wegovy"}, you could reach <span className="text-[#134E4A] font-semibold">{targetWeight}kg</span> in 12 months.
                </p>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#134E4A" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#134E4A" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            interval={2}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="Natural"
                            stroke="#9CA3AF"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill="transparent"
                            name="Without Treatment"
                        />
                        <Area
                            type="monotone"
                            dataKey="Projected"
                            stroke="#134E4A"
                            strokeWidth={3}
                            fill="url(#colorProjected)"
                            name={`With ${medication === "mounjaro" ? "Mounjaro" : "Wegovy"}`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-between p-4 bg-[#134E4A]/5 rounded-xl border border-[#134E4A]/10">
                <div>
                    <p className="text-sm text-muted-foreground">Estimated Weight Loss</p>
                    <p className="text-2xl font-serif text-[#134E4A]">{totalLost} kg</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Target Weight</p>
                    <p className="text-2xl font-serif text-[#134E4A]">{targetWeight} kg</p>
                </div>
            </div>
        </Card>
    );
}
