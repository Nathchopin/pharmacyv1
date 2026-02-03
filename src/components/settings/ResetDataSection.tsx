import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface ResetDataSectionProps {
  userId: string;
}

export function ResetDataSection({ userId }: ResetDataSectionProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleResetData = async () => {
    if (confirmText !== "RESET") return;

    setIsResetting(true);

    try {
      // Delete all user data from various tables
      const deleteOperations = [
        supabase.from("biomarkers").delete().eq("user_id", userId),
        supabase.from("health_data").delete().eq("user_id", userId),
        supabase.from("treatment_checkins").delete().eq("user_id", userId),
        supabase.from("messages").delete().eq("user_id", userId),
        supabase.from("lab_uploads").delete().eq("user_id", userId),
        supabase.from("ai_recommendations_cache").delete().eq("user_id", userId),
      ];

      // Execute all deletions in parallel
      const results = await Promise.all(deleteOperations);

      // Check for errors
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        throw new Error("Failed to delete some data");
      }

      // Reset profile to initial state (keep user_id and basic info)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          height_cm: null,
          current_weight_kg: null,
          target_weight_kg: null,
          date_of_birth: null,
          activity_level: null,
          health_score: 75,
          onboarding_completed: false,
          nhs_number: null,
        })
        .eq("user_id", userId);

      if (profileError) throw profileError;

      // Delete files from storage
      const { data: files } = await supabase.storage
        .from("lab-results")
        .list(userId);

      if (files && files.length > 0) {
        const filePaths = files.map((f) => `${userId}/${f.name}`);
        await supabase.storage.from("lab-results").remove(filePaths);
      }

      toast({
        title: "Data Reset Complete",
        description: "All your data has been cleared. Redirecting to onboarding...",
      });

      setDialogOpen(false);

      // Navigate to onboarding
      setTimeout(() => {
        navigate("/onboarding");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
      setConfirmText("");
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border-2 border-destructive/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-medium text-sm lg:text-base text-foreground">Danger Zone</h3>
          <p className="text-[10px] lg:text-xs text-muted-foreground">Irreversible actions</p>
        </div>
      </div>

      <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-sm text-foreground">Reset All Data</p>
            <p className="text-xs text-muted-foreground">
              Delete all your health data, lab results, and restart the onboarding process
            </p>
          </div>

          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="shrink-0 rounded-lg"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <AlertDialogTitle className="text-center">
                  Reset All Your Data?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  This action <strong>cannot be undone</strong>. This will permanently delete:
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="bg-destructive/5 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span>All lab results and biomarker data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span>Weight history and health metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span>Treatment check-ins and streaks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span>All uploaded documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span>Messages and conversation history</span>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <p className="text-sm text-muted-foreground text-center">
                  Type <strong className="text-foreground">RESET</strong> to confirm
                </p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Type RESET to confirm"
                  className="text-center font-mono"
                />
              </div>

              <AlertDialogFooter className="sm:justify-center gap-2 mt-2">
                <AlertDialogCancel className="rounded-xl" disabled={isResetting}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={handleResetData}
                  disabled={confirmText !== "RESET" || isResetting}
                  className="rounded-xl"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset Everything
                    </>
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}
