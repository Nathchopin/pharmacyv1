
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const BRAND_COLOR = "#134E4A";

export default function WeightLossConfirmationPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const sessionId = searchParams.get("session_id");
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setVerifying(false);
                return;
            }

            try {
                // Call our secure Edge Function to finalize the order
                const { error } = await supabase.functions.invoke('verify-payment', {
                    body: { session_id: sessionId }
                });

                if (error) throw error;

                console.log("Payment verified & order finalized.");
            } catch (error) {
                console.error("Verification error:", error);
                // We don't block the UI here, but we log it. 
                // The webhook is the fail-safe.
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full"
                >
                    <Card className="p-8 md:p-12 text-center shadow-lg border-green-100">
                        {/* Animated Checkmark */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                        >
                            <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
                            </motion.div>

                            {/* Ripple Effect */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: [0, 0.5, 0], scale: 1.5 }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                className="absolute inset-0 bg-green-500 rounded-full z-[-1]"
                            />
                        </motion.div>

                        <h1 className="text-3xl font-serif font-bold text-[#134E4A] mb-4">
                            Order Received
                        </h1>

                        <p className="text-muted-foreground mb-8 text-lg">
                            Your subscription has been confirmed. Our clinical team will review your consultation shortly.
                        </p>

                        <div className="bg-[#134E4A]/5 rounded-lg p-6 mb-8 border border-[#134E4A]/10">
                            <h3 className="font-semibold text-[#134E4A] mb-2">What happens next?</h3>
                            <ul className="text-sm text-left space-y-3 text-gray-600">
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#134E4A] text-white flex items-center justify-center text-xs">1</span>
                                    <span>Pharmacist reviews your assessment</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#134E4A] text-white flex items-center justify-center text-xs">2</span>
                                    <span>Prescription issued & validation email sent</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#134E4A] text-white flex items-center justify-center text-xs">3</span>
                                    <span>Medication dispatched via 24h tracked delivery</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <Button
                                className="w-full py-6 text-lg"
                                style={{ backgroundColor: BRAND_COLOR }}
                                onClick={() => navigate('/dashboard')}
                            >
                                Go to My Dashboard
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>

                            {verifying && (
                                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Finalizing order details...
                                </p>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </Layout>
    );
}
