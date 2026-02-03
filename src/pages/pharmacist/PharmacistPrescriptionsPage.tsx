import { PharmacistLayout } from "@/components/pharmacist/PharmacistLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PharmacistPrescriptionsPage() {
    return (
        <PharmacistLayout>
            <div className="p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Prescriptions</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Prescription Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-600">Prescription review and approval system coming soon...</p>
                    </CardContent>
                </Card>
            </div>
        </PharmacistLayout>
    );
}
