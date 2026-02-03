import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PHARMACY_SETTINGS } from "@/config/pharmacy-settings";
import { useToast } from "@/hooks/use-toast";

const BRAND_COLOR = "#134E4A";

export default function WeightLossPaymentPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [consultationId, setConsultationId] = useState<string | null>(null);

    const medication = searchParams.get("medication") as "wegovy" | "mounjaro" || "wegovy";

    useEffect(() => {
        checkAuthAndConsultation();
    }, []);

    const checkAuthAndConsultation = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                navigate(`/auth?mode=signup&return=/weight-loss/payment&medication=${medication}`);
                return;
            }

            setUser(user);

            // Fetch the latest pending consultation
            const { data: consultation, error: consultError } = await supabase
                .from("consultations")
                .select("id")
                .eq("patient_id", user.id)
                .eq("service_type", "weight_loss")
                .eq("status", "pending_review")
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (consultError || !consultation) {
                console.error("No consultation found:", consultError);
                // If no consultation, maybe redirect back to start or show error?
                // For now, we'll just let them pay but log it (or critical error)
                // Actually, we NEED consultation_id for the webhook to work.
                toast({
                    title: "Consultation Not Found",
                    description: "Please complete the consultation form first.",
                    variant: "destructive"
                });
                navigate("/weight-loss");
                return;
            }

            setConsultationId(consultation.id);
            setLoading(false);

        } catch (err) {
            console.error("Error checking auth:", err);
            navigate("/auth");
        }
    };

    const handleCheckout = async () => {
        setRedirecting(true);

        try {
            if (!consultationId) {
                throw new Error("No consultation ID");
            }

            const priceId = PHARMACY_SETTINGS.stripe.prices[medication];

            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: {
                    consultation_id: consultationId,
                    price_id: priceId,
                    medication: medication
                }
            });

            if (error) throw error;
            if (!data.url) throw new Error("No checkout URL returned");

            // Redirect to Stripe
            window.location.href = data.url;

        } catch (error: any) {
            console.error("Checkout error details:", error);
            setRedirecting(false);

            // Try to extract a more specific error message
            const errorMessage = error.message || error.toString() || "Could not initialise payment.";

            toast({
                title: "Checkout Error",
                description: `${errorMessage} Please try again or contact support.`,
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 text-[#134E4A] animate-spin mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground">Preparing your checkout...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-[#134E4A]/5 to-background flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-4 pt-32 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <Card className="p-8 md:p-12">
                            {/* Success Icon */}
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-green-600" />
                            </div>

                            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
                                Consultation Approved!
                            </h1>

                            <p className="text-xl text-muted-foreground mb-8">
                                Please confirm your subscription to start your treatment.
                            </p>

                            {/* What's Next */}
                            <div className="bg-gradient-to-br from-[#134E4A]/5 to-[#134E4A]/10 rounded-lg p-6 mb-8 border border-[#134E4A]/20">
                                <h2 className="text-lg font-semibold mb-4 text-left">Subscription Details:</h2>
                                <div className="space-y-3 text-left text-sm">
                                    <div className="flex items-center justify-between font-medium text-base">
                                        <span>Treatment Plan ({medication === "wegovy" ? "Wegovy" : "Mounjaro"})</span>
                                        <span>{medication === "wegovy" ? "£199.00" : "£229.00"} / month</span>
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                        Includes medication, express delivery, and clinical oversight. Cancel anytime.
                                    </p>
                                </div>
                            </div>

                            {/* Redirect Message */}
                            {redirecting ? (
                                <div className="flex items-center justify-center gap-3 text-[#134E4A] mb-6">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <p className="font-medium">Redirecting to secure checkout...</p>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleCheckout}
                                    className="w-full py-6 text-lg text-white mb-4"
                                    style={{ backgroundColor: BRAND_COLOR }}
                                    size="lg"
                                >
                                    Proceed to Secure Payment
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            )}

                            <p className="text-xs text-muted-foreground">
                                🔒 Secure payment powered by Stripe. Your payment information is never stored on our servers.
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
