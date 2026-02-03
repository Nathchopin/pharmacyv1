import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BRAND_COLOR = "#134E4A";

// Stripe Payment Links
const STRIPE_LINKS = {
    wegovy: "https://buy.stripe.com/00w28te8837C3NgeZ2cV209",
    mounjaro: "https://buy.stripe.com/7sY4gB4xybE81F8dUYcV20a",
};

export default function WeightLossPaymentPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const [user, setUser] = useState<any>(null);

    const medication = searchParams.get("medication") as "wegovy" | "mounjaro" || "wegovy";

    useEffect(() => {
        checkAuthAndRedirect();
    }, []);

    const checkAuthAndRedirect = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                // Not logged in - redirect to auth
                navigate(`/auth?mode=signup&return=/weight-loss/payment&medication=${medication}`);
                return;
            }

            setUser(user);
            setLoading(false);

            // Auto-redirect to Stripe after a short delay
            setTimeout(() => {
                handleStripeRedirect();
            }, 2000);

        } catch (err) {
            console.error("Error checking auth:", err);
            navigate("/auth");
        }
    };

    const handleStripeRedirect = () => {
        setRedirecting(true);

        // Get the Stripe link for the selected medication
        const stripeLink = STRIPE_LINKS[medication];

        // Note: Stripe payment links don't accept custom query parameters
        // Success/cancel URLs must be configured in the Stripe dashboard
        // For now, just redirect to the Stripe link
        window.location.href = stripeLink;
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
                <div className="max-w-2xl mx-auto px-4 py-12">
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
                                Account Created Successfully!
                            </h1>

                            <p className="text-xl text-muted-foreground mb-8">
                                You're moments away from starting your weight loss journey
                            </p>

                            {/* What's Next */}
                            <div className="bg-gradient-to-br from-[#134E4A]/5 to-[#134E4A]/10 rounded-lg p-6 mb-8 border border-[#134E4A]/20">
                                <h2 className="text-lg font-semibold mb-4 text-left">What happens next:</h2>
                                <div className="space-y-3 text-left text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#134E4A] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                                        <p>Complete your secure payment via Stripe (monthly subscription for {medication === "wegovy" ? "Wegovy" : "Mounjaro"})</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#134E4A] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                                        <p>Pharmacist reviews your consultation within 24 hours</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#134E4A] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                                        <p>Once approved, your first delivery ships discreetly to your door</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#134E4A] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
                                        <p>Access your patient portal to track progress, contact your pharmacist, and manage your treatment</p>
                                    </div>
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
                                    onClick={handleStripeRedirect}
                                    className="w-full py-6 text-lg text-white mb-4"
                                    style={{ backgroundColor: BRAND_COLOR }}
                                    size="lg"
                                >
                                    Proceed to Payment
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
