import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { PortalSidebar, PortalMobileHeader, PortalBottomNav } from "./PortalSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface PortalLayoutProps {
  children: ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-portal-bg">
      {/* Mobile Header */}
      <PortalMobileHeader onMenuClick={() => setMobileMenuOpen(true)} />
      
      {/* Sidebar */}
      <PortalSidebar
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
          paddingBottom: isMobile ? 64 : 0, // Account for bottom nav
        }}
      >
        {children}
      </motion.main>

      {/* Mobile Bottom Navigation */}
      <PortalBottomNav />
    </div>
  );
}
