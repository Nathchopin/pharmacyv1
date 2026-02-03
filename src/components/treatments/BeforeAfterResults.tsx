import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { BOOKING_CALENDARS } from "@/components/booking/BookingButton";

// Laser Hair Removal Results Images
import smoothSkin1 from "@/assets/laser-results/smooth-skin-1.jpeg";
import smoothSkin2 from "@/assets/laser-results/smooth-skin-2.jpeg";
import smoothSkin3 from "@/assets/laser-results/smooth-skin-3.jpeg";
import smoothSkinFace from "@/assets/laser-results/smooth-skin-face.jpeg";
import smoothSkinMale from "@/assets/laser-results/smooth-skin-male.jpeg";

interface ResultItem {
  id: string;
  title: string;
  area: string;
  sessions: string;
  image: string;
  benefits: string[];
}

const laserResults: ResultItem[] = [
  {
    id: "bikini-underarms",
    title: "Silky Smooth Results",
    area: "Bikini & Underarms",
    sessions: "After 6 Sessions",
    image: smoothSkin1,
    benefits: ["Permanent reduction", "No more shaving", "Smooth bikini line"],
  },
  {
    id: "back-smooth",
    title: "Flawless Back",
    area: "Full Back",
    sessions: "After 6 Sessions",
    image: smoothSkin2,
    benefits: ["Complete coverage", "No ingrown hairs", "Confidence boost"],
  },
  {
    id: "body-smooth",
    title: "Total Body Freedom",
    area: "Full Body",
    sessions: "After 6 Sessions",
    image: smoothSkin3,
    benefits: ["90%+ hair reduction", "All skin types", "Long-lasting results"],
  },
  {
    id: "face-smooth",
    title: "Radiant Complexion",
    area: "Full Face",
    sessions: "After 6 Sessions",
    image: smoothSkinFace,
    benefits: ["Clean smooth skin", "No facial hair", "Enhanced makeup application"],
  },
  {
    id: "male-smooth",
    title: "Men's Grooming",
    area: "Face & Neck",
    sessions: "After 6 Sessions",
    image: smoothSkinMale,
    benefits: ["Reduced razor bumps", "Clean neckline", "Low maintenance"],
  },
];

export function BeforeAfterResults() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { openBookingModal } = useBookingModal();

  const activeResult = laserResults[activeIndex];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <p className="text-label text-accent">Real Results</p>
          </div>
          <h2 className="heading-section mb-4">Before & After</h2>
          <p className="text-elegant text-muted-foreground max-w-2xl mx-auto">
            Witness the transformative power of our advanced laser technology. Real clients, real results.
          </p>
        </motion.div>

        {/* Main Results Display */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Main Image with Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeResult.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeResult.image}
                    alt={activeResult.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Result Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-6 left-6"
              >
                <div className="bg-accent text-white px-4 py-2 rounded-full text-label text-xs font-medium shadow-lg">
                  {activeResult.sessions}
                </div>
              </motion.div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeResult.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-white/70 text-label text-xs mb-2">
                      {activeResult.area}
                    </p>
                    <h3 className="text-white text-2xl md:text-3xl font-medium font-oswald uppercase tracking-wide">
                      {activeResult.title}
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Hover Effect - Reveal Benefits */}
              <motion.div
                initial={false}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none"
              >
                <div className="text-center text-white p-8">
                  <p className="text-label text-accent text-xs mb-4">Key Benefits</p>
                  <ul className="space-y-3">
                    {activeResult.benefits.map((benefit, index) => (
                      <motion.li
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: isHovering ? 1 : 0, x: isHovering ? 0 : -20 }}
                        transition={{ delay: index * 0.1 + 0.1 }}
                        className="flex items-center gap-3 justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        <span className="text-lg">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-accent/20 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-2xl blur-xl -z-10" />
          </motion.div>

          {/* Results Navigation & Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Result Thumbnails */}
            <div className="space-y-3">
              {laserResults.map((result, index) => (
                <motion.button
                  key={result.id}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left group ${
                    activeIndex === index
                      ? "bg-accent/10 border border-accent/30"
                      : "bg-secondary hover:bg-secondary/80 border border-transparent"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Thumbnail */}
                  <div className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-offset-2 ring-offset-background transition-all duration-300 ${
                    activeIndex === index ? 'ring-accent' : 'ring-transparent'
                  }`}>
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-label text-xs text-muted-foreground mb-1">
                      {result.area}
                    </p>
                    <h4 className={`font-medium transition-colors ${
                      activeIndex === index ? "text-accent" : "text-foreground"
                    }`}>
                      {result.title}
                    </h4>
                  </div>

                  {/* Arrow */}
                  <ArrowRight 
                    className={`w-5 h-5 transition-all duration-300 ${
                      activeIndex === index 
                        ? "text-accent translate-x-0 opacity-100" 
                        : "text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`} 
                  />
                </motion.button>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <Button
                onClick={() => openBookingModal(BOOKING_CALENDARS.laserHairRemoval)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-label tracking-widest"
              >
                Book Your Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                Free consultation • No obligation • Patch test included
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "90%+", label: "Hair Reduction" },
            { value: "6", label: "Sessions Average" },
            { value: "1000+", label: "Happy Clients" },
            { value: "5★", label: "Average Rating" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center p-6 bg-secondary/50 rounded-xl"
            >
              <p className="text-3xl md:text-4xl font-oswald font-medium text-accent mb-2">
                {stat.value}
              </p>
              <p className="text-label text-xs text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
