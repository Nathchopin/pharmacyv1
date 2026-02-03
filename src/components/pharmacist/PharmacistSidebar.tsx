
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
    X,
    Heart
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
        if (path === "/pharmacist") {
            return location.pathname === "/pharmacist";
        }
        return location.pathname.startsWith(path);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile && onMobileOpenChange) {
            onMobileOpenChange(false);
        }
    };

    const SidebarContent = ({ showToggle = true }: { showToggle?: boolean }) => (
        <div className="h-full flex flex-col bg-white">
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-eucalyptus flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                    </div>
                    {(!collapsed || isMobile) && (
                        <div>
                            <span className="font-serif text-lg font-medium text-eucalyptus block leading-tight">Pharma+</span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Clinical</span>
                        </div>
                    )}
                </div>

                {/* Mobile close button */}
                {isMobile && onMobileOpenChange && (
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => onMobileOpenChange(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                        <motion.button
                            key={item.name}
                            onClick={() => handleNavigation(item.href)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                                active
                                    ? "bg-eucalyptus text-white"
                                    : "text-muted-foreground hover:bg-eucalyptus-muted hover:text-eucalyptus"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Icon className={cn("w-5 h-5 shrink-0", !isMobile && collapsed && "mx-auto")} />
                            {(!collapsed || isMobile) && <span className="font-medium text-sm">{item.name}</span>}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Return to Patient Portal Link */}
            <div className="px-3 pb-2 mt-auto">
                <motion.button
                    onClick={() => {
                        handleLogout();
                        navigate("/auth");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-eucalyptus/10 hover:text-eucalyptus transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="w-5 h-5 flex items-center justify-center font-serif text-xs border border-current rounded-md shrink-0">P+</span>
                    {(!collapsed || isMobile) && <span className="font-medium text-sm">Patient Portal</span>}
                </motion.button>
            </div>

            {/* Logout */}
            <div className="p-3 border-t border-border">
                <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <LogOut className={cn("w-5 h-5 shrink-0", !isMobile && collapsed && "mx-auto")} />
                    {(!collapsed || isMobile) && <span className="font-medium text-sm">Log Out</span>}
                </motion.button>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
                <SheetContent side="left" className="p-0 w-[280px]">
                    <SidebarContent showToggle={false} />
                </SheetContent>
            </Sheet>
        );
    }

    // Desktop: Fixed sidebar
    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-screen border-r border-border flex flex-col fixed left-0 top-0 z-40 hidden lg:flex bg-white"
        >
            <SidebarContent />

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
                {collapsed ? (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
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
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-border flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onMenuClick}>
                    <Menu className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-eucalyptus flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-serif text-lg font-medium text-eucalyptus">Pharma+ Clinical</span>
                </div>
            </div>
        </header>
    );
}
