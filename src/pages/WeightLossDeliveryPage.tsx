import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Truck, Store, MapPin, Loader2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BRAND_COLOR = "#134E4A";

// UK Postcode validation regex
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;

// Pharmacy address for pickup
const PHARMACY_ADDRESS = {
    name: "Pharma+ Pharmacy",
    street: "123 High Street",
    city: "London",
    postcode: "SW1A 1AA",
};

export default function WeightLossDeliveryPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [consultation, setConsultation] = useState<any>(null);

    const medication = searchParams.get("medication") as "wegovy" | "mounjaro" || "wegovy";
    const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");

    // Delivery form fields
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [postcode, setPostcode] = useState("");

    useEffect(() => {
        checkAuthAndLoadData();
    }, []);

    const checkAuthAndLoadData = async () => {
        try {
            // Check if user is authenticated
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                // Not logged in - redirect to auth
                navigate(`/auth?mode=signup&return=/weight-loss/delivery&medication=${medication}`);
                return;
            }

            setUser(user);

            // Load consultation data
            const { data: consultationData, error: consultationError } = await supabase
                .from("consultations")
                .select("*")
                .eq("patient_id", user.id)
                .eq("service_type", "weight_loss")
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (consultationError && consultationError.code !== "PGRST116") {
                throw consultationError;
            }

            setConsultation(consultationData);

            // Pre-fill if data exists
            if (consultationData?.patient_data) {
                const patientData = consultationData.patient_data as any;
                if (patientData?.delivery_preference) {
                    setDeliveryMethod(patientData.delivery_preference);
                    if (patientData.delivery_address) {
                        setStreet(patientData.delivery_address.street || "");
                        setCity(patientData.delivery_address.city || "");
                        setPostcode(patientData.delivery_address.postcode || "");
                    }
                }
            }

        } catch (err) {
            console.error("Error loading data:", err);
            toast({
                title: "Error",
                description: "Failed to load your information. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (deliveryMethod === "delivery") {
            if (!street.trim()) {
                toast({
                    title: "Missing Address",
                    description: "Please enter your street address.",
                    variant: "destructive",
                });
                return false;
            }
            if (!city.trim()) {
                toast({
                    title: "Missing City",
                    description: "Please enter your city.",
                    variant: "destructive",
                });
                return false;
            }
            if (!postcode.trim()) {
                toast({
                    title: "Missing Postcode",
                    description: "Please enter your postcode.",
                    variant: "destructive",
                });
                return false;
            }
            if (!UK_POSTCODE_REGEX.test(postcode.trim())) {
                toast({
                    title: "Invalid Postcode",
                    description: "Please enter a valid UK postcode (e.g., SW1A 1AA).",
                    variant: "destructive",
                });
                return false;
            }
        }
        return true;
    };

    const handleContinue = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            // Prepare delivery data
            const deliveryData = {
                delivery_preference: deliveryMethod,
                ...(deliveryMethod === "delivery" && {
                    delivery_address: {
                        street: street.trim(),
                        city: city.trim(),
                        postcode: postcode.trim().toUpperCase(),
                    },
                }),
            };

            // Update or create consultation
            if (consultation) {
                // Update existing consultation
                const { error } = await supabase
                    .from("consultations")
                    .update({
                        patient_data: {
                            ...consultation.patient_data,
                            ...deliveryData,
                        },
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", consultation.id);

                if (error) throw error;
            } else {
                // Create new consultation
                const { error } = await supabase
                    .from("consultations")
                    .insert({
                        patient_id: user.id,
                        service_type: "weight_loss",
                        status: "pending_review",
                        patient_data: {
                            medication_preference: medication,
                            ...deliveryData,
                        },
                    });

                if (error) throw error;
            }

            toast({
                title: "Delivery preference saved!",
                description: "Proceeding to payment...",
            });

            // Redirect to payment
            setTimeout(() => {
                navigate(`/weight-loss/payment?medication=${medication}`);
            }, 500);

        } catch (err) {
            console.error("Error saving delivery data:", err);
            toast({
                title: "Error",
                description: "Failed to save delivery information. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 text-[#134E4A] animate-spin mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-[#134E4A]/5 to-background">
                <div className="max-w-2xl mx-auto px-4 py-12">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">
                            Delivery Options
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Choose how you'd like to receive your medication
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="p-8">
                            {/* Delivery Method Selection */}
                            <RadioGroup value={deliveryMethod} onValueChange={(v) => setDeliveryMethod(v as "delivery" | "pickup")}>
                                <div className="space-y-4 mb-8">
                                    {/* Delivery Option */}
                                    <div
                                        className={`flex items-start gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all ${deliveryMethod === "delivery"
                                            ? "border-[#134E4A] bg-[#134E4A]/5"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() => setDeliveryMethod("delivery")}
                                    >
                                        <RadioGroupItem value="delivery" id="delivery" />
                                        <div className="flex-1">
                                            <Label htmlFor="delivery" className="flex items-center gap-2 text-lg font-semibold cursor-pointer">
                                                <Truck className="w-5 h-5" />
                                                Free Delivery
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Discreet packaging delivered to your door within 2-3 business days
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pickup Option */}
                                    <div
                                        className={`flex items-start gap-4 p-6 rounded-lg border-2 cursor-pointer transition-all ${deliveryMethod === "pickup"
                                            ? "border-[#134E4A] bg-[#134E4A]/5"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() => setDeliveryMethod("pickup")}
                                    >
                                        <RadioGroupItem value="pickup" id="pickup" />
                                        <div className="flex-1">
                                            <Label htmlFor="pickup" className="flex items-center gap-2 text-lg font-semibold cursor-pointer">
                                                <Store className="w-5 h-5" />
                                                Pharmacy Pickup
                                            </Label>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Collect from our pharmacy location
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </RadioGroup>

                            {/* Delivery Address Form */}
                            {deliveryMethod === "delivery" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 mb-6"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-5 h-5 text-[#134E4A]" />
                                        <h3 className="text-lg font-semibold">Delivery Address</h3>
                                    </div>

                                    <div>
                                        <Label htmlFor="street">Street Address *</Label>
                                        <Input
                                            id="street"
                                            placeholder="123 Main Street"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            placeholder="London"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="postcode">Postcode *</Label>
                                        <Input
                                            id="postcode"
                                            placeholder="SW1A 1AA"
                                            value={postcode}
                                            onChange={(e) => setPostcode(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Pharmacy Address */}
                            {deliveryMethod === "pickup" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 p-6 bg-gray-50 rounded-lg"
                                >
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Store className="w-5 h-5 text-[#134E4A]" />
                                        Pickup Location
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        <p className="font-medium">{PHARMACY_ADDRESS.name}</p>
                                        <p>{PHARMACY_ADDRESS.street}</p>
                                        <p>{PHARMACY_ADDRESS.city}</p>
                                        <p className="font-medium">{PHARMACY_ADDRESS.postcode}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        We'll notify you when your medication is ready for collection
                                    </p>
                                </motion.div>
                            )}

                            {/* Continue Button */}
                            <Button
                                onClick={handleContinue}
                                disabled={saving}
                                className="w-full py-6 text-lg text-white"
                                style={{ backgroundColor: BRAND_COLOR }}
                                size="lg"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Continue to Payment
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground mt-4">
                                🔒 Your information is encrypted and secure
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
