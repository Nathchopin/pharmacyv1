
import { Card, CardContent } from "@/components/ui/card";

export default function AppointmentPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-serif font-bold">
                Appointments
            </h1>
            <Card>
                <CardContent className="p-6 text-muted-foreground text-center">
                    Calendar / Appointment View
                </CardContent>
            </Card>
        </div>
    )
}
