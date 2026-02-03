
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
    const { service } = useParams();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-serif font-bold capitalize">
                {service?.replace('_', ' ')} Orders
            </h1>
            <Card>
                <CardContent className="p-6 text-muted-foreground text-center">
                    {service === 'shop' ? "Shop Orders Fulfillment" : "Travel Clinic Stock Check"}
                </CardContent>
            </Card>
        </div>
    )
}
