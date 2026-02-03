import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import klarnaLogo from "@/assets/klarna-text-logo.png";

export function KlarnaBar() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 1 }} 
      viewport={{ once: true }} 
      className="bg-[#FFB3C7] mt-4 md:mt-12"
    >
      <div className="container py-3 md:py-2.5">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-center gap-1.5 text-sm">
          <span className="text-black/80 font-medium">Pay in 3 interest-free instalments with</span>
          <img src={klarnaLogo} alt="Klarna" className="h-5 object-contain" />
          <Link 
            to="/klarna" 
            onClick={() => window.scrollTo(0, 0)} 
            className="text-xs font-semibold text-black/70 hover:text-black underline underline-offset-2 transition-colors"
          >
            See details
          </Link>
        </div>
        
        {/* Mobile layout - text on top, logo + link below */}
        <div className="flex md:hidden flex-col items-center gap-1 text-sm">
          <span className="text-black/80 font-medium text-center">
            Pay in 3 interest-free instalments with
          </span>
          <div className="flex items-center gap-2">
            <img src={klarnaLogo} alt="Klarna" className="h-5 object-contain" />
            <Link 
              to="/klarna" 
              onClick={() => window.scrollTo(0, 0)} 
              className="text-xs font-semibold text-black/70 hover:text-black underline underline-offset-2 transition-colors"
            >
              See details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}