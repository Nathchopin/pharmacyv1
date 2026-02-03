import { ReactNode, useState } from "react";
import { PharmacistSidebar } from "./PharmacistSidebar";
import { PageTransition } from "@/components/animations/SlickMotion";

interface PharmacistLayoutProps {
    children: ReactNode;
}

export function PharmacistLayout({ children }: PharmacistLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#134E4A] via-[#0F3D39] to-[#0A2E2A]">
            {/* Background Pattern - Same as patient app */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

            <PharmacistSidebar
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
                mobileOpen={mobileMenuOpen}
                onMobileOpenChange={setMobileMenuOpen}
            />

            <PageTransition
                className={`
          transition-all duration-300 relative z-10
          ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
            >
                <main className="min-h-screen p-4 md:p-8">
                    {children}
                </main>
            </PageTransition>
        </div>
    );
}
