import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/carousel/hair-loss.png";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  SectionReveal,
  heroVariants,
  smoothOut,
  fluidSpring,
  springConfig,
  fastSpring
} from "@/components/animations/FluidMotion";

// Charcoal (carousel color)
const ACCENT_COLOR = "#1F2937";

const treatments = [
  {
    name: "Finasteride",
    type: "Tablet",
    description: "Daily pill that blocks DHT, the hormone that causes hair loss.",
    price: "From £19/month",
  },
  {
    name: "Minoxidil",
    type: "Topical",
    description: "Twice-daily solution that stimulates hair growth.",
    price: "From £15/month",
  },
  {
    name: "Combination",
    type: "Both",
    description: "Most effective approach combining both treatments.",
    price: "From £29/month",
    popular: true,
  },
];

const results = [
  { stat: "90%", label: "See results in 6 months" },
  { stat: "66%", label: "Experience regrowth" },
  { stat: "95%", label: "Stop further loss" },
];

export default function HairPage() {
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

  const treatmentsRef = useRef(null);
  const treatmentsInView = useInView(treatmentsRef, { once: true, margin: "-10%" });

  return (
    <Layout>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
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
              Hair Loss Treatment
            </motion.span>
            <motion.h1 variants={heroVariants.title} className="heading-hero text-foreground mb-6">
              Keep Your Hair.
            </motion.h1>
            <motion.p variants={heroVariants.subtitle} className="text-elegant text-muted-foreground mb-10">
              FDA-approved treatments for male pattern baldness. 
              Discreet delivery. Expert pharmacist support.
            </motion.p>
            <motion.div variants={heroVariants.cta}>
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
                  <Link to="/hair/start">Start Treatment</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding-sm text-white overflow-hidden" style={{ backgroundColor: ACCENT_COLOR }}>
        <div className="container">
          <div className="grid grid-cols-3 gap-8 text-center">
            {results.map((result, index) => (
              <motion.div
                key={result.label}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring" as const, 
                  ...springConfig, 
                  delay: index * 0.1 
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl md:text-5xl font-serif font-medium mb-2">
                  {result.stat}
                </div>
                <div className="text-sm text-white/60">{result.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, ...springConfig }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">Treatment Options</h2>
            <p className="text-elegant text-muted-foreground max-w-lg mx-auto">
              Clinically proven solutions tailored to your needs.
            </p>
          </motion.div>

          <motion.div 
            ref={treatmentsRef}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial="hidden"
            animate={treatmentsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            {treatments.map((treatment, index) => (
              <motion.div
                key={treatment.name}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, ...springConfig } },
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", ...fastSpring }}
                className={`relative bg-secondary rounded-3xl p-8 ${treatment.popular ? "ring-2" : ""}`}
                style={treatment.popular ? { borderColor: ACCENT_COLOR, boxShadow: `0 0 0 2px ${ACCENT_COLOR}` } : {}}
              >
                {treatment.popular && (
                  <motion.div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span 
                      className="px-3 py-1 text-white text-xs font-semibold rounded-full"
                      style={{ backgroundColor: ACCENT_COLOR }}
                    >
                      Most Effective
                    </span>
                  </motion.div>
                )}
                <div className="text-sm text-muted-foreground mb-2">{treatment.type}</div>
                <h3 className="font-serif text-2xl font-medium mb-3">{treatment.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{treatment.description}</p>
                <div className="text-xl font-medium mb-6">{treatment.price}</div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-foreground/20 hover:bg-foreground hover:text-background"
                  >
                    Select
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-secondary overflow-hidden">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, ...springConfig }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">How It Works</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              { step: "1", title: "Quick Online Consultation", description: "Answer a few questions about your hair loss history." },
              { step: "2", title: "Pharmacist Review", description: "Our team reviews your answers within 24 hours." },
              { step: "3", title: "Discreet Delivery", description: "Treatment delivered in unmarked packaging." },
              { step: "4", title: "Ongoing Support", description: "Message our pharmacists anytime with questions." },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring" as const, ...springConfig, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 8 }}
                className="flex gap-6 items-start bg-white rounded-2xl p-6"
              >
                <motion.div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${ACCENT_COLOR}20` }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="font-serif text-lg font-medium" style={{ color: ACCENT_COLOR }}>
                    {item.step}
                  </span>
                </motion.div>
                <div>
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
            <p className="text-elegant text-white/80 mb-10">
              Take the first step towards thicker, healthier hair.
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
                <Link to="/hair/start">Begin Free Consultation</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
