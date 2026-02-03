import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { TreatmentApprovedEmail, TreatmentRejectedEmail } from "./email-templates.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // 0. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        console.log("--- STARTING CLINICAL DECISION SEQUENCE ---");

        // 1. Initialize Clients
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const str = Deno.env.get('STRIPE_SECRET_KEY');
        console.log("Stripe Key Present:", !!str);

        if (!str) {
            throw new Error("Stripe Secret Key not found");
        }

        // Updated Stripe Init (consistent with verify-payment)
        const stripe = new Stripe(str, {
            apiVersion: '2023-10-16',
        })

        // 2. Parse Request
        const bodyText = await req.text();
        console.log("Request Body:", bodyText);

        let body;
        try {
            body = JSON.parse(bodyText);
        } catch (e) {
            throw new Error("Invalid JSON body");
        }

        const { consultation_id, decision, reason } = body;
        console.log(`Processing: id=${consultation_id}, decision=${decision}`);

        if (!consultation_id || !decision) {
            throw new Error('Missing required fields: consultation_id or decision');
        }

        // 3. Fetch Consultation
        const { data: consultation, error: fetchError } = await supabaseClient
            .from('consultations')
            .select('*')
            .eq('id', consultation_id)
            .single()

        if (fetchError || !consultation) {
            console.error("Fetch Error:", fetchError);
            throw new Error("Consultation not found: " + (fetchError?.message || "Unknown error"));
        }

        console.log("Found Consultation. existing payment_intent_id:", consultation.payment_intent_id);
        console.log("Found Consultation. stripe_session_id:", consultation.stripe_session_id);

        let updateStatus = decision === 'approve' ? 'active' : 'rejected';

        // 4. Handle Rejection (Forensic Refund Logic)
        if (decision === 'reject') {
            console.log("--- STARTING REJECTION SEQUENCE ---");

            try {
                // A. Retrieve Session (if available)
                let session: any = null;
                if (consultation.stripe_session_id) {
                    console.log(`Retrieving Stripe Session: ${consultation.stripe_session_id}`);
                    session = await stripe.checkout.sessions.retrieve(consultation.stripe_session_id, {
                        expand: ['payment_intent', 'subscription']
                    });
                    console.log("Stripe Session Retrieved. Mode:", session.mode);
                }

                // B. Handle Subscription Cancellation
                if (session?.subscription) {
                    const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
                    console.log(`Found Subscription: ${subId}. Cancelling...`);
                    await stripe.subscriptions.cancel(subId);
                    console.log("Subscription Cancelled Successfully.");
                }

                // C. Find Payment Intent (The "Invoice Lookup" Logic)
                let paymentIntentId = consultation.payment_intent_id; // Start with DB value

                // If not in DB, check session
                if (!paymentIntentId && session?.payment_intent) {
                    paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id;
                    console.log("Found PI on Session:", paymentIntentId);
                }

                // If STILL not found and it's a subscription, check the invoice
                if (!paymentIntentId && session?.subscription) {
                    console.log("Looking up Payment Intent via Subscription Invoice...");
                    const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;

                    const subscription = await stripe.subscriptions.retrieve(subId, {
                        expand: ['latest_invoice.payment_intent']
                    });

                    const invoice = subscription.latest_invoice as any;
                    const invoicePi = invoice?.payment_intent;

                    if (invoicePi) {
                        paymentIntentId = typeof invoicePi === 'string' ? invoicePi : invoicePi.id;
                        console.log("Found PI via Invoice:", paymentIntentId);
                    }
                }

                // D. Issue Refund
                if (paymentIntentId) {
                    console.log(`Refunding Payment Intent: ${paymentIntentId}`);
                    try {
                        await stripe.refunds.create({
                            payment_intent: paymentIntentId,
                            reason: 'requested_by_customer'
                        });
                        console.log("Refund Issued Successfully.");
                    } catch (refundError: any) {
                        console.error("Refund Error:", refundError);
                        // Ignore "already refunded" errors
                        if (refundError.code !== 'charge_already_refunded') {
                            throw refundError;
                        } else {
                            console.log("Payment was already refunded.");
                        }
                    }
                } else {
                    console.error("CRITICAL: No Payment Intent found to refund. Proceeding with status update only.");
                }

            } catch (stripeOpsError: any) {
                console.error("!!! STRIPE LOGIC ERROR !!!", stripeOpsError.message);
                throw new Error(`Stripe Operation Failed: ${stripeOpsError.message}`);
            }
        }

        // 5. Update Consultation Status
        const { error: updateError } = await supabaseClient
            .from('consultations')
            .update({
                status: updateStatus,
                pharmacist_notes: reason,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', consultation_id)

        if (updateError) {
            console.error("Database Update Error:", updateError);
            throw updateError;
        }

        console.log(`Consultation ${consultation_id} updated to ${updateStatus}`);

        // 6. Send Email Notification
        try {
            const resendApiKey = Deno.env.get("RESEND_API_KEY");
            if (resendApiKey) {
                // Fetch User Email
                const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(consultation.patient_id);
                const userEmail = userData?.user?.email;

                if (userEmail) {
                    let emailHtml = "";
                    let subject = "";

                    if (decision === 'approve') {
                        subject = "Good News: Your Treatment is Approved";
                        emailHtml = TreatmentApprovedEmail(consultation.medication || "Weight Loss Treatment", `${req.headers.get("origin")}/dashboard`);
                    } else if (decision === 'reject') {
                        subject = "Update on your Consultation";
                        emailHtml = TreatmentRejectedEmail(reason || "Clinical decision", "£195.00");
                    }

                    if (emailHtml) {
                        const res = await fetch("https://api.resend.com/emails", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${resendApiKey}`,
                            },
                            body: JSON.stringify({
                                from: "Pharmacy <onboarding@resend.dev>",
                                to: [userEmail],
                                subject: subject,
                                html: emailHtml,
                            }),
                        });
                        console.log("Email Dispatch Result:", await res.json());
                    }
                } else {
                    console.error("Could not find user email for notification.");
                }
            } else {
                console.log("Skipping email: RESEND_API_KEY missing.");
            }
        } catch (emailErr) {
            console.error("Failed to send email:", emailErr);
            // Don't fail the request, just log
        }

        return new Response(JSON.stringify({ success: true, status: updateStatus }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error("FATAL FUNCTION ERROR:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
