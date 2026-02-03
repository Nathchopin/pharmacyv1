import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  subject: string;
  content: string;
  sender_type: string | null;
  is_read: boolean | null;
  created_at: string;
}

export function useMessages(userId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data as Message[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (subject: string, content: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase.from("messages").insert({
        user_id: userId,
        subject,
        content,
        sender_type: "patient",
        is_read: false,
      });

      if (error) throw error;

      await fetchMessages();
      
      toast({
        title: "Message Sent",
        description: "The clinic will respond within 24 hours.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [userId, fetchMessages, toast]);

  return {
    messages,
    loading,
    refetch: fetchMessages,
    sendMessage,
  };
}
