import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StaggerContainer, StaggerItem } from "@/components/animations/SlickMotion";
import { formatDistanceToNow } from "date-fns";
import { Clock, AlertCircle, CheckCircle2, Calendar, ArrowRight, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UniversalDetailDrawer } from "@/components/pharmacist/UniversalDetailDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Consultation {
    id: string;
    patient_id: string;
    service_type: string;
    status: string;
    patient_data: any;
    created_at: string;
    assigned_pharmacist_id: string | null;
}

export default function ClinicalReviewPage() {
    const { service } = useParams();
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

    useEffect(() => {
        if (service) fetchConsultations();
    }, [service]);

    const fetchConsultations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("consultations")
                .select("*")
                .eq("service_type", service)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setConsultations(data || []);
        } catch (error) {
            console.error("Error fetching consultations:", error);
        } finally {
            setLoading(false);
        }
    };

    // ... existing imports

    const getPriorityColor = (status: string) => {
        switch (status) {
            case 'pending_review': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'active_subscription': return 'bg-green-100 text-green-800 border-green-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'canceled': return 'bg-zinc-100 text-zinc-800 border-zinc-200';
            default: return 'bg-zinc-100 text-zinc-800 border-zinc-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-eucalyptus border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const pendingConsultations = consultations.filter(c => c.status === 'pending_review');
    const activeConsultations = consultations.filter(c => ['active', 'active_subscription', 'in_progress'].includes(c.status));
    const archivedConsultations = consultations.filter(c => ['rejected', 'canceled', 'completed'].includes(c.status));

    const ConsultationList = ({ items }: { items: Consultation[] }) => {
        if (items.length === 0) {
            return (
                <Card className="bg-white border-border border-dashed shadow-sm">
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                            No Consultations
                        </h3>
                        <p className="text-muted-foreground">
                            There are no consultations in this category.
                        </p>
                    </CardContent>
                </Card>
            );
        }

        return (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((consultation) => (
                    <StaggerItem key={consultation.id}>
                        <Card
                            className="bg-white border-border shadow-sm hover:shadow-md transition-all group cursor-pointer"
                            onClick={() => setSelectedConsultation(consultation)}
                        >
                            <CardHeader className="pb-3 border-b border-border/50">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-serif font-medium text-foreground group-hover:text-eucalyptus transition-colors">
                                            Patient Review
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground flex items-center gap-1 mt-1 text-xs">
                                            <Calendar className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(consultation.created_at), { addSuffix: true })}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className={getPriorityColor(consultation.status)}>
                                        {consultation.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium text-xs">
                                            ID
                                        </div>
                                        <span className="font-medium text-foreground">Patient #{consultation.patient_id.slice(0, 6)}</span>
                                    </div>

                                    {/* Dynamic Data Preview based on Service */}
                                    <div className="bg-zinc-50 p-3 rounded-md text-xs font-mono text-muted-foreground">
                                        {JSON.stringify(consultation.patient_data, null, 2).slice(0, 100)}...
                                    </div>

                                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-eucalyptus hover:text-white transition-all group/btn" size="sm">
                                        Review Details
                                        <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold text-foreground capitalize">
                    {service?.replace('_', ' ')} Reviews
                </h1>
                <p className="text-muted-foreground">
                    Manage {service?.replace('_', ' ')} consultations and approvals.
                </p>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="pending">Pending Review</TabsTrigger>
                    <TabsTrigger value="active">Active Patients</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    <ConsultationList items={pendingConsultations} />
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                    <ConsultationList items={activeConsultations} />
                </TabsContent>

                <TabsContent value="archived" className="mt-6">
                    <ConsultationList items={archivedConsultations} />
                </TabsContent>
            </Tabs>

            <UniversalDetailDrawer
                open={!!selectedConsultation}
                onClose={() => setSelectedConsultation(null)}
                consultation={selectedConsultation}
                onStatusChange={fetchConsultations}
            />
        </div>
    );
}
