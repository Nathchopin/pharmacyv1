import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Create Checkout Function Initialised");

serve(async (req) => {
    // 1. Handle CORS Preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 2. Parse Request Body
        const { consultation_id, price_id, medication } = await req.json();

        if (!consultation_id || !price_id) {
            throw new Error("Missing consultation_id or price_id");
        }

        // 3. Initialize Stripe
        // Note: We use the secret key from env
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
            apiVersion: "2023-10-16",
        });

        // 4. Create Checkout Session
        console.log(`Creating checkout for consultation: ${consultation_id}, Med: ${medication}`);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: price_id,
                    quantity: 1,
                },
            ],
            mode: "subscription", // CRITICAL: This requires a Recurring Price ID
            // If the user uses the One-Time ID we generated, this will fail.
            // We'll handle that error or let it bubble up.
            metadata: {
                consultation_id: consultation_id,
                medication: medication || "unknown",
            },
            // Note: In real prod, use dynamic origin
            success_url: `${req.headers.get("origin")}/weight-loss/confirmation?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/weight-loss/payment?medication=${medication}`,
        });

        console.log("Session created:", session.id);

        // 5. Return the URL
        return new Response(
            JSON.stringify({ url: session.url }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );

    } catch (error) {
        console.error("Error creating checkout session:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            }
        );
    }
});
