import { NavLink, useNavigate } from "react-router-dom";
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
    Shield
} from "lucide-react";
import { Magnetic } from "@/components/animations/SlickMotion";
import { useIsMobile } from "@/hooks/use-mobile";

interface PharmacistSidebarProps {
    collapsed: boolean;
    onCollapsedChange: (collapsed: boolean) => void;
    mobileOpen: boolean;
    onMobileOpenChange: (open: boolean) => void;
}

const navigation = [
    { name: "Clinical Queue", href: "/pharmacist", icon: ClipboardList },
    { name: "Patients", href: "/pharmacist/patients", icon: Users },
    { name: "Prescriptions", href: "/pharmacist/prescriptions", icon: Pill },
    { name: "Settings", href: "/pharmacist/settings", icon: Settings },
];

export function PharmacistSidebar({
    collapsed,
    onCollapsedChange,
    mobileOpen,
    onMobileOpenChange,
}: PharmacistSidebarProps) {
    const navigate = useNavigate();
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

    const SidebarContent = ({ inSheet = false }: { inSheet?: boolean }) => (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className={`p-6 border-b border-white/10 ${collapsed && !inSheet ? "px-4" : ""}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    {(!collapsed || inSheet) && (
                        <div>
                            <h1 className="text-white font-['Playfair_Display'] font-bold text-xl">
                                Pharmacist
                            </h1>
                            <p className="text-emerald-200/60 text-xs">Clinical Portal</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Magnetic key={item.name} strength={0.15}>
                            <NavLink
                                to={item.href}
                                onClick={() => inSheet && onMobileOpenChange(false)}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                                        ? "bg-white/20 backdrop-blur-md text-white shadow-lg shadow-black/10"
                                        : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                                    }
                  ${collapsed && !inSheet ? "justify-center" : ""}
                  `
                                }
                            >
                                <Icon className={`flex-shrink-0 ${collapsed && !inSheet ? "w-6 h-6" : "w-5 h-5"}`} />
                                {(!collapsed || inSheet) && (
                                    <span className="font-medium text-sm">{item.name}</span>
                                )}
                            </NavLink>
                        </Magnetic>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className={`p-4 border-t border-white/10 ${collapsed && !inSheet ? "px-2" : ""}`}>
                <Magnetic strength={0.15}>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className={`
              w-full text-red-200 hover:bg-red-500/20 hover:text-red-100
              ${collapsed && !inSheet ? "px-0 justify-center" : "justify-start"}
            `}
                    >
                        <LogOut className={`${collapsed && !inSheet ? "w-5 h-5" : "w-4 h-4 mr-2"}`} />
                        {(!collapsed || inSheet) && "Logout"}
                    </Button>
                </Magnetic>
            </div>

            {/* Collapse Toggle (Desktop Only) */}
            {!inSheet && !isMobile && (
                <button
                    onClick={() => onCollapsedChange(!collapsed)}
                    className="absolute -right-3 top-20 p-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all"
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4 text-white" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-white" />
                    )}
                </button>
            )}
        </div>
    );

    if (isMobile) {
        return (
            <>
                {/* Mobile Menu Trigger */}
                <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="w-72 p-0 bg-gradient-to-b from-[#134E4A] to-[#0F3D39] border-r border-white/10"
                    >
                        <SidebarContent inSheet={true} />
                    </SheetContent>
                </Sheet>
            </>
        );
    }

    return (
        <aside
            className={`
        fixed left-0 top-0 h-screen
        bg-gradient-to-b from-[#134E4A]/95 to-[#0F3D39]/95
        backdrop-blur-xl border-r border-white/10
        transition-all duration-300 z-40
        ${collapsed ? "w-20" : "w-64"}
      `}
        >
            <SidebarContent />
        </aside>
    );
}
