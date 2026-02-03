import { motion } from "framer-motion";

export function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[hsl(0,0%,12%)] text-white h-7 flex items-center">
      <div className="container">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[11px] font-medium tracking-wide text-center"
        >
          GPhC Registered Pharmacy: 9011982 | CQC Rated: Good | Superintendent: Nathanaël
        </motion.p>
      </div>
    </div>
  );
}
