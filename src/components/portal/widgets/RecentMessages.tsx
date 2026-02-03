import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const messages = [
  {
    id: 1,
    sender: "Dr. Sarah Smith",
    avatar: null,
    subject: "Your Blood Test Results Are Ready",
    preview: "Hi, I've reviewed your latest blood test results and everything looks...",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    sender: "Pharmacy Team",
    avatar: null,
    subject: "Prescription Dispatched",
    preview: "Your prescription for Semaglutide has been dispatched and should...",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    sender: "Dr. James Wilson",
    avatar: null,
    subject: "Re: Hair Treatment Query",
    preview: "Thank you for your question. Based on your progress photos...",
    time: "2 days ago",
    unread: false,
  },
];

export function RecentMessages() {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-medium">Messages</h3>
        <Badge variant="secondary" className="bg-eucalyptus text-white">
          3 new
        </Badge>
      </div>

      <div className="space-y-3">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            className={`p-3 rounded-xl cursor-pointer transition-all ${
              message.unread 
                ? "bg-eucalyptus-muted/50 hover:bg-eucalyptus-muted" 
                : "hover:bg-secondary"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={message.avatar || undefined} />
                <AvatarFallback className="bg-eucalyptus text-white text-xs">
                  {message.sender.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${message.unread ? "font-semibold" : "font-medium"}`}>
                    {message.sender}
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{message.time}</span>
                </div>
                <p className={`text-sm truncate ${message.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {message.subject}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{message.preview}</p>
              </div>
              {message.unread && (
                <div className="w-2 h-2 rounded-full bg-eucalyptus shrink-0 mt-2" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Button variant="ghost" className="w-full mt-4 text-eucalyptus hover:text-eucalyptus-light hover:bg-eucalyptus-muted/50 rounded-xl">
        View All Messages
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}