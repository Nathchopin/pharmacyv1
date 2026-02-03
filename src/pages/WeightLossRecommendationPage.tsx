import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Truck, Star, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { WeightLossProjectionChart } from "@/components/weight-loss/WeightLossProjectionChart";

// Images
import wegovySyringe from "@/assets/wegovy-syringe.png";
import mounjaroSyringe from "@/assets/mounjaro-syringe.png";

// Inline Auth Component
function InlineAuth({ email, onEmailChange, onAuthSuccess, initialMode = 'email_check' }: any) {
    const { toast } = useToast();
    const [mode, setMode] = useState<'email_check' | 'login' | 'signup'>(initialMode);
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);

    const checkEmail = async () => {
        if (!email || !email.includes('@')) {
            toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
            return;
        }

        setCheckingEmail(true);
        // Simulate checking email or just move next
        setTimeout(() => {
            setCheckingEmail(false);
            setMode('login');
        }, 500);
    };

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        } else {
            onAuthSuccess();
        }
        setLoading(false);
    };

    const handleSignup = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName, role: 'patient' }
            }
        });

        if (error) {
            toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
        } else {
            if (data.session) {
                onAuthSuccess();
            } else {
                toast({ title: "Check your email", description: "We sent you a verification link." });
            }
        }
        setLoading(false);
    };

    if (mode === 'email_check') {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        className="h-12 text-lg"
                    />
                </div>
                <Button
                    className="w-full h-12 text-lg bg-[#134E4A] hover:bg-[#134E4A]/90"
                    onClick={checkEmail}
                    disabled={checkingEmail}
                >
                    {checkingEmail ? "Checking..." : "Continue"}
                </Button>
            </div>
        );
    }

    if (mode === 'login') {
        return (
            <div className="space-y-4">
                <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>Enter your password to log in. New to Pharmacy? <button onClick={() => setMode('signup')} className="underline font-semibold">Create an account</button></p>
                </div>
                <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12"
                    />
                </div>
                <Button
                    className="w-full h-12 text-lg bg-[#134E4A] hover:bg-[#134E4A]/90"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Log In & Continue"}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setMode('email_check')}>Use a different email</Button>
            </div>
        );
    }

    if (mode === 'signup') {
        return (
            <div className="space-y-4">
                <div className="p-3 bg-green-50 text-green-800 rounded-lg text-sm flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>Creating account for <strong>{email}</strong>. Already have one? <button onClick={() => setMode('login')} className="underline font-semibold">Log in</button></p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-12" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12"
                    />
                </div>
                <Button
                    className="w-full h-12 text-lg bg-[#134E4A] hover:bg-[#134E4A]/90"
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Create Account & Continue"}
                </Button>
            </div>
        );
    }

    return null;
}

export default function WeightLossRecommendationPage() {
    const location = useLocation();
    const { state } = location;

    // Default fallback values if state is missing (e.g. direct access)
    // IMPORTANT: Make sure to parse correct structure or defaults
    const currentWeight = state?.weightData?.current ? Number(state.weightData.current) : 95;
    const initialMedication = state?.medication || 'wegovy';
    const consultationData = state?.consultationData;

    const [selectedMedication, setSelectedMedication] = useState<"wegovy" | "mounjaro">("mounjaro");
    const [authEmail, setAuthEmail] = useState("");
    const { toast } = useToast();

    // Update selected based on quiz if present, but allow override
    useEffect(() => {
        if (initialMedication && (initialMedication === 'wegovy' || initialMedication === 'mounjaro')) {
            setSelectedMedication(initialMedication);
        }
    }, [initialMedication]);

    const handleAuthSuccess = async () => {
        // If we have consultation data from the quiz, save it now that we have a user
        if (consultationData) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from("consultations")
                    .insert({
                        patient_id: user.id,
                        service_type: "weight_loss",
                        status: "pending_review",
                        patient_data: consultationData,
                    });

                if (error) {
                    console.error("Error saving consultation:", error);
                    toast({
                        title: "Error saving data",
                        description: "Please context support or try again.",
                        variant: "destructive"
                    });
                }
            }
        }
        // Navigate
        window.location.href = `/weight-loss/delivery?medication=${selectedMedication}`;
    };

    const content = {
        mounjaro: {
            name: "Mounjaro",
            description: "A dual-action treatment that mimics two natural hormones to regulate hunger and blood sugar. Clinical trials show up to 20% weight loss.",
            image: mounjaroSyringe,
            price: "£249.00",
            clinical_details: "Mounjaro (Tirzepatide) mimics both GIP and GLP-1 hormones, activating receptors in the brain to reduce appetite and improve how the body breaks down sugar and fat. It is currently the most effective weight loss medication available."
        },
        wegovy: {
            name: "Wegovy",
            description: "The gold standard in GLP-1 treatment. Clinically proven to help patients lose ~15% body weight.",
            image: wegovySyringe,
            price: "£199.00",
            clinical_details: "Wegovy (Semaglutide) acts on GLP-1 receptors in the brain to regulate appetite and food intake. It slows down gastric emptying, helping you feel fuller for longer."
        }
    };

    const activeContent = content[selectedMedication];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header / Badge Section - Replaces the Big Title */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="text-xl font-serif font-bold text-[#134E4A] mr-4">Pharmacy</Link>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-medium border border-green-200 animate-pulse">
                            <Check className="w-3.5 h-3.5" />
                            You're Eligible
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground hidden sm:block">
                        Clinical Review Complete
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                    {/* Left Column: Medication, Chart, Details */}
                    <div className="space-y-8">
                        {/* Interactive Toggle */}
                        <div className="bg-white p-1.5 rounded-2xl shadow-sm border inline-flex w-full sm:w-auto">
                            <button
                                onClick={() => setSelectedMedication('mounjaro')}
                                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedMedication === 'mounjaro' ? 'bg-[#134E4A] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Mounjaro
                            </button>
                            <button
                                onClick={() => setSelectedMedication('wegovy')}
                                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedMedication === 'wegovy' ? 'bg-[#134E4A] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Wegovy
                            </button>
                        </div>

                        {/* Hero Image & Description */}
                        <div>
                            <h1 className="text-4xl font-serif font-medium text-[#134E4A] mb-2">{activeContent.name} Plan</h1>
                            <p className="text-xl text-muted-foreground mb-6 max-w-lg">{activeContent.description}</p>

                            <div className="bg-white rounded-3xl p-8 border shadow-sm flex items-center justify-center mb-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50" />
                                <motion.img
                                    key={selectedMedication}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    src={activeContent.image}
                                    alt={activeContent.name}
                                    className="relative z-10 w-[300px] h-auto drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium border shadow-sm text-gray-500">
                                    Actual product packaging
                                </div>
                            </div>

                            {/* Chart Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mb-8"
                            >
                                <WeightLossProjectionChart currentWeight={Number(currentWeight)} medication={selectedMedication} />
                            </motion.div>

                            {/* Clinical Explanation */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-blue-900 mb-2 flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    How it works
                                </h3>
                                <p className="text-blue-800/80 leading-relaxed">
                                    {activeContent.clinical_details}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details & Auth/Checkout */}
                    <div className="space-y-6">
                        {/* What's Included Card */}
                        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-medium mb-6">What's included in your plan</h3>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-600 mt-0.5"><Truck className="w-4 h-4" /></div>
                                    <div>
                                        <p className="font-medium">Free Express Delivery</p>
                                        <p className="text-sm text-muted-foreground">Discreet packaging, fully tracked.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 mt-0.5"><ShieldCheck className="w-4 h-4" /></div>
                                    <div>
                                        <p className="font-medium">Clinical Oversight</p>
                                        <p className="text-sm text-muted-foreground">Regular check-ins with our UK pharmacists.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0 text-purple-600 mt-0.5"><Star className="w-4 h-4" /></div>
                                    <div>
                                        <p className="font-medium">Patient Portal App</p>
                                        <p className="text-sm text-muted-foreground">Track weight, side effects, and reorder easily.</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between items-end mb-1">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Monthly Plan</p>
                                        <p className="text-3xl font-serif font-medium text-[#134E4A]">{activeContent.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs bg-[#134E4A] text-white px-2 py-1 rounded inline-block mb-1">Price Match Guarantee</div>
                                        <p className="text-xs text-muted-foreground">Cancel anytime</p>
                                    </div>
                                </div>
                            </div>

                            {/* Inline Auth */}
                            <div className="border-t pt-6">
                                <h3 className="text-base font-semibold mb-4">Secure Checkout</h3>
                                <InlineAuth
                                    email={authEmail}
                                    onEmailChange={setAuthEmail}
                                    onAuthSuccess={handleAuthSuccess}
                                />
                                <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    Bank-grade 256-bit encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
