import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Shield, Loader2, Mail, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import heroImage from "@/assets/auth-pharmacist-hero.png";

type SignupStep = "form" | "otp";
type SignupMethod = "email" | "phone";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [signupStep, setSignupStep] = useState<SignupStep>("form");
  const [signupMethod, setSignupMethod] = useState<SignupMethod>("email");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get return URL and medication from query params
    const params = new URLSearchParams(window.location.search);
    const returnPath = params.get('return');
    const medication = params.get('medication');

    // Build return URL with medication if present
    let returnUrl = returnPath || '/dashboard';
    if (returnPath && medication) {
      returnUrl = `${returnPath}?medication=${medication}`;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Check user role - this is a PATIENT-ONLY portal
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'pharmacist' || profile?.role === 'admin') {
          // Pharmacist/Admin trying to use patient portal - sign them out
          await supabase.auth.signOut();
          toast({
            title: "Wrong Portal",
            description: "This is the patient portal. Please use the pharmacist login at /pharmacist/login",
            variant: "destructive",
          });
          return;
        }

        // User is a patient, proceed with redirect
        navigate(returnUrl);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Check user role for existing session
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'pharmacist' || profile?.role === 'admin') {
          // Pharmacist/Admin - redirect to their portal
          navigate('/pharmacist');
          return;
        }

        navigate(returnUrl);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const formatPhoneForSupabase = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\s/g, "");
    return `+44${cleaned}`;
  };

  // Email signup - creates account directly
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Phone signup - sends OTP first
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (phone.replace(/\s/g, "").length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid UK phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneForSupabase(phone);
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast({
        title: "Code sent!",
        description: "Check your phone for the verification code.",
      });
      setSignupStep("otp");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Phone signup - verify OTP and create account
  const handleVerifyOTP = async (code: string) => {
    setLoading(true);
    try {
      const formattedPhone = formatPhoneForSupabase(phone);

      // Verify the OTP - this creates the phone-based account
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: code,
        type: "sms",
      });

      if (verifyError) throw verifyError;

      // Update user metadata with name
      if (data.user) {
        await supabase.auth.updateUser({
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        });
      }

      toast({
        title: "Account created!",
        description: "Welcome to your health portal.",
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const formattedPhone = formatPhoneForSupabase(phone);
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Code resent!",
      description: "Check your phone for the new code.",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Check if user is a patient
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'pharmacist' || profile?.role === 'admin') {
          // Sign them out immediately
          await supabase.auth.signOut();
          toast({
            title: "Wrong Portal",
            description: "This is the patient portal. Pharmacists should use /pharmacist/login",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSignupStep("form");
    setSignupMethod("email");
    setPhone("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex">
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src={heroImage}
          alt="Healthcare professional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-eucalyptus-dark/90 via-eucalyptus/80 to-eucalyptus-light/70" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <motion.h1
              className="font-serif text-4xl font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Your Health, <br />
              Your Control
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Access your complete health journey in one secure place. Track
              treatments, view results, and connect with your care team.
            </motion.p>
          </div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">End-to-End Encryption</p>
                <p className="text-white/60 text-sm">
                  Your data is protected at every step
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">GPhC Registered</p>
                <p className="text-white/60 text-sm">
                  Pharmacy Registration: 9011982
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-background"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-serif text-2xl text-eucalyptus font-medium">
              PHARMA +
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* OTP Verification Step */}
            {!isLogin && signupStep === "otp" ? (
              <OTPVerification
                phone={phone}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                onBack={() => setSignupStep("form")}
                loading={loading}
              />
            ) : (
              <>
                <h2 className="font-serif text-3xl font-medium mb-2">
                  {isLogin ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {isLogin
                    ? "Sign in to access your patient portal"
                    : "Join thousands managing their health"}
                </p>

                {/* Social Login Buttons */}
                <div className="space-y-3 mb-8">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 hover:bg-secondary transition-all"
                    onClick={() => handleSocialLogin("google")}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 hover:bg-secondary transition-all"
                    onClick={() => handleSocialLogin("apple")}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Continue with Apple
                  </Button>
                </div>

                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground">
                      or continue with email
                    </span>
                  </div>
                </div>

                {/* Login Form */}
                {isLogin ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <FloatingInput
                      id="email"
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <FloatingInput
                      id="password"
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      showToggle
                      isPassword
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-eucalyptus hover:text-eucalyptus-light transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl bg-eucalyptus hover:bg-eucalyptus-light text-white font-medium transition-all"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                ) : (
                  /* Signup Form with method toggle */
                  <div className="space-y-6">
                    {/* Method Toggle */}
                    <Tabs value={signupMethod} onValueChange={(v) => setSignupMethod(v as SignupMethod)} className="w-full">
                      <TabsList className="w-full grid grid-cols-2 h-12 rounded-xl bg-muted p-1">
                        <TabsTrigger
                          value="email"
                          className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </TabsTrigger>
                        <TabsTrigger
                          value="phone"
                          className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
                        >
                          <Smartphone className="w-4 h-4" />
                          Phone
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {signupMethod === "email" ? (
                      /* Email Signup Form */
                      <form onSubmit={handleEmailSignup} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FloatingInput
                            id="firstName"
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          <FloatingInput
                            id="lastName"
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                        <FloatingInput
                          id="email"
                          label="Email Address"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <FloatingInput
                          id="password"
                          label="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          showToggle
                          isPassword
                        />
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-12 rounded-xl bg-eucalyptus hover:bg-eucalyptus-light text-white font-medium transition-all"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </form>
                    ) : (
                      /* Phone Signup Form */
                      <form onSubmit={handleSendOTP} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FloatingInput
                            id="firstName"
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          <FloatingInput
                            id="lastName"
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                        <PhoneInput
                          id="phone"
                          label="Mobile Number"
                          value={phone}
                          onChange={setPhone}
                        />
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-12 rounded-xl bg-eucalyptus hover:bg-eucalyptus-light text-white font-medium transition-all"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Send Verification Code"
                          )}
                        </Button>
                      </form>
                    )}
                  </div>
                )}

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-eucalyptus" />
                  <span>Secure NHS-Level Encryption</span>
                </div>

                {/* Toggle Login/Signup */}
                <p className="mt-8 text-center text-sm text-muted-foreground">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      resetForm();
                    }}
                    className="text-eucalyptus hover:text-eucalyptus-light font-medium transition-colors"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
