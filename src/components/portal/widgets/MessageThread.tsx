import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface Message {
  id: string;
  subject: string;
  content: string;
  sender_type: string | null;
  is_read: boolean | null;
  created_at: string;
}

interface MessageThreadProps {
  messages: Message[];
  onSend: (subject: string, content: string) => Promise<boolean>;
}

export function MessageThread({ messages, onSend }: MessageThreadProps) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) return;
    
    setSending(true);
    const success = await onSend(subject, content);
    if (success) {
      setSubject("");
      setContent("");
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">Start a conversation with your pharmacist</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isPatient = message.sender_type === "patient";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-3 ${isPatient ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className={isPatient ? "bg-eucalyptus text-white" : "bg-muted"}>
                    {isPatient ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 max-w-[80%] ${isPatient ? "text-right" : ""}`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    isPatient 
                      ? "bg-eucalyptus text-white rounded-tr-none" 
                      : "bg-muted rounded-tl-none"
                  }`}>
                    <p className="font-medium text-sm mb-1">{message.subject}</p>
                    <p className="text-sm opacity-90">{message.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${isPatient ? "mr-2" : "ml-2"}`}>
                    {format(new Date(message.created_at), "MMM d, h:mm a")}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Compose Area */}
      <div className="border-t border-border pt-4 space-y-3">
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded-xl"
        />
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message to the pharmacy..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] rounded-xl resize-none flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !content.trim()}
            className="bg-eucalyptus hover:bg-eucalyptus-dark rounded-xl h-auto"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
