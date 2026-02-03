import { motion } from "framer-motion";
import { Calendar, Clock, Video, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const reminders = [
  {
    id: 1,
    title: "Blood Test Review",
    date: "Feb 14, 2026",
    time: "10:00 AM",
    type: "video",
    doctor: "Dr. Sarah Smith",
  },
  {
    id: 2,
    title: "Weight Check-in",
    date: "Feb 21, 2026",
    time: "11:30 AM",
    type: "in-person",
    doctor: "Clinic Visit",
  },
];

export function UpcomingReminders() {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-medium">Reminders</h3>
        <Button size="sm" variant="outline" className="rounded-full h-8 text-xs">
          <Plus className="w-3 h-3 mr-1" />
          New
        </Button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            className="p-4 rounded-xl border border-border/50 hover:border-eucalyptus/30 hover:bg-eucalyptus-muted/30 transition-all cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                reminder.type === "video" ? "bg-accent/10 text-accent" : "bg-eucalyptus-muted text-eucalyptus"
              }`}>
                {reminder.type === "video" ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{reminder.title}</p>
                <p className="text-sm text-muted-foreground">{reminder.doctor}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {reminder.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {reminder.time}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Button variant="ghost" className="w-full mt-4 text-eucalyptus hover:text-eucalyptus-light hover:bg-eucalyptus-muted/50 rounded-xl">
        View All Appointments
      </Button>
    </motion.div>
  );
}