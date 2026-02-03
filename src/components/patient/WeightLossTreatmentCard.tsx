import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Package,
    MessageCircle,
    TrendingUp,
    Pill,
    ClipboardList,
    ChevronRight,
    Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WeightLossTreatmentCardProps {
    consultation: any;
    subscription?: any;
}

export function WeightLossTreatmentCard({ consultation, subscription }: WeightLossTreatmentCardProps) {
    const navigate = useNavigate();

    // Extract patient data
    const patientData = consultation?.patient_data || {};
    const medication = patientData.medication_preference || "wegovy";
    const bmi = patientData.bmi;
    const startingWeight = patientData.weight_kg;

    // Dosage progression for Wegovy (simplified)
    const wegovyDosages = [
        { week: "1-4", dose: "0.25mg", color: "bg-blue-100 text-blue-800" },
        { week: "5-8", dose: "0.5mg", color: "bg-blue-200 text-blue-900" },
        { week: "9-12", dose: "1.0mg", color: "bg-blue-300 text-blue-900" },
        { week: "13-16", dose: "1.7mg", color: "bg-blue-400 text-white" },
        { week: "17+", dose: "2.4mg", color: "bg-blue-500 text-white" },
    ];

    const mounjaroDosages = [
        { week: "1-4", dose: "2.5mg", color: "bg-purple-100 text-purple-800" },
        { week: "5-8", dose: "5mg", color: "bg-purple-200 text-purple-900" },
        { week: "9-12", dose: "7.5mg", color: "bg-purple-300 text-purple-900" },
        { week: "13-16", dose: "10mg", color: "bg-purple-400 text-white" },
        { week: "17+", dose: "15mg", color: "bg-purple-500 text-white" },
    ];

    const dosageProgression = medication === "mounjaro" ? mounjaroDosages : wegovyDosages;
    const medicationName = medication === "mounjaro" ? "Mounjaro" : "Wegovy";

    // Status badge
    const statusColors = {
        pending_review: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        active: "bg-blue-100 text-blue-800",
        rejected: "bg-red-100 text-red-800",
    };

    const status = consultation?.status || "pending_review";

    return (
        <Card className="p-6 bg-gradient-to-br from-[#134E4A]/5 to-white border-[#134E4A]/20">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-[#134E4A] rounded-lg flex items-center justify-center">
                            <Pill className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Weight Loss Treatment</h3>
                            <p className="text-sm text-muted-foreground">{medicationName}</p>
                        </div>
                    </div>
                </div>
                <Badge className={statusColors[status as keyof typeof statusColors]}>
                    {status === "pending_review" && "Pending Review"}
                    {status === "approved" && "Approved"}
                    {status === "active" && "Active"}
                    {status === "rejected" && "Not Approved"}
                </Badge>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-white rounded-lg border">
                    <p className="text-2xl font-bold text-[#134E4A]">{startingWeight}kg</p>
                    <p className="text-xs text-muted-foreground">Starting Weight</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                    <p className="text-2xl font-bold text-[#134E4A]">{bmi}</p>
                    <p className="text-xs text-muted-foreground">BMI</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                    <p className="text-2xl font-bold text-[#134E4A]">Week 1</p>
                    <p className="text-xs text-muted-foreground">Current Phase</p>
                </div>
            </div>

            {/* Dosage Progression */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Your Treatment Plan
                </h4>
                <div className="space-y-2">
                    {dosageProgression.map((phase, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg ${index === 0 ? "border-2 border-[#134E4A] bg-[#134E4A]/5" : "bg-gray-50"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {index === 0 && <Check className="w-4 h-4 text-[#134E4A]" />}
                                <div>
                                    <p className="text-sm font-medium">Week {phase.week}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {index === 0 ? "Current phase" : "Upcoming"}
                                    </p>
                                </div>
                            </div>
                            <Badge className={phase.color}>{phase.dose}</Badge>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/messages")}
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Pharmacist
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/progress")}
                >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Track Progress
                </Button>
            </div>

            {/* Status Message */}
            {status === "pending_review" && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900">
                        <strong>⏱️ Awaiting Pharmacist Review</strong>
                        <br />
                        Your consultation is being reviewed by our pharmacy team. You'll receive an update within 24 hours.
                    </p>
                </div>
            )}

            {status === "approved" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-900">
                        <strong>✅ Treatment Approved!</strong>
                        <br />
                        Your first delivery is being prepared and will ship within 2-3 business days.
                    </p>
                </div>
            )}

            {status === "active" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-sm text-blue-900 font-medium">Next Delivery</p>
                        <p className="text-xs text-blue-700">Estimated: Feb 28, 2026</p>
                    </div>
                    <Package className="w-5 h-5 text-blue-600" />
                </div>
            )}
        </Card>
    );
}
