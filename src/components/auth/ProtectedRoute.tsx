import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole: "patient" | "pharmacist" | "admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if user is logged in
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    console.error("No session found:", sessionError);
                    navigate("/auth");
                    return;
                }

                // Fetch user profile to check role
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("user_id", session.user.id)
                    .single();

                if (profileError || !profile) {
                    console.error("Profile fetch error:", profileError);
                    await supabase.auth.signOut();
                    navigate("/auth");
                    return;
                }

                // Check if user has the required role
                if (requiredRole === "pharmacist") {
                    // Pharmacist routes - only pharmacists and admins allowed
                    if (profile.role !== "pharmacist" && profile.role !== "admin") {
                        navigate("/dashboard"); // Redirect patients to their dashboard
                        return;
                    }
                } else if (requiredRole === "patient") {
                    // Patient routes - only patients allowed
                    if (profile.role !== "patient") {
                        navigate("/pharmacist"); // Redirect pharmacists to their dashboard
                        return;
                    }
                } else if (requiredRole === "admin") {
                    // Admin routes - only admins allowed
                    if (profile.role !== "admin") {
                        // Redirect based on actual role if not admin
                        if (profile.role === "patient") {
                            navigate("/dashboard");
                        } else if (profile.role === "pharmacist") {
                            navigate("/pharmacist");
                        } else {
                            navigate("/auth"); // Fallback for unknown roles
                        }
                        return;
                    }
                }

                // If we reach here, the user has the correct role or is allowed access
                setIsAuthorized(true);
            } catch (error) {
                console.error("Unexpected error in auth check:", error);
                await supabase.auth.signOut();
                navigate("/auth");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_OUT" || !session) {
                navigate("/auth");
            } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
                // Re-check authorization when auth state changes
                checkAuth();
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, requiredRole]);

    // Show loading spinner while checking auth
    if (isLoading || isAuthorized === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-portal-bg">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-eucalyptus border-t-transparent rounded-full"
                />
            </div>
        );
    }

    // Only render children if authorized
    return isAuthorized ? <>{children}</> : null;
}
