import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { StaggerContainer, StaggerItem } from "@/components/animations/SlickMotion";
import { format } from "date-fns";
import { Clock, MapPin, User, Video, CheckCircle2, XCircle, Stethoscope } from "lucide-react";

export default function AppointmentPage() {
    const { service } = useParams();
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Mock data - replace with DB fetch
    const appointments = [
        {
            id: 1,
            patient: "Sarah Connor",
            time: "09:30 AM",
            type: "Blood Test",
            subtype: "Comprehensive Panel",
            status: "confirmed",
            mode: "In-Person"
        },
        {
            id: 2,
            patient: "John Wick",
            time: "11:00 AM",
            type: "Pharmacy First",
            subtype: "UTI Consultation",
            status: "pending",
            mode: "Video"
        },
        {
            id: 3,
            patient: "Ellen Ripley",
            time: "02:15 PM",
            type: "Blood Test",
            subtype: "Hormone Profile",
            status: "confirmed",
            mode: "In-Person"
        }
    ];

    const filteredAppointments = service
        ? appointments.filter(a => a.type.toLowerCase().replace(" ", "_") === service || (service === 'blood_tests' && a.type === 'Blood Test'))
        : appointments;

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
            {/* Left Column: Calendar & Filters */}
            <div className="w-full md:w-80 flex flex-col gap-6">
                <Card>
                    <CardContent className="p-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="cursor-pointer hover:bg-zinc-200">All</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-zinc-100">Confirmed</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-zinc-100">Pending</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Schedule */}
            <div className="flex-1 overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-serif font-bold">
                        {date ? format(date, "EEEE, MMMM do, yyyy") : "Select a date"}
                    </h1>
                    <p className="text-muted-foreground">
                        {filteredAppointments.length} appointments scheduled
                    </p>
                </div>

                <StaggerContainer className="space-y-4">
                    {filteredAppointments.map((apt) => (
                        <StaggerItem key={apt.id}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-eucalyptus">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-zinc-50 rounded-lg border border-zinc-100">
                                            <span className="text-xs font-bold text-muted-foreground uppercase">
                                                {apt.time.split(" ")[1]}
                                            </span>
                                            <span className="text-xl font-mono font-medium text-foreground">
                                                {apt.time.split(" ")[0]}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-lg text-foreground flex items-center gap-2">
                                                {apt.patient}
                                                <Badge variant={apt.status === 'confirmed' ? "default" : "secondary"} className="text-[10px] h-5">
                                                    {apt.status}
                                                </Badge>
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Stethoscope className="w-3.5 h-3.5" />
                                                    {apt.type} - {apt.subtype}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    {apt.mode === 'Video' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                                                    {apt.mode}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Check In
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-red-50">
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    ))}

                    {filteredAppointments.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-zinc-50/50 rounded-xl border border-dashed">
                            No appointments found for this date.
                        </div>
                    )}
                </StaggerContainer>
            </div>
        </div>
    );
}
