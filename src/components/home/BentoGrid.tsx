import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { Scale, Dna, Cross } from "lucide-react";
import { useRef, useCallback, useState } from "react";
import { 
  StaggerGrid, 
  StaggerGridItem,
  SectionReveal,
  snappySpring,
  smoothOut 
} from "@/components/animations/FluidMotion";

// Premium fluid card with 3D tilt, glow, and smooth lift
function FluidBentoCard({ 
  children, 
  className = "",
  to,
  glowColor = "rgba(255,255,255,0.15)"
}: { 
  children: React.ReactNode;
  className?: string;
  to: string;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const springRotateX = useSpring(rotateX, snappySpring);
  const springRotateY = useSpring(rotateY, snappySpring);
  const springGlowX = useSpring(glowX, snappySpring);
  const springGlowY = useSpring(glowY, snappySpring);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    
    rotateX.set(-percentY * 8);
    rotateY.set(percentX * 8);
    
    const glowXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const glowYPercent = ((e.clientY - rect.top) / rect.height) * 100;
    glowX.set(glowXPercent);
    glowY.set(glowYPercent);
  }, [rotateX, rotateY, glowX, glowY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  }, [rotateX, rotateY, glowX, glowY]);

  return (
    <StaggerGridItem>
      <Link
        to={to}
        onClick={() => window.scrollTo(0, 0)}
        className="group block h-full"
      >
        <motion.div
          ref={cardRef}
          className={`relative h-full ${className}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: "preserve-3d",
            transformPerspective: 1200,
          }}
          whileHover={{
            y: -16,
            scale: 1.02,
            transition: { duration: 0.5, ease: smoothOut }
          }}
        >
          {/* Glow effect following cursor */}
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
            style={{
              background: `radial-gradient(800px circle at ${springGlowX}% ${springGlowY}%, ${glowColor}, transparent 40%)`,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Subtle border glow on hover */}
          <motion.div
            className="absolute -inset-[1px] rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, ${glowColor}, transparent 50%, ${glowColor})`,
            }}
          />
          
          {children}
        </motion.div>
      </Link>
    </StaggerGridItem>
  );
}

export function BentoGrid() {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container">
        {/* Section Header with smooth reveal */}
        <SectionReveal className="text-center mb-16">
          <motion.h2 
            className="heading-section text-foreground mb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothOut, delay: 0.1 }}
          >
            What We Treat
          </motion.h2>
          <motion.p 
            className="text-elegant text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothOut, delay: 0.2 }}
          >
            Evidence-based treatments. Delivered with care.
          </motion.p>
        </SectionReveal>

        <StaggerGrid 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          staggerDelay={0.12}
        >
          {/* Weight Management - Large Card */}
          <FluidBentoCard 
            to="/weight-loss" 
            className="lg:row-span-2 min-h-[400px] lg:min-h-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 lg:p-10 shadow-sm hover:shadow-2xl transition-shadow duration-700 overflow-hidden"
            glowColor="rgba(59, 130, 246, 0.15)"
          >
            {/* Badge */}
            <motion.div 
              className="absolute top-6 right-6 z-20"
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6, ease: smoothOut }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white shadow-lg">
                Most Popular
              </span>
            </motion.div>

            {/* Icon */}
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-lg transition-all duration-500"
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
              style={{ transform: "translateZ(30px)" }}
            >
              <Scale className="w-8 h-8 text-accent" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
              <h3 className="heading-card text-foreground mb-3 group-hover:text-accent transition-colors duration-500">
                Weight Management
              </h3>
              <p className="text-body text-muted-foreground mb-6">
                Clinically proven GLP-1 treatments with expert pharmacist support. 
                Average weight loss of 15% over 52 weeks.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-accent">
                Check eligibility
                <motion.svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </motion.svg>
              </span>
            </div>

            {/* Decorative animated blur */}
            <motion.div 
              className="absolute bottom-0 right-0 w-56 h-56 bg-accent/15 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.3, 0.5, 0.3],
                x: [0, 20, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </FluidBentoCard>

          {/* Blood Tests */}
          <FluidBentoCard 
            to="/blood-tests" 
            className="min-h-[280px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-shadow duration-700 overflow-hidden"
            glowColor="rgba(16, 185, 129, 0.15)"
          >
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg transition-all duration-500"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              style={{ transform: "translateZ(25px)" }}
            >
              <Dna className="w-7 h-7 text-[hsl(var(--success))]" />
            </motion.div>

            <div style={{ transform: "translateZ(15px)" }}>
              <h3 className="heading-card text-foreground mb-2 group-hover:text-[hsl(var(--success))] transition-colors duration-500">
                Blood Tests
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Predictive health insights from home
              </p>
              <span className="inline-flex items-center text-sm font-medium text-[hsl(var(--success))]">
                View panels
                <motion.svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </span>
            </div>

            <motion.div 
              className="absolute bottom-0 right-0 w-40 h-40 bg-[hsl(var(--success))]/15 rounded-full blur-2xl"
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </FluidBentoCard>

          {/* Pharmacy First */}
          <FluidBentoCard 
            to="/pharmacy-first" 
            className="min-h-[280px] bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-shadow duration-700 overflow-hidden"
            glowColor="rgba(139, 92, 246, 0.15)"
          >
            {/* Live indicator */}
            <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--success))] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--success))]"></span>
              </span>
              <span className="text-xs font-medium text-[hsl(var(--success-dark))]">
                Online Now
              </span>
            </div>

            <motion.div 
              className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg transition-all duration-500"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              style={{ transform: "translateZ(25px)" }}
            >
              <Cross className="w-7 h-7 text-violet-600" />
            </motion.div>

            <div style={{ transform: "translateZ(15px)" }}>
              <h3 className="heading-card text-foreground mb-2 group-hover:text-violet-600 transition-colors duration-500">
                Pharmacy First
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Same-day treatment for minor ailments
              </p>
              <span className="inline-flex items-center text-sm font-medium text-violet-600">
                Start triage
                <motion.svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </span>
            </div>

            <motion.div 
              className="absolute bottom-0 right-0 w-40 h-40 bg-violet-500/15 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </FluidBentoCard>

          {/* Hair Loss */}
          <FluidBentoCard 
            to="/hair" 
            className="lg:col-span-2 min-h-[200px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-shadow duration-700 overflow-hidden"
            glowColor="rgba(245, 158, 11, 0.15)"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6" style={{ transform: "translateZ(15px)" }}>
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-500 shrink-0"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              >
                <svg
                  className="w-7 h-7 text-amber-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2C8 2 5 5 5 9c0 3 2 5.5 4 7.5L12 22l3-5.5c2-2 4-4.5 4-7.5 0-4-3-7-7-7z" />
                </svg>
              </motion.div>
              
              <div>
                <h3 className="heading-card text-foreground mb-2 group-hover:text-amber-600 transition-colors duration-500">
                  Hair Loss Treatments
                </h3>
                <p className="text-sm text-muted-foreground">
                  FDA-approved treatments for male pattern baldness. Discreet delivery.
                </p>
              </div>

              <span className="md:ml-auto inline-flex items-center text-sm font-medium text-amber-600 shrink-0">
                Learn more
                <motion.svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </span>
            </div>

            <motion.div 
              className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl"
              animate={{ scale: [1, 1.4, 1], x: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </FluidBentoCard>
        </StaggerGrid>
      </div>
    </section>
  );
}
