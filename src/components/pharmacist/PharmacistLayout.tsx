import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { PharmacistSidebar, PharmacistMobileHeader } from "./PharmacistSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface PharmacistLayoutProps {
    children: ReactNode;
}

export function PharmacistLayout({ children }: PharmacistLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    return (
        <div className="min-h-screen bg-portal-bg">
            {/* Mobile Header */}
            <PharmacistMobileHeader onMenuClick={() => setMobileMenuOpen(true)} />

            {/* Sidebar */}
            <PharmacistSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                mobileOpen={mobileMenuOpen}
                onMobileOpenChange={setMobileMenuOpen}
            />

            {/* Main Content */}
            <motion.main
                className="transition-all duration-300"
                style={{
                    marginLeft: isMobile ? 0 : (sidebarCollapsed ? 80 : 280),
                    paddingTop: isMobile ? 56 : 0, // Account for mobile header
                }}
            >
                {children}
            </motion.main>
        </div>
    );
}
