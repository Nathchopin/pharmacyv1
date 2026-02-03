export const EMAIL_STYLES = {
    container: "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;",
    header: "text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;",
    logo: "font-size: 24px; font-weight: bold; color: #134E4A; text-decoration: none;",
    heading: "color: #1a1a1a; font-size: 24px; font-weight: 600; margin-bottom: 16px; text-align: center;",
    text: "color: #4a4a4a; font-size: 16px; line-height: 24px; margin-bottom: 24px;",
    buttonContainer: "text-align: center; margin: 32px 0;",
    button: "background-color: #134E4A; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 4px; display: inline-block;",
    footer: "margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center; color: #888888; font-size: 12px;"
};

const WRAPPER = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pharmacy Update</title>
</head>
<body style="background-color: #f5f5f5; padding: 40px 0;">
    <div style="${EMAIL_STYLES.container}">
        <div style="${EMAIL_STYLES.header}">
            <span style="${EMAIL_STYLES.logo}">Pharmacy</span>
        </div>
        ${content}
        <div style="${EMAIL_STYLES.footer}">
            <p>© ${new Date().getFullYear()} Pharmacy. All rights reserved.</p>
            <p>123 High Street, London, SW1A 1AA</p>
        </div>
    </div>
</body>
</html>
`;

export const OrderConfirmationEmail = (orderId: string, dashboardUrl: string) => WRAPPER(`
    <h1 style="${EMAIL_STYLES.heading}">Order #${orderId} Received</h1>
    <p style="${EMAIL_STYLES.text}">
        Thank you for your order. We have successfully received your request.
    </p>
    <p style="${EMAIL_STYLES.text}">
        Our clinical team is currently reviewing your assessment to ensure the treatment is safe and suitable for you. 
        You will hear from us shortly with an update.
    </p>
    <div style="${EMAIL_STYLES.buttonContainer}">
        <a href="${dashboardUrl}" style="${EMAIL_STYLES.button}">Go to Dashboard</a>
    </div>
`);

export const TreatmentApprovedEmail = (medication: string, trackingUrl: string) => WRAPPER(`
    <h1 style="${EMAIL_STYLES.heading}">Good News: Your Treatment is Approved</h1>
    <p style="${EMAIL_STYLES.text}">
        Our pharmacist has reviewed your assessment and approved your request for <strong>${medication}</strong>.
    </p>
    <p style="${EMAIL_STYLES.text}">
        Your subscription is now active. We are preparing your medication for dispatch via 24h tracked delivery.
    </p>
    <div style="${EMAIL_STYLES.buttonContainer}">
        <a href="${trackingUrl}" style="${EMAIL_STYLES.button}">Track Your Journey</a>
    </div>
`);

export const TreatmentRejectedEmail = (reason: string, refundAmount: string) => WRAPPER(`
    <h1 style="${EMAIL_STYLES.heading}">Update on your Consultation</h1>
    <p style="${EMAIL_STYLES.text}">
        Unfortunately, our clinician could not approve your request at this time based on the medical information provided.
    </p>
    <div style="background-color: #fff1f2; border: 1px solid #Ipn; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
        <strong style="color: #991b1b; display: block; margin-bottom: 8px;">Clinician's Note:</strong>
        <span style="color: #7f1d1d;">"${reason}"</span>
    </div>
    <p style="${EMAIL_STYLES.text}">
        <strong>Refund Status:</strong> A full refund of ${refundAmount} has been initiated and should appear on your statement within 5-10 business days.
    </p>
    <p style="${EMAIL_STYLES.text}">
        If you believe this decision was made in error or have further questions, please reply to this email.
    </p>
`);
