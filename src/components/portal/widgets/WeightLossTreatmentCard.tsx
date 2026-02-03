import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, Package, Calendar, MessageCircle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

import wegovySyringe from "@/assets/wegovy-syringe.png";
import mounjaroSyringe from "@/assets/mounjaro-syringe.png";

export function WeightLossTreatmentCard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [consultation, setConsultation] = useState<any>(null);

    useEffect(() => {
        loadConsultation();
    }, []);

    const loadConsultation = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("consultations")
                .select("*")
                .eq("patient_id", user.id)
                .eq("service_type", "weight_loss")
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== "PGRST116") throw error;
            setConsultation(data);
        } catch (err) {
            console.error("Error loading consultation:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="p-6 flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 text-[#134E4A] animate-spin" />
            </Card>
        );
    }

    if (!consultation) return null;

    const medication = consultation.patient_data?.medication_preference || "wegovy";
    const image = medication === "mounjaro" ? mounjaroSyringe : wegovySyringe;
    const name = medication === "mounjaro" ? "Mounjaro" : "Wegovy";

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return "bg-green-100 text-green-800 border-green-200";
            case 'rejected': return "bg-red-100 text-red-800 border-red-200";
            case 'completed': return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved': return "Active Treatment";
            case 'pending_review': return "In Review";
            case 'rejected': return "Consultation Rejected";
            case 'needs_more_info': return "Information Needed";
            default: return status.replace('_', ' ');
        }
    };

    const isPending = consultation.status === 'pending_review';

    return (
        <Card className="overflow-hidden border-2 border-[#134E4A]/10 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-gradient-to-r from-[#134E4A]/10 to-transparent p-6 pb-0">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="outline" className={`mb-2 capitalize ${getStatusColor(consultation.status)}`}>
                            {getStatusLabel(consultation.status)}
                        </Badge>
                        <h3 className="text-xl font-serif font-medium text-[#134E4A]">
                            {name} Treatment
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Monthly Subscription
                        </p>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                        <img src={image} alt={name} className="w-16 h-16 object-contain" />
                    </div>
                </div>
            </div>

            <div className="p-6">
                {isPending ? (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-yellow-900 flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4" />
                            Pharmacist Reviewing
                        </h4>
                        <p className="text-sm text-yellow-800/80">
                            Your consultation is being reviewed by our clinical team. You'll receive a notification once approved (usually within 24 hours).
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Next Refill</span>
                            <span className="font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Nov 12
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Dosage</span>
                            <span className="font-medium">0.25 mg</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => navigate('/dashboard/messages')}
                    >
                        <span className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-[#134E4A]" />
                            Message Pharmacist
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Button>

                    <Button
                        className="w-full justify-between bg-[#134E4A] hover:bg-[#134E4A]/90 text-white"
                        onClick={() => navigate('/dashboard/treatment')}
                    >
                        <span className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Manage Treatment
                        </span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
