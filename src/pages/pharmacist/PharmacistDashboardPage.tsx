import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem, Counter } from "@/components/animations/SlickMotion";
import { Clock, AlertCircle, CheckCircle2, User, Calendar, ArrowRight } from "lucide-react";
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
            case 'weight_loss': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'travel_clinic': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'pharmacy_first': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        }
    };

    const ConsultationCard = ({ consultation }: { consultation: Consultation }) => (
        <Card className="bg-white border-border shadow-sm hover:shadow-md transition-all group">
            <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-serif font-medium text-foreground group-hover:text-eucalyptus transition-colors">
                            {consultation.service_type.split('_').map(w =>
                                w.charAt(0).toUpperCase() + w.slice(1)
                            ).join(' ')}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground flex items-center gap-1 mt-1 text-xs">
                            <Calendar className="w-3 h-3" />
                            {formatDistanceToNow(new Date(consultation.created_at), { addSuffix: true })}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className={getPriorityColor(consultation.service_type)}>
                        {consultation.service_type.replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-4">
                    {/* Patient Info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium text-xs">
                            ID
                        </div>
                        <span className="font-medium text-foreground">Patient #{consultation.patient_id.slice(0, 6)}</span>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2 text-sm">
                        {consultation.status === 'pending_review' && (
                            <>
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span className="text-amber-700 font-medium">Awaiting Review</span>
                            </>
                        )}
                        {consultation.status === 'in_progress' && (
                            <>
                                <AlertCircle className="w-4 h-4 text-blue-500" />
                                <span className="text-blue-700 font-medium">In Progress</span>
                            </>
                        )}
                        {(consultation.status === 'approved' || consultation.status === 'completed') && (
                            <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-emerald-700 font-medium">Completed</span>
                            </>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button
                        className="w-full bg-secondary text-secondary-foreground hover:bg-eucalyptus hover:text-white transition-all group/btn"
                        size="sm"
                    >
                        Review Consultation
                        <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-eucalyptus border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold text-foreground">
                    Clinical Queue
                </h1>
                <p className="text-muted-foreground">
                    Review and manage patient consultations
                </p>
            </div>

            {/* Stats Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StaggerItem>
                    <Card className="bg-white border-border shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-amber-600/80 text-xs font-bold uppercase tracking-wider">
                                    Pending Review
                                </span>
                                <span className="text-4xl font-serif font-medium text-foreground">
                                    <Counter to={pendingItems.length} duration={1.5} />
                                </span>
                                <p className="text-muted-foreground text-sm mt-2">
                                    New consultations awaiting
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </StaggerItem>

                <StaggerItem>
                    <Card className="bg-white border-border shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-blue-600/80 text-xs font-bold uppercase tracking-wider">
                                    In Progress
                                </span>
                                <span className="text-4xl font-serif font-medium text-foreground">
                                    <Counter to={inProgressItems.length} duration={1.5} />
                                </span>
                                <p className="text-muted-foreground text-sm mt-2">
                                    Active reviews
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </StaggerItem>

                <StaggerItem>
                    <Card className="bg-white border-border shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-emerald-600/80 text-xs font-bold uppercase tracking-wider">
                                    Completed
                                </span>
                                <span className="text-4xl font-serif font-medium text-foreground">
                                    <Counter to={completedItems.length} duration={1.5} />
                                </span>
                                <p className="text-muted-foreground text-sm mt-2">
                                    Processed today
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </StaggerItem>
            </StaggerContainer>

            {/* Consultations Grid */}
            <div className="space-y-8">
                {/* Pending */}
                {pendingItems.length > 0 && (
                    <div>
                        <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
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
                        <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
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
                        <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
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
                    <Card className="bg-white border-border border-dashed shadow-sm">
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                                All Caught Up
                            </h3>
                            <p className="text-muted-foreground">
                                No new consultations to review.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
