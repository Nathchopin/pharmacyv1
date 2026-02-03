import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem, HoverTilt, Counter } from "@/components/animations/SlickMotion";
import { Clock, AlertCircle, CheckCircle2, User, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Consultation {
    id: string;
    patient_id: string;
    service_type: string;
    status: string;
    patient_data: any;
    created_at: string;
    assigned_pharmacist_id: string | null;
}

export default function PharmacistDashboardPage() {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            const { data, error } = await supabase
                .from("consultations")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setConsultations(data || []);
        } catch (error) {
            console.error("Error fetching consultations:", error);
        } finally {
            setLoading(false);
        }
    };

    const pendingItems = consultations.filter(c => c.status === "pending_review");
    const inProgressItems = consultations.filter(c => c.status === "in_progress");
    const completedItems = consultations.filter(c => ['approved', 'completed'].includes(c.status));

    const getPriorityColor = (serviceType: string) => {
        switch (serviceType) {
            case 'weight_loss': return 'bg-amber-500/20 text-amber-200 border-amber-500/30';
            case 'travel_clinic': return 'bg-purple-500/20 text-purple-200 border-purple-500/30';
            case 'pharmacy_first': return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
            default: return 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30';
        }
    };

    const ConsultationCard = ({ consultation }: { consultation: Consultation }) => (
        <HoverTilt intensity={5}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <CardTitle className="text-white font-['Playfair_Display'] text-lg">
                                {consultation.service_type.split('_').map(w =>
                                    w.charAt(0).toUpperCase() + w.slice(1)
                                ).join(' ')}
                            </CardTitle>
                            <CardDescription className="text-emerald-200/60 flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(new Date(consultation.created_at), { addSuffix: true })}
                            </CardDescription>
                        </div>
                        <Badge className={getPriorityColor(consultation.service_type)}>
                            {consultation.service_type.replace('_', ' ')}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {/* Patient Info */}
                        <div className="flex items-center gap-2 text-emerald-100/80">
                            <User className="w-4 h-4" />
                            <span className="text-sm">Patient ID: {consultation.patient_id.slice(0, 8)}...</span>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-2">
                            {consultation.status === 'pending_review' && (
                                <>
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span className="text-sm text-amber-200">Awaiting Review</span>
                                </>
                            )}
                            {consultation.status === 'in_progress' && (
                                <>
                                    <AlertCircle className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-blue-200">In Progress</span>
                                </>
                            )}
                            {(consultation.status === 'approved' || consultation.status === 'completed') && (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm text-emerald-200">Completed</span>
                                </>
                            )}
                        </div>

                        {/* Action Button */}
                        <Button
                            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/20"
                            size="sm"
                        >
                            Review Consultation
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </HoverTilt>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white">
                    Clinical Queue
                </h1>
                <p className="text-emerald-200/60">
                    Review and manage patient consultations
                </p>
            </div>

            {/* Stats Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StaggerItem>
                    <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-md border-amber-500/30">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-amber-200/80 text-xs font-medium">
                                Pending Review
                            </CardDescription>
                            <CardTitle className="text-5xl font-['Playfair_Display'] text-white">
                                <Counter to={pendingItems.length} duration={1.5} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-amber-200/60 text-sm">
                                New consultations awaiting your review
                            </p>
                        </CardContent>
                    </Card>
                </StaggerItem>

                <StaggerItem>
                    <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md border-blue-500/30">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-blue-200/80 text-xs font-medium">
                                In Progress
                            </CardDescription>
                            <CardTitle className="text-5xl font-['Playfair_Display'] text-white">
                                <Counter to={inProgressItems.length} duration={1.5} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-blue-200/60 text-sm">
                                Active consultations in review
                            </p>
                        </CardContent>
                    </Card>
                </StaggerItem>

                <StaggerItem>
                    <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-md border-emerald-500/30">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-emerald-200/80 text-xs font-medium">
                                Completed
                            </CardDescription>
                            <CardTitle className="text-5xl font-['Playfair_Display'] text-white">
                                <Counter to={completedItems.length} duration={1.5} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-emerald-200/60 text-sm">
                                Successfully processed today
                            </p>
                        </CardContent>
                    </Card>
                </StaggerItem>
            </StaggerContainer>

            {/* Consultations Grid */}
            <div className="space-y-6">
                {/* Pending */}
                {pendingItems.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-amber-400" />
                            Pending Review
                        </h2>
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingItems.map(consultation => (
                                <StaggerItem key={consultation.id}>
                                    <ConsultationCard consultation={consultation} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                )}

                {/* In Progress */}
                {inProgressItems.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-blue-400" />
                            In Progress
                        </h2>
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {inProgressItems.map(consultation => (
                                <StaggerItem key={consultation.id}>
                                    <ConsultationCard consultation={consultation} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                )}

                {/* Completed */}
                {completedItems.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            Completed
                        </h2>
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {completedItems.slice(0, 6).map(consultation => (
                                <StaggerItem key={consultation.id}>
                                    <ConsultationCard consultation={consultation} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                )}

                {/* Empty State */}
                {consultations.length === 0 && (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardContent className="py-12 text-center">
                            <CheckCircle2 className="w-16 h-16 text-emerald-400/50 mx-auto mb-4" />
                            <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-2">
                                No Consultations
                            </h3>
                            <p className="text-emerald-200/60">
                                All caught up! New consultations will appear here.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
