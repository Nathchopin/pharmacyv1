import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { MessageThread } from "@/components/portal/widgets/MessageThread";
import { useMessages } from "@/hooks/useMessages";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const { messages, loading, sendMessage } = useMessages(userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      setAuthChecking(false);
    };

    checkAuth();
  }, [navigate]);

  if (authChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portal-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-eucalyptus border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <PortalLayout>
      <div className="p-4 lg:p-8 h-[calc(100vh-56px-64px)] lg:h-screen flex flex-col">
        {/* Header */}
        <motion.div
          className="mb-4 lg:mb-6 shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-2xl lg:text-3xl font-medium text-foreground mb-1 lg:mb-2">
            Messages
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Communicate securely with your pharmacy team
          </p>
        </motion.div>

        {/* Message Container */}
        <motion.div
          className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-border/50 flex-1 flex flex-col min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 p-4 lg:p-6 border-b border-border shrink-0">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-eucalyptus-muted flex items-center justify-center">
              <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-eucalyptus" />
            </div>
            <div>
              <h3 className="font-medium text-sm lg:text-base text-foreground">Pharmacy Team</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Usually responds within 24 hours</p>
            </div>
          </div>

          <div className="p-4 lg:p-6 flex-1 min-h-0">
            <MessageThread 
              messages={messages}
              onSend={sendMessage}
            />
          </div>
        </motion.div>
      </div>
    </PortalLayout>
  );
}
