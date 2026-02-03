import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-pharmacy.jpeg";

export function HeroSection() {
  return (
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Healthcare consultation"
          className="absolute inset-0 w-full h-full object-cover object-[85%_15%] md:object-[right_top]"
          style={{ transformOrigin: "right top" }}
        />
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="heading-display text-foreground mb-6">
            Expert Healthcare.{" "}
            <span className="font-light">Without the Wait.</span>
          </h1>

          <p className="text-elegant text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
            Private prescription treatments and blood testing approved by UK
            Pharmacists.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              asChild
              className="group relative bg-accent text-white rounded-full px-10 py-7 text-sm tracking-wide font-medium transition-all duration-300 hover:scale-[1.02] hover:bg-accent/90 overflow-hidden"
            >
              <Link to="/treatments" onClick={() => window.scrollTo(0, 0)}>
                <span className="relative">Find a Treatment</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="group relative bg-transparent border-2 border-white text-white rounded-full px-10 py-7 text-sm tracking-wide font-medium transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 overflow-hidden"
            >
              <Link to="/health-checks" onClick={() => window.scrollTo(0, 0)}>
                <span className="relative">Book Blood Test</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
