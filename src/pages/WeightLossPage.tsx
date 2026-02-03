import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Pill, Scale, MessageCircle } from "lucide-react";
import { WeightLossCalculator } from "@/components/weight/WeightLossCalculator";
import heroImage from "@/assets/carousel/weight-loss.png";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  SectionReveal,
  heroVariants,
  smoothOut,
  fluidSpring,
  snappySpring,
  springConfig,
  fastSpring
} from "@/components/animations/FluidMotion";

// Deep Eucalyptus (carousel color)
const ACCENT_COLOR = "#134E4A";

// Titration Timeline Component
function TitrationTimeline() {
  const steps = [
    {
      phase: "The Reset",
      timing: "Month 1",
      dose: "0.25mg",
      description: "Your body adjusts. Appetite signals quiet down.",
    },
    {
      phase: "The Step Up",
      timing: "Month 2-4",
      dose: "0.5mg - 1.0mg",
      description: "Dosage increases. Significant weight shift begins.",
    },
    {
      phase: "The Maintenance",
      timing: "Month 5+",
      dose: "1.7mg - 2.4mg",
      description: "Reaching target weight and sustaining habits.",
    },
  ];

  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

      <div className="space-y-12 md:space-y-0">
        {steps.map((step, index) => (
          <motion.div
            key={step.phase}
            initial={{ opacity: 0, y: 40, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
              type: "spring" as const, 
              ...springConfig, 
              delay: index * 0.15 
            }}
            className={`relative md:flex md:items-center md:gap-8 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } md:mb-16 last:md:mb-0`}
          >
            {/* Content */}
            <div className={`md:w-[calc(50%-40px)] ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
              <motion.div 
                className="bg-secondary rounded-2xl p-6"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", ...fastSpring }}
              >
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span 
                    className="px-3 py-1 text-white text-xs font-semibold rounded-full"
                    style={{ backgroundColor: ACCENT_COLOR }}
                  >
                    {step.dose}
                  </span>
                  <span className="text-sm text-muted-foreground">{step.timing}</span>
                </div>
                <h4 className="font-serif text-xl font-medium mb-2">{step.phase}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            </div>

            {/* Node */}
            <motion.div 
              className="hidden md:flex items-center justify-center w-4 h-4 rounded-full relative z-10"
              style={{ backgroundColor: ACCENT_COLOR }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 500, damping: 25, delay: index * 0.15 + 0.2 }}
            />

            {/* Spacer */}
            <div className="hidden md:block md:w-[calc(50%-40px)]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Complete Package Component
function CompletePackage() {
  const features = [
    {
      icon: <Pill className="w-8 h-8" />,
      title: "The Medication",
      description: "GLP-1 Agonists (Wegovy/Mounjaro). Clinically proven weight loss.",
    },
    {
      icon: <Scale className="w-8 h-8" />,
      title: "The Verification",
      description: "Smart scale integration for clinical safety monitoring.",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "The Coaching",
      description: "Unlimited chat access to UK-registered Pharmacists.",
    },
  ];

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  return (
    <motion.div 
      ref={containerRef}
      className="grid md:grid-cols-3 gap-6"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          variants={{
            hidden: { opacity: 0, y: 40, scale: 0.95 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring" as const, ...springConfig },
            },
          }}
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", ...fastSpring }}
          className="bg-secondary rounded-3xl p-8 text-center"
        >
          <motion.div 
            className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"
            style={{ color: ACCENT_COLOR }}
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {feature.icon}
          </motion.div>
          <h4 className="font-serif text-xl font-medium mb-3">{feature.title}</h4>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function WeightLossPage() {
  const isMobile = useIsMobile();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageScale = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 1.2]),
    springConfig
  );

  const heroImageY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 100]),
    springConfig
  );

  return (
    <Layout>
      {/* Hero - Left-aligned with background image */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ scale: heroImageScale, y: heroImageY }}
        >
        <motion.img 
          src={heroImage} 
          alt="" 
            className="w-full h-full object-cover object-[85%_15%] md:object-[right_top]"
            style={{ transformOrigin: "right top" }}
            initial={{ scale: 1.05, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Light overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </motion.div>

        <div className="container relative z-10">
          <motion.div
            variants={heroVariants.container}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.span 
              variants={heroVariants.badge}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white mb-6"
              style={{ backgroundColor: ACCENT_COLOR }}
            >
              GLP-1 Weight Management
            </motion.span>
            <motion.h1 
              variants={heroVariants.title}
              className="heading-hero text-foreground mb-6"
            >
              Lose The Weight. For Good.
            </motion.h1>
            <motion.p 
              variants={heroVariants.subtitle}
              className="text-elegant text-muted-foreground mb-10"
            >
              Clinically proven treatments that help you lose 15% of your body weight. Supervised by UK-registered
              pharmacists.
            </motion.p>
            <motion.div 
              variants={heroVariants.cta}
              className="flex flex-wrap gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  asChild
                  className="text-white hover:opacity-90 px-8 py-6 h-auto rounded-full text-base font-medium shadow-2xl"
                  style={{ backgroundColor: ACCENT_COLOR }}
                >
                  <Link to="/weight-loss/start">Check Eligibility</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
              <Button
                  asChild
                  variant="outline"
                  className="border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-6 h-auto rounded-full text-base font-medium"
                >
                  <Link to="/weight-loss/pricing">View Pricing</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="section-padding bg-gradient-to-b from-orange-50/50 to-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ type: "spring" as const, ...springConfig }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">See Your Potential</h2>
            <p className="text-elegant text-muted-foreground max-w-lg mx-auto">
              Use our interactive calculator to visualise your weight loss journey.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ type: "spring" as const, ...springConfig, delay: 0.2 }}
          >
            <WeightLossCalculator />
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, ...springConfig }}
            className="text-center mb-16"
          >
            <h2 className="heading-section text-foreground mb-4">Your Titration Roadmap</h2>
            <p className="text-elegant text-muted-foreground max-w-lg mx-auto">
              A carefully planned journey to safe, sustainable weight loss.
            </p>
          </motion.div>
          <TitrationTimeline />
        </div>
      </section>

      {/* Package */}
      <section className="section-padding bg-secondary overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, ...springConfig }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">The Complete Package</h2>
            <p className="text-elegant text-muted-foreground max-w-lg mx-auto">
              Everything you need for lasting change.
            </p>
          </motion.div>
          <CompletePackage />
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
            <h2 className="heading-section mb-6">Ready to Start?</h2>
            <p className="text-elegant text-white/70 mb-10">
              Take our 2-minute eligibility check. No commitment required.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                asChild
                className="bg-white hover:bg-white/90 px-10 py-7 h-auto rounded-full text-base font-medium shadow-2xl"
                style={{ color: ACCENT_COLOR }}
              >
                <Link to="/weight-loss/start">Check Your Eligibility</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
