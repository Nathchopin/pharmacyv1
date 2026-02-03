import { Layout } from "@/components/layout/Layout";
import { CinematicCarousel } from "@/components/home/CinematicCarousel";
import { BentoGrid } from "@/components/home/BentoGrid";
import { TriageFlowTrigger } from "@/components/home/TriageFlow";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { 
  SectionReveal, 
  SmoothParallax,
  AnimatedCounter,
  MagneticButton,
  smoothOut,
  fluidSpring 
} from "@/components/animations/FluidMotion";

const Index = () => {
  const statsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"],
  });

  const statsY = useSpring(
    useTransform(scrollYProgress, [0, 1], [80, -80]),
    fluidSpring
  );

  return (
    <Layout>
      <CinematicCarousel />
      <BentoGrid />

      {/* Trust Section */}
      <section className="section-padding bg-secondary overflow-hidden">
        <div className="container">
          <SectionReveal className="text-center max-w-3xl mx-auto">
            <motion.h2 
              className="heading-section text-foreground mb-6"
              initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: smoothOut }}
            >
              Healthcare That Fits Your Life
            </motion.h2>
            <motion.p 
              className="text-elegant text-muted-foreground mb-10"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: smoothOut, delay: 0.15 }}
            >
              No waiting rooms. No awkward conversations. Get expert pharmacist 
              advice and clinically-proven treatments delivered to your door.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: smoothOut, delay: 0.3 }}
            >
              <MagneticButton strength={0.3}>
                <TriageFlowTrigger />
              </MagneticButton>
            </motion.div>
          </SectionReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="section-padding-sm bg-foreground text-background overflow-hidden"
      >
        <motion.div 
          className="container"
          style={{ y: statsY }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 50, suffix: "k+", label: "Patients Treated" },
              { value: 4.9, suffix: "★", label: "Trustpilot Rating", decimals: 1 },
              { value: 24, suffix: "h", label: "Avg. Dispatch Time" },
              { value: 0, text: "GPhC", label: "Registered" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8,
                  ease: smoothOut,
                  delay: index * 0.1 
                }}
              >
                <motion.div 
                  className="text-4xl md:text-5xl font-serif font-medium mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {stat.text ? stat.text : (
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix}
                      duration={2.5}
                      decimals={stat.decimals || 0}
                    />
                  )}
                </motion.div>
                <motion.div 
                  className="text-sm text-background/60"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Index;
