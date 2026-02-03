
import AuthPage from "@/pages/AuthPage";

export default function PharmacistLoginPage() {
    return (
        <AuthPage
            title="Pharmacist Cockpit, Clinical Access"
            subtitle="Secure access for reviewing consultations and managing patient care."
            allowedRoles={["pharmacist", "admin"]}
            redirectTo="/pharmacist/dashboard"
            disableSignup={true}
        />
    );
}
