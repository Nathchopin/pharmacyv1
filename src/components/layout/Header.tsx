import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Weight", path: "/weight-loss", color: "eucalyptus" },
  { name: "Hair", path: "/hair", color: "charcoal" },
  { name: "Blood Tests", path: "/blood-tests", color: "red" },
  { name: "Pharmacy First", path: "/pharmacy-first", color: "sky" },
  { name: "Travel", path: "/travel", color: "purple" },
  { name: "Shop", path: "/shop", color: "pink" },
];

const colorClasses: Record<string, { text: string; bg: string; activeBg: string }> = {
  eucalyptus: { 
    text: "hover:text-teal-700", 
    bg: "hover:bg-teal-50", 
    activeBg: "bg-teal-50 text-teal-700" 
  },
  charcoal: { 
    text: "hover:text-gray-800", 
    bg: "hover:bg-gray-100", 
    activeBg: "bg-gray-100 text-gray-800" 
  },
  red: { 
    text: "hover:text-red-500", 
    bg: "hover:bg-red-50", 
    activeBg: "bg-red-50 text-red-500" 
  },
  sky: { 
    text: "hover:text-sky-500", 
    bg: "hover:bg-sky-50", 
    activeBg: "bg-sky-50 text-sky-500" 
  },
  purple: { 
    text: "hover:text-purple-600", 
    bg: "hover:bg-purple-50", 
    activeBg: "bg-purple-50 text-purple-600" 
  },
  pink: { 
    text: "hover:text-pink-500", 
    bg: "hover:bg-pink-50", 
    activeBg: "bg-pink-50 text-pink-500" 
  },
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-7 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav border-b border-black/5 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center py-2"
          onClick={() => window.scrollTo(0, 0)}
        >
          <span className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Pharmacy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const colors = colorClasses[link.color];
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => window.scrollTo(0, 0)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive
                    ? colors.activeBg
                    : `text-foreground ${colors.text} ${colors.bg}`
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Patient Portal Button */}
        <div className="hidden lg:block">
          <Button
            asChild
            className="bg-foreground text-background hover:bg-foreground/90 px-6 py-2 h-10 rounded-full text-sm font-medium"
          >
            <Link to="/auth">Patient Portal</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-0 top-[calc(28px+64px)] bg-white/95 backdrop-blur-xl border-b border-black/5"
          >
            <nav className="container py-6 flex flex-col gap-1">
              {navLinks.map((link) => {
                const colors = colorClasses[link.color];
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => window.scrollTo(0, 0)}
                    className={`px-4 py-3 text-sm font-medium rounded-2xl transition-colors ${
                      isActive
                        ? colors.activeBg
                        : `text-foreground ${colors.text} ${colors.bg}`
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Button
                asChild
                className="bg-foreground text-background hover:bg-foreground/90 mt-4 py-3 rounded-full text-sm font-medium"
              >
                <Link to="/auth">Patient Portal</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
