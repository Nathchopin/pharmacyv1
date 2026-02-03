
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function ClinicalReviewPage() {
    const { service } = useParams();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-serif font-bold capitalize">
                {service?.replace('_', ' ')} Reviews
            </h1>
            <Card>
                <CardContent className="p-6 text-muted-foreground text-center">
                    Clinical workflow for {service} loaded.
                </CardContent>
            </Card>
        </div>
    )
}
