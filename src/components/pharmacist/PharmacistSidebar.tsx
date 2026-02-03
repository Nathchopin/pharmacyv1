
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
import {
    ClipboardList,
    Users,
    Pill,
    Settings,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    Heart,
    X,
    Activity,
    Thermometer,
    Plane,
    ShoppingBag,
    Stethoscope,
    Syringe
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePharmacistStats } from "@/hooks/use-pharmacist-stats";

interface PharmacistSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
}

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
    const { stats } = usePharmacistStats();

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
        if (path === "/pharmacist") return location.pathname === "/pharmacist";
        return location.pathname.startsWith(path);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile && onMobileOpenChange) {
            onMobileOpenChange(false);
        }
    };

    const navigationGroups = [
        {
            title: "Clinical Reviews",
            items: [
                { 
                    name: "Weight Management", 
                    href: "/pharmacist/clinical/weight_loss", 
                    icon: Activity,
                    count: stats.weight_loss,
                    color: "text-amber-500",
                    badgeColor: "bg-amber-100 text-amber-700"
                },
                { 
                    name: "Hair Loss", 
                    href: "/pharmacist/clinical/hair_loss", 
                    icon: Users, // Placeholder icon
                    count: stats.hair_loss,
                    color: "text-orange-500",
                    badgeColor: "bg-orange-100 text-orange-700" 
                },
            ]
        },
        {
            title: "Appointments",
            items: [
                { 
                    name: "Blood Tests", 
                    href: "/pharmacist/appointments", 
                    icon: Syringe,
                    count: stats.blood_test,
                    color: "text-rose-500",
                    badgeColor: "bg-rose-100 text-rose-700"
                },
                { 
                    name: "Pharmacy First", 
                    href: "/pharmacist/appointments", 
                    icon: Stethoscope,
                    count: stats.pharmacy_first,
                    color: "text-blue-500",
                    badgeColor: "bg-blue-100 text-blue-700"
                },
            ]
        },
        {
            title: "Inventory & Orders",
            items: [
                { 
                    name: "Travel Clinic", 
                    href: "/pharmacist/orders/travel_clinic", 
                    icon: Plane,
                    count: stats.travel_clinic,
                    color: "text-sky-500",
                    badgeColor: "bg-sky-100 text-sky-700"
                },
                { 
                    name: "Shop Orders", 
                    href: "/pharmacist/orders/shop", 
                    icon: ShoppingBag,
                    count: stats.shop,
                    color: "text-purple-500",
                    badgeColor: "bg-purple-100 text-purple-700"
                },
            ]
        },
        {
            title: "Admin",
            items: [
                 { name: "Patients", href: "/pharmacist/patients", icon: Users },
                 { name: "Settings", href: "/pharmacist/settings", icon: Settings },
            ]

        }
    ];

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
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">OS 1.0</span>
                        </div>
                    )}
                </div>

                {isMobile && onMobileOpenChange && (
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => onMobileOpenChange(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
                {navigationGroups.map((group, groupIdx) => (
                    <div key={groupIdx}>
                        {(!collapsed || isMobile) && (
                             <h3 className="px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
                                {group.title}
                            </h3>
                        )}
                       
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const active = isActive(item.href);
                                const Icon = item.icon;
                                return (
                                    <motion.button
                                        key={item.name}
                                        onClick={() => handleNavigation(item.href)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                            active
                                                ? "bg-slate-50 text-foreground font-medium shadow-sm border border-slate-100"
                                                : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
                                        )}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Icon className={cn(
                                            "w-5 h-5 shrink-0 transition-colors",
                                            active ? item.color || "text-eucalyptus" : "text-muted-foreground group-hover:text-foreground",
                                            !isMobile && collapsed && "mx-auto"
                                        )} />
                                        
                                        {(!collapsed || isMobile) && (
                                            <>
                                                <span className="text-sm truncate flex-1 text-left">{item.name}</span>
                                                {item.count !== undefined && item.count > 0 && (
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                                        item.badgeColor || "bg-slate-100 text-slate-600"
                                                    )}>
                                                        {item.count}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                        {/* Notification Dot for Collapsed State */}
                                        {collapsed && !isMobile && item.count !== undefined && item.count > 0 && (
                                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-1 ring-white" />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Return to Patient Portal Link */}
            <div className="px-3 pb-2 mt-auto">
                 <motion.button
                    onClick={() => {
                        handleLogout();
                        navigate("/auth");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-eucalyptus/10 hover:text-eucalyptus transition-all"
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
