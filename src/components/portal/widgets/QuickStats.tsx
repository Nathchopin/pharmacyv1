import { motion } from "framer-motion";
import { Calendar, MessageSquare, FileText, Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, subtext, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-5 shadow-sm border border-border/50"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] lg:text-sm text-muted-foreground mb-0.5 lg:mb-1 truncate">{label}</p>
          <p className="text-lg lg:text-2xl font-semibold">{value}</p>
          {subtext && <p className="text-[10px] lg:text-xs text-muted-foreground mt-0.5 lg:mt-1 truncate">{subtext}</p>}
        </div>
        <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export function QuickStats() {
  const stats = [
    {
      icon: Calendar,
      label: "Next Appointment",
      value: "Feb 14",
      subtext: "Blood test review",
      color: "bg-eucalyptus",
    },
    {
      icon: MessageSquare,
      label: "Unread Messages",
      value: 3,
      subtext: "2 from Dr. Smith",
      color: "bg-accent",
    },
    {
      icon: FileText,
      label: "Pending Results",
      value: 1,
      subtext: "Expected today",
      color: "bg-amber-500",
    },
    {
      icon: Clock,
      label: "Days on Treatment",
      value: 84,
      subtext: "Week 12 of 16",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}
