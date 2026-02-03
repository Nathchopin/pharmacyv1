
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    ClipboardList,
    Users,
    Pill,
    Settings,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    Shield,
    X
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PharmacistSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
}

const navigation = [
    { name: "Clinical Queue", href: "/pharmacist", icon: ClipboardList },
    { name: "Patients", href: "/pharmacist/patients", icon: Users },
    { name: "Prescriptions", href: "/pharmacist/prescriptions", icon: Pill },
    { name: "Settings", href: "/pharmacist/settings", icon: Settings },
];

export function PharmacistSidebar({
    collapsed,
    onToggle,
    mobileOpen = false,
    onMobileOpenChange,
}: PharmacistSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const isMobile = useIsMobile();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast({
                title: "Error",
                description: "Failed to sign out",
                variant: "destructive",
            });
        } else {
            navigate("/pharmacist/login");
        }
    };

    const isActive = (path: string) => {
        // Dashboard root special case not needed as much here unless /pharmacist is strictly root
        if (path === "/pharmacist" && location.pathname !== "/pharmacist") {
            return false;
        }
        return location.pathname.startsWith(path);
    };

    const SidebarContent = ({ showToggle = true }: { showToggle?: boolean }) => (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className={`h-16 flex items-center justify-between px-4 border-b border-white/10 ${collapsed && !isMobile ? "justify-center px-2" : ""}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    {(!collapsed || isMobile) && (
                        <div>
                            <h1 className="text-white font-serif font-bold text-lg leading-none">
                                Pharma+
                            </h1>
                            <p className="text-emerald-200/60 text-[10px] uppercase tracking-wider">Clinical</p>
                        </div>
                    )}
                </div>
                {/* Mobile close button */}
                {isMobile && onMobileOpenChange && (
                    <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10" onClick={() => onMobileOpenChange(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                        <div key={item.name}>
                            <NavLink
                                to={item.href}
                                onClick={() => isMobile && onMobileOpenChange && onMobileOpenChange(false)}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                                    active
                                        ? "bg-white/20 backdrop-blur-md text-white shadow-lg shadow-black/10"
                                        : "text-emerald-100/80 hover:bg-white/10 hover:text-white",
                                    collapsed && !isMobile ? "justify-center px-0" : ""
                                )}
                            >
                                <Icon className={cn("flex-shrink-0", collapsed && !isMobile ? "w-6 h-6" : "w-5 h-5")} />
                                {(!collapsed || isMobile) && (
                                    <span className="font-medium text-sm">{item.name}</span>
                                )}
                            </NavLink>
                        </div>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className={`p-4 border-t border-white/10 ${collapsed && !isMobile ? "px-2" : ""}`}>
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className={cn(
                        "w-full text-red-200 hover:bg-red-500/20 hover:text-red-100",
                        collapsed && !isMobile ? "px-0 justify-center" : "justify-start"
                    )}
                >
                    <LogOut className={cn("shrink-0", collapsed && !isMobile ? "w-5 h-5" : "w-4 h-4 mr-2")} />
                    {(!collapsed || isMobile) && "Logout"}
                </Button>
            </div>
        </div>
    );

    if (isMobile) {
        // Sheet controlled by Layout/MobileHeader usually, but if invoked directly:
        // Actually PortalSidebar uses Sheet internal logic for mobile.
        return (
            <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
                <SheetContent side="left" className="p-0 w-[280px] bg-gradient-to-b from-[#134E4A] to-[#0F3D39] border-r border-white/10">
                    <SidebarContent showToggle={false} />
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-screen fixed left-0 top-0 border-r border-white/10 bg-gradient-to-b from-[#134E4A]/95 to-[#0F3D39]/95 backdrop-blur-xl z-40 hidden lg:block"
        >
            <SidebarContent />

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 w-6 h-6 bg-[#0F3D39] border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:bg-white/10 transition-all z-50"
            >
                {collapsed ? (
                    <ChevronRight className="w-3 h-3 text-white" />
                ) : (
                    <ChevronLeft className="w-3 h-3 text-white" />
                )}
            </button>
        </motion.aside>
    );
}

// Mobile Header
export function PharmacistMobileHeader({
    onMenuClick
}: {
    onMenuClick: () => void;
}) {
    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#134E4A] border-b border-white/10 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-white hover:bg-white/10">
                    <Menu className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-serif text-lg font-medium text-white">Pharma+</span>
                </div>
            </div>
        </header>
    );
}
