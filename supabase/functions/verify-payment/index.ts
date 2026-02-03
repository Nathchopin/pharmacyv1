
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Verify Payment Function Initialised");

serve(async (req) => {
    // 1. Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { session_id } = await req.json();

        if (!session_id) {
            throw new Error("Missing session_id");
        }

        // 2. Initialize Stripe
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
            apiVersion: "2023-10-16",
        });

        // 3. Retrieve Session
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
            throw new Error("Payment not completed");
        }

        const { consultation_id, medication } = session.metadata || {};

        if (!consultation_id) {
            throw new Error("Missing consultation_id in session metadata");
        }

        console.log(`Verifying payment for consultation: ${consultation_id}`);

        // 4. Initialize Supabase Admin Client (Service Role) to bypass RLS for updates
        // Use PRIVATE_SERVICE_ROLE_KEY as fallback since SUPABASE_... is reserved in CLI
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("PRIVATE_SERVICE_ROLE_KEY") ?? "";
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            serviceRoleKey
        );

        // 5. Update Consultation Status
        const { error: updateError } = await supabaseAdmin
            .from("consultations")
            .update({
                status: "pending_review", // CRITICAL: This puts it in the Pharmacist Cockpit
                payment_status: "paid",
                stripe_session_id: session_id,
                payment_intent_id: session.payment_intent, // OPTIMIZATION: Save this now
                updated_at: new Date().toISOString(),
            })
            .eq("id", consultation_id);

        if (updateError) {
            console.error("Database update error:", updateError);
            throw updateError;
        }

        console.log("Consultation updated successfully.");

        // 6. Stub Email Notification (Log only for now)
        // 6. Send Order Confirmation Email
        console.log(`Sending order confirmation email to customer...`);
        const customerEmail = session.customer_details?.email;

        if (customerEmail) {
            const resendApiKey = Deno.env.get("RESEND_API_KEY");
            if (resendApiKey) {
                const { OrderConfirmationEmail } = await import("../_shared/email-templates.ts");
                const emailHtml = OrderConfirmationEmail(consultation_id, `${req.headers.get("origin")}/dashboard`);

                const res = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${resendApiKey}`,
                    },
                    body: JSON.stringify({
                        from: "Pharmacy <onboarding@resend.dev>",
                        to: [customerEmail],
                        subject: `Order #${consultation_id.slice(0, 8)} Received - Pending Clinical Review`,
                        html: emailHtml,
                    }),
                });

                const emailData = await res.json();
                console.log("Email sent:", emailData);
            } else {
                console.error("RESEND_API_KEY not found");
            }
        } else {
            console.error("No customer email found in session");
        }

        return new Response(
            JSON.stringify({ success: true, message: "Order finalized" }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );

    } catch (error) {
        console.error("Verification Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            }
        );
    }
});
