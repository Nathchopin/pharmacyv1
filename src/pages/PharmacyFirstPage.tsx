import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, CheckCircle } from "lucide-react";
import { TriageFlow } from "@/components/home/TriageFlow";
import heroImage from "@/assets/carousel/pharmacy-first.png";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  SectionReveal,
  heroVariants,
  smoothOut,
  fluidSpring,
  springConfig,
  fastSpring,
} from "@/components/animations/FluidMotion";

// Travel Blue (carousel color)
const ACCENT_COLOR = "#005EB8";

const conditions = [
  { name: "Urinary Tract Infection (UTI)", time: "5 min", available: true },
  { name: "Sore Throat", time: "5 min", available: true },
  { name: "Sinusitis", time: "5 min", available: true },
  { name: "Impetigo", time: "5 min", available: true },
  { name: "Shingles", time: "7 min", available: true },
  { name: "Infected Insect Bites", time: "5 min", available: true },
  { name: "Earache", time: "5 min", available: true },
  { name: "Conjunctivitis", time: "5 min", available: true },
];

function SymptomSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const filteredConditions = conditions.filter((condition) =>
    condition.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ type: "spring" as const, ...springConfig }}
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-xl border border-black/5"
      >
        {/* Live Status */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--success))] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(var(--success))]"></span>
          </span>
          <span className="text-sm font-medium text-[hsl(var(--success-dark))]">Pharmacist Online</span>
          <span className="text-sm text-muted-foreground">• Est. wait: 14 mins</span>
        </motion.div>

        {/* Search */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search condition (e.g. UTI, Sore Throat)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-base rounded-2xl border-border focus:ring-accent"
          />
        </motion.div>

        {/* Conditions Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-4"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.5 } },
          }}
        >
          {filteredConditions.map((condition) => (
            <motion.button
              key={condition.name}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", ...fastSpring }}
              onClick={() => setIsTriageOpen(true)}
              className="flex items-center justify-between p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />
                </motion.div>
                <span className="font-medium">{condition.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{condition.time}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {filteredConditions.length === 0 && (
          <motion.p
            className="text-center text-muted-foreground py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No conditions found. Try a different search term.
          </motion.p>
        )}
      </motion.div>

      <TriageFlow isOpen={isTriageOpen} onClose={() => setIsTriageOpen(false)} />
    </>
  );
}

const benefits = [
  { title: "No Appointment Needed", description: "Walk in or start online. Get treatment in minutes." },
  { title: "NHS-Backed Service", description: "Part of the Pharmacy First scheme. Fully regulated." },
  { title: "Free Consultation", description: "No charge for the pharmacist consultation." },
  { title: "Prescription on the Spot", description: "Receive treatment immediately if appropriate." },
];

export default function PharmacyFirstPage() {
  const isMobile = useIsMobile();
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.2]), springConfig);
  const heroImageY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), springConfig);

  return (
    <Layout>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroImageScale, y: heroImageY }}>
          <motion.img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover object-[85%_15%] md:object-[right_top]"
            style={{ transformOrigin: "right top" }}
            initial={{ scale: 1.05, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </motion.div>

        <div className="container relative z-10">
          <motion.div variants={heroVariants.container} initial="hidden" animate="visible" className="max-w-xl">
            <motion.span
              variants={heroVariants.badge}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white mb-6"
              style={{ backgroundColor: ACCENT_COLOR }}
            >
              NHS Pharmacy First
            </motion.span>
            <motion.h1 variants={heroVariants.title} className="heading-hero text-foreground mb-6">
              Skip the GP Wait.
            </motion.h1>
            <motion.p variants={heroVariants.subtitle} className="text-elegant text-muted-foreground mb-10">
              Get same-day treatment for common conditions without a GP appointment. Free NHS service available in-store
              or online.
            </motion.p>
            <motion.div variants={heroVariants.cta}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  className="text-white hover:opacity-90 px-8 py-6 h-auto rounded-full text-base font-medium shadow-2xl"
                  style={{ backgroundColor: ACCENT_COLOR }}
                >
                  Start Consultation
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Symptom Search */}
      <section
        className="section-padding overflow-hidden"
        style={{ background: `linear-gradient(to bottom, ${ACCENT_COLOR}10, transparent)` }}
      >
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, ...springConfig }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">What Can We Treat?</h2>
            <p className="text-elegant text-muted-foreground max-w-lg mx-auto">
              Search for your condition to start a quick online consultation.
            </p>
          </motion.div>
          <SymptomSearch />
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-secondary overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, ...springConfig }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">Why Pharmacy First?</h2>
          </motion.div>

          <motion.div
            ref={benefitsRef}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, ...springConfig } },
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", ...fastSpring }}
                className="bg-white rounded-2xl p-6 text-center"
              >
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${ACCENT_COLOR}20` }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-6 h-6" style={{ color: ACCENT_COLOR }} />
                </motion.div>
                <h3 className="font-serif text-lg font-medium mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-white overflow-hidden" style={{ backgroundColor: ACCENT_COLOR }}>
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, ...springConfig }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="heading-section mb-6">Feeling Unwell?</h2>
            <p className="text-elegant text-white/80 mb-10">
              Don't wait days for a GP appointment. Get treatment today.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                className="bg-white hover:bg-white/90 px-10 py-7 h-auto rounded-full text-base font-medium shadow-2xl"
                style={{ color: ACCENT_COLOR }}
              >
                Start Free Consultation
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
