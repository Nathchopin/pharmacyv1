import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FlaskConical, MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight, Pill, Heart, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
const menuItems = [{
  id: "overview",
  label: "Overview",
  icon: LayoutDashboard,
  path: "/dashboard"
}, {
  id: "treatments",
  label: "My Treatments",
  icon: Pill,
  path: "/dashboard/treatments"
}, {
  id: "lab-results",
  label: "Lab Results",
  icon: FlaskConical,
  path: "/dashboard/lab-results"
}, {
  id: "messages",
  label: "Messages",
  icon: MessageSquare,
  path: "/dashboard/messages"
}, {
  id: "settings",
  label: "Settings",
  icon: Settings,
  path: "/dashboard/settings"
}];
interface PortalSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}
export function PortalSidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileOpenChange
}: PortalSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onMobileOpenChange) {
      onMobileOpenChange(false);
    }
  };
  const SidebarContent = ({
    showToggle = true
  }: {
    showToggle?: boolean;
  }) => <div className="h-full flex flex-col bg-white">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-eucalyptus flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          {(!collapsed || isMobile) && <span className="font-serif text-lg font-medium text-eucalyptus">Pharma+</span>}
        </div>
        
        {/* Mobile close button */}
        {isMobile && onMobileOpenChange && <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => onMobileOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
        const active = isActive(item.path);
        return <motion.button key={item.id} onClick={() => handleNavigation(item.path)} className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200", active ? "bg-eucalyptus text-white" : "text-muted-foreground hover:bg-eucalyptus-muted hover:text-eucalyptus")} whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }}>
              <item.icon className={cn("w-5 h-5 shrink-0", !isMobile && collapsed && "mx-auto")} />
              {(!collapsed || isMobile) && <span className="font-medium text-sm">{item.label}</span>}
            </motion.button>;
      })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <motion.button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all" whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }}>
          <LogOut className={cn("w-5 h-5 shrink-0", !isMobile && collapsed && "mx-auto")} />
          {(!collapsed || isMobile) && <span className="font-medium text-sm">Log Out</span>}
        </motion.button>
      </div>
    </div>;

  // Mobile: Use Sheet drawer
  if (isMobile) {
    return <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SidebarContent showToggle={false} />
        </SheetContent>
      </Sheet>;
  }

  // Desktop: Fixed sidebar
  return <motion.aside initial={false} animate={{
    width: collapsed ? 80 : 280
  }} transition={{
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1]
  }} className="h-screen border-r border-border flex flex-col fixed left-0 top-0 z-40 hidden lg:flex">
      <SidebarContent />
      
      {/* Toggle Button */}
      <button onClick={onToggle} className="absolute -right-3 top-20 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
        {collapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronLeft className="w-4 h-4 text-muted-foreground" />}
      </button>
    </motion.aside>;
}

// Mobile Header Component for Dashboard pages
export function PortalMobileHeader({
  onMenuClick
}: {
  onMenuClick: () => void;
}) {
  return <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-eucalyptus flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-lg font-medium text-eucalyptus">DeepFlow</span>
        </div>
      </div>
    </header>;
}

// Mobile Bottom Navigation for quick access
export function PortalBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const bottomItems = [{
    id: "overview",
    icon: LayoutDashboard,
    path: "/dashboard",
    label: "Home"
  }, {
    id: "lab-results",
    icon: FlaskConical,
    path: "/dashboard/lab-results",
    label: "Labs"
  }, {
    id: "messages",
    icon: MessageSquare,
    path: "/dashboard/messages",
    label: "Messages"
  }, {
    id: "settings",
    icon: Settings,
    path: "/dashboard/settings",
    label: "Settings"
  }];
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };
  return <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-border safe-area-pb">
      <div className="h-full flex items-center justify-around px-2">
        {bottomItems.map(item => {
        const active = isActive(item.path);
        return <motion.button key={item.id} onClick={() => navigate(item.path)} className={cn("flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-[64px]", active ? "text-eucalyptus" : "text-muted-foreground")} whileTap={{
          scale: 0.95
        }}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && <motion.div layoutId="bottomNavIndicator" className="absolute bottom-1 w-1 h-1 bg-eucalyptus rounded-full" />}
            </motion.button>;
      })}
      </div>
    </nav>;
}