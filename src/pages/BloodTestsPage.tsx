import { useState, useRef, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Droplets, Brain, Zap, Shield } from "lucide-react";
import heroImage from "@/assets/carousel/blood-test.png";
import { 
  SectionReveal, 
  StaggerGrid, 
  StaggerGridItem,
  heroVariants,
  smoothOut,
  snappySpring,
  elasticOut
} from "@/components/animations/FluidMotion";

// Medical Red color
const ACCENT_COLOR = "#EF4444";

interface BodyPart {
  id: string;
  name: string;
  position: { top: string; left: string };
  panel: string;
  tests: string[];
}

const bodyParts: BodyPart[] = [
  { id: "thyroid", name: "Thyroid", position: { top: "18%", left: "50%" }, panel: "Thyroid Function", tests: ["TSH", "Free T4", "Free T3"] },
  { id: "heart", name: "Heart", position: { top: "32%", left: "45%" }, panel: "Lipid Panel", tests: ["Total Cholesterol", "HDL", "LDL", "Triglycerides"] },
  { id: "liver", name: "Liver", position: { top: "40%", left: "40%" }, panel: "Liver Function", tests: ["ALT", "AST", "GGT", "Bilirubin"] },
  { id: "kidney", name: "Kidney", position: { top: "48%", left: "58%" }, panel: "Kidney Function", tests: ["Creatinine", "eGFR", "Urea", "Sodium"] },
  { id: "blood", name: "Blood", position: { top: "55%", left: "35%" }, panel: "Full Blood Count", tests: ["Haemoglobin", "White Cells", "Platelets", "Red Cells"] },
];

function BodyMapInteractive() {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, scale: 0.95, filter: "blur(20px)" }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, ease: smoothOut }}
      className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-black/5"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Body Map */}
        <div className="relative aspect-[3/4] max-w-sm mx-auto">
          <svg viewBox="0 0 200 300" className="w-full h-full" fill="none" stroke="hsl(var(--border))" strokeWidth="1">
            <ellipse cx="100" cy="35" rx="25" ry="30" fill="hsl(var(--secondary))" />
            <rect x="90" y="60" width="20" height="15" fill="hsl(var(--secondary))" />
            <path d="M60 75 L60 180 Q60 200 80 200 L120 200 Q140 200 140 180 L140 75 Q140 70 130 70 L70 70 Q60 70 60 75Z" fill="hsl(var(--secondary))" />
            <path d="M60 80 Q40 90 35 140 Q33 160 45 160 Q55 158 58 140 L60 100" fill="hsl(var(--secondary))" />
            <path d="M140 80 Q160 90 165 140 Q167 160 155 160 Q145 158 142 140 L140 100" fill="hsl(var(--secondary))" />
            <path d="M80 200 L75 280 Q75 290 85 290 Q95 290 95 280 L100 210" fill="hsl(var(--secondary))" />
            <path d="M120 200 L125 280 Q125 290 115 290 Q105 290 105 280 L100 210" fill="hsl(var(--secondary))" />
          </svg>

          {bodyParts.map((part, index) => (
            <motion.button
              key={part.id}
              onClick={() => setSelectedPart(selectedPart?.id === part.id ? null : part)}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ 
                delay: 0.6 + index * 0.12, 
                duration: 0.6,
                ease: elasticOut
              }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center transition-all duration-500 ${
                selectedPart?.id === part.id ? "shadow-xl ring-4 ring-white" : ""
              }`}
              style={{ 
                top: part.position.top, 
                left: part.position.left,
                backgroundColor: selectedPart?.id === part.id ? ACCENT_COLOR : `${ACCENT_COLOR}33`
              }}
            >
              <motion.span
                className="w-3 h-3 rounded-full"
                animate={selectedPart?.id === part.id ? { 
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1]
                } : {}}
                transition={{ duration: 1, repeat: selectedPart?.id === part.id ? Infinity : 0 }}
                style={{ backgroundColor: selectedPart?.id === part.id ? "white" : ACCENT_COLOR }}
              />
            </motion.button>
          ))}
        </div>

        {/* Info Panel */}
        <div>
          {selectedPart ? (
            <motion.div
              key={selectedPart.id}
              initial={{ opacity: 0, x: 50, scale: 0.95, filter: "blur(15px)" }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: smoothOut }}
              className="bg-secondary rounded-2xl p-8"
            >
              <h3 className="text-2xl font-serif font-medium mb-2">{selectedPart.panel}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Biomarkers tested for {selectedPart.name.toLowerCase()} health
              </p>
              <ul className="space-y-3">
                {selectedPart.tests.map((test, index) => (
                  <motion.li 
                    key={test} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4, ease: smoothOut }}
                  >
                    <motion.div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: ACCENT_COLOR }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.08 + 0.1, type: "spring", stiffness: 500 }}
                    />
                    <span className="text-sm font-medium">{test}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button className="mt-8 text-white rounded-full shadow-xl" style={{ backgroundColor: ACCENT_COLOR }}>
                  Add to Order
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <h3 className="text-2xl font-serif font-medium mb-4">Tap a Body Part</h3>
              <p className="text-muted-foreground">
                Click on any highlighted area to explore the available blood tests for that organ or system.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const panels = [
  { name: "Essential Health", price: "£89", tests: 12, icon: <Heart className="w-6 h-6" />, color: "from-rose-50 to-pink-50", accent: "text-rose-600", glowColor: "rgba(244, 63, 94, 0.15)" },
  { name: "Men's Health", price: "£129", tests: 18, icon: <Activity className="w-6 h-6" />, color: "from-blue-50 to-indigo-50", accent: "text-indigo-600", glowColor: "rgba(99, 102, 241, 0.15)" },
  { name: "Women's Health", price: "£139", tests: 20, icon: <Droplets className="w-6 h-6" />, color: "from-purple-50 to-fuchsia-50", accent: "text-fuchsia-600", glowColor: "rgba(192, 38, 211, 0.15)" },
  { name: "Advanced Wellness", price: "£199", tests: 35, icon: <Brain className="w-6 h-6" />, color: "from-emerald-50 to-teal-50", accent: "text-teal-600", glowColor: "rgba(20, 184, 166, 0.15)" },
  { name: "Sports Performance", price: "£169", tests: 25, icon: <Zap className="w-6 h-6" />, color: "from-amber-50 to-orange-50", accent: "text-orange-600", glowColor: "rgba(249, 115, 22, 0.15)" },
  { name: "Executive Health", price: "£349", tests: 50, icon: <Shield className="w-6 h-6" />, color: "from-slate-100 to-gray-100", accent: "text-slate-700", glowColor: "rgba(100, 116, 139, 0.15)" },
];

function FluidPanelCard({ panel, index }: { panel: typeof panels[0]; index: number }) {
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
    
    rotateX.set(-percentY * 6);
    rotateY.set(percentX * 6);
    
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
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`relative bg-gradient-to-br ${panel.color} rounded-3xl p-8 shadow-sm transition-shadow duration-700 overflow-hidden`}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
          transformPerspective: 1200,
        }}
        whileHover={{
          y: -12,
          scale: 1.02,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.2)",
          transition: { duration: 0.5, ease: smoothOut }
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
          style={{
            background: `radial-gradient(600px circle at ${springGlowX}% ${springGlowY}%, ${panel.glowColor}, transparent 40%)`,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
        />

        <motion.div 
          className={`w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center mb-6 ${panel.accent} shadow-sm`}
          whileHover={{ 
            rotate: [0, -10, 10, 0], 
            scale: 1.15,
            transition: { duration: 0.5 }
          }}
          style={{ transform: "translateZ(20px)" }}
        >
          {panel.icon}
        </motion.div>
        
        <div style={{ transform: "translateZ(15px)" }}>
          <h3 className="font-serif text-xl font-medium mb-2">{panel.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{panel.tests} biomarkers tested</p>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-3xl font-serif font-medium">{panel.price}</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button variant="outline" className="w-full rounded-full border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300">
              View Details
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </StaggerGridItem>
  );
}

export default function BloodTestsPage() {
  const heroRef = useRef(null);

  return (
    <Layout>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center pt-28 overflow-hidden bg-gradient-to-br from-red-50/50 to-background">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={heroVariants.container}
              initial="hidden"
              animate="visible"
            >
              <motion.span 
                variants={heroVariants.badge}
                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-white mb-6 shadow-lg"
                style={{ backgroundColor: ACCENT_COLOR }}
              >
                Clinical-Grade Diagnostics
              </motion.span>
              <motion.h1 variants={heroVariants.title} className="heading-hero text-foreground mb-6">
                Decode Your Health.
              </motion.h1>
              <motion.p variants={heroVariants.subtitle} className="text-elegant text-muted-foreground mb-10 max-w-lg">
                Comprehensive blood testing from home. Results analysed by 
                qualified clinicians within 48 hours.
              </motion.p>
              <motion.div variants={heroVariants.cta}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className="text-white hover:opacity-90 px-10 py-7 h-auto rounded-full text-base font-medium shadow-2xl"
                    style={{ backgroundColor: ACCENT_COLOR }}
                  >
                    Browse Test Panels
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={heroVariants.image}
              initial="hidden"
              animate="visible"
              className="relative hidden lg:block"
            >
              <motion.img 
                src={heroImage} 
                alt="Blood testing" 
                className="w-full max-w-md ml-auto rounded-3xl shadow-2xl object-cover"
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              
              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-red-100 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.3, 1], 
                  opacity: [0.5, 0.8, 0.5] 
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Body Map */}
      <section className="section-padding bg-gradient-to-b from-red-50/50 to-background overflow-hidden">
        <div className="container">
          <SectionReveal className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">Explore By Organ</h2>
            <p className="text-elegant text-muted-foreground max-w-lg mx-auto">
              Interactive body map to help you find the right tests.
            </p>
          </SectionReveal>
          <BodyMapInteractive />
        </div>
      </section>

      {/* Test Panels */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container">
          <SectionReveal className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4">Pre-Built Panels</h2>
            <p className="text-elegant text-muted-foreground max-w-lg mx-auto">
              Curated test combinations for comprehensive health insights.
            </p>
          </SectionReveal>

          <StaggerGrid 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.1}
          >
            {panels.map((panel, index) => (
              <FluidPanelCard key={panel.name} panel={panel} index={index} />
            ))}
          </StaggerGrid>
        </div>
      </section>
    </Layout>
  );
}
