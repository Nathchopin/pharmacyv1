
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, AlertTriangle, User, Calendar, FileText, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    consultation: any | null; // Typed loosely for now, should be Consultation
    onStatusChange: () => void; // Trigger refresh
}

export function UniversalDetailDrawer({ open, onClose, consultation, onStatusChange }: DrawerProps) {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    if (!consultation) return null;

    const handleAction = async (decision: 'approve' | 'reject') => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('handle-clinical-decision', {
                body: {
                    consultation_id: consultation.id,
                    decision: decision,
                    reason: notes
                }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            toast({
                title: decision === 'approve' ? "Consultation Approved" : "Consultation Rejected",
                description: "The patient has been notified.",
                variant: decision === 'approve' ? "default" : "destructive",
            });
            onStatusChange();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error.message || "Failed to update status",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="capitalize">
                            {consultation.service_type?.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(consultation.created_at), { addSuffix: true })}
                        </span>
                    </div>
                    <SheetTitle className="text-2xl font-serif">Clinical Review</SheetTitle>
                    <SheetDescription>
                        Review patient data and make a clinical decision.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8">
                    {/* Patient Summary */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-eucalyptus" />
                            Patient Profile
                        </h3>
                        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Patient ID:</span>
                                <span className="font-mono">{consultation.patient_id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Current Status:</span>
                                <span className="capitalize font-medium">{consultation.status.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Data */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <Activity className="w-4 h-4 text-eucalyptus" />
                            Clinical Data
                        </h3>
                        {/* Dynamic Rendering of JSON Data */}
                        <div className="bg-white border rounded-lg overflow-hidden">
                            {Object.entries(consultation.patient_data || {}).map(([key, value], index) => (
                                <div key={key} className={`flex flex-col sm:flex-row sm:justify-between p-3 text-sm ${index !== 0 ? 'border-t' : ''}`}>
                                    <span className="font-medium text-muted-foreground capitalize mb-1 sm:mb-0">
                                        {key.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-foreground font-medium sm:text-right">
                                        {String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pharmacist Notes */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4 text-eucalyptus" />
                            Pharmacist Notes
                        </h3>
                        <Textarea
                            placeholder="Add clinical notes, rationale for rejection, or advice..."
                            className="min-h-[120px]"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <SheetFooter className="mt-8 gap-4 sm:gap-2 flex-col sm:flex-row">
                    <Button
                        variant="destructive"
                        onClick={() => handleAction('reject')}
                        disabled={loading || consultation.status !== 'pending_review'}
                        className="w-full sm:w-auto"
                    >
                        {loading ? "Processing..." : (
                            <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={() => handleAction('approve')}
                        disabled={loading || consultation.status !== 'pending_review'}
                        className="w-full sm:w-auto bg-eucalyptus hover:bg-eucalyptus/90 text-white"
                    >
                        {loading ? "Processing..." : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Approve
                            </>
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
