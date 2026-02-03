import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView,
  MotionValue,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { useRef, ReactNode, useState, useEffect, useCallback } from "react";

// ============================================
// FLUID MOTION SYSTEM
// Juniper/Apple-inspired smooth animations
// ============================================

// Premium spring configs - buttery smooth
export const fluidSpring = { 
  stiffness: 80, 
  damping: 20, 
  mass: 0.8,
  restDelta: 0.001 
};

export const snappySpring = { 
  stiffness: 400, 
  damping: 40, 
  mass: 0.5 
};

export const gentleSpring = { 
  stiffness: 50, 
  damping: 25, 
  mass: 1 
};

// Legacy aliases for backwards compatibility
export const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
export const fastSpring = { stiffness: 300, damping: 30 };

// Elastic easing for premium feel
export const elasticOut = [0.34, 1.56, 0.64, 1] as const;
export const smoothOut = [0.22, 1, 0.36, 1] as const;

// ===== SCROLL-LINKED SECTION REVEAL =====
interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SectionReveal({ children, className = "", delay = 0 }: SectionRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-20% 0px -20% 0px"
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        y: 100,
        filter: "blur(20px)",
        scale: 0.95
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        filter: "blur(0px)",
        scale: 1
      } : {}}
      transition={{
        duration: 1.2,
        delay,
        ease: smoothOut,
        opacity: { duration: 0.8 },
        filter: { duration: 0.6 },
        scale: { duration: 1, ease: elasticOut }
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== SMOOTH PARALLAX CONTAINER =====
interface SmoothParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -1 to 1
  scale?: boolean;
  opacity?: boolean;
}

export function SmoothParallax({ 
  children, 
  className = "", 
  speed = 0.2,
  scale = false,
  opacity = false
}: SmoothParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y = useTransform(smoothProgress, [0, 1], [speed * 150, speed * -150]);
  const scaleValue = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacityValue = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ 
        y,
        scale: scale ? scaleValue : 1,
        opacity: opacity ? opacityValue : 1
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== STAGGERED GRID =====
interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerGrid({ 
  children, 
  className = "",
  staggerDelay = 0.1
}: StaggerGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.2,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== STAGGERED GRID ITEM =====
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerGridItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 80,
          scale: 0.9,
          filter: "blur(15px)"
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.8,
            ease: smoothOut,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== FLUID CARD =====
// Premium hover with 3D tilt, glow, and lift
interface FluidCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  tiltIntensity?: number;
}

export function FluidCard({ 
  children, 
  className = "",
  glowColor = "rgba(255,255,255,0.1)",
  tiltIntensity = 10
}: FluidCardProps) {
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
    
    rotateX.set(-percentY * tiltIntensity);
    rotateY.set(percentX * tiltIntensity);
    
    // Glow follows cursor
    const glowXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const glowYPercent = ((e.clientY - rect.top) / rect.height) * 100;
    glowX.set(glowXPercent);
    glowY.set(glowYPercent);
  }, [tiltIntensity, rotateX, rotateY, glowX, glowY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  }, [rotateX, rotateY, glowX, glowY]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      whileHover={{
        y: -12,
        scale: 1.02,
        transition: { duration: 0.4, ease: smoothOut }
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${springGlowX}% ${springGlowY}%, ${glowColor}, transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.div>
  );
}

// ===== TEXT SLIDE UP =====
interface TextSlideUpProps {
  children: string;
  className?: string;
  delay?: number;
}

export function TextSlideUp({ children, className = "", delay = 0 }: TextSlideUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span ref={ref} className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{
          duration: 0.8,
          delay,
          ease: elasticOut,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// ===== WORD STAGGER =====
interface WordStaggerProps {
  children: string;
  className?: string;
  delay?: number;
}

export function WordStagger({ children, className = "", delay = 0 }: WordStaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const words = children.split(" ");

  return (
    <motion.span
      ref={ref}
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { 
                y: "100%", 
                opacity: 0,
                rotateX: 45
              },
              visible: {
                y: 0,
                opacity: 1,
                rotateX: 0,
                transition: {
                  duration: 0.6,
                  ease: elasticOut,
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// ===== MAGNETIC BUTTON =====
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ 
  children, 
  className = "",
  strength = 0.4
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, snappySpring);
  const springY = useSpring(y, snappySpring);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  }, [strength, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", ...snappySpring }}
    >
      {children}
    </motion.div>
  );
}

// ===== SCROLL VELOCITY =====
// Creates momentum-based scroll effects
export function useScrollVelocity() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  return smoothVelocity;
}

// ===== FADE SECTION =====
// Full section with scroll-linked opacity
interface FadeSectionProps {
  children: ReactNode;
  className?: string;
}

export function FadeSection({ children, className = "" }: FadeSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0, 1]),
    gentleSpring
  );

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [100, 0]),
    gentleSpring
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  );
}

// ===== REVEAL ON HOVER =====
interface RevealOnHoverProps {
  children: ReactNode;
  revealed: ReactNode;
  className?: string;
}

export function RevealOnHover({ children, revealed, className = "" }: RevealOnHoverProps) {
  return (
    <motion.div 
      className={`relative overflow-hidden ${className}`}
      initial="rest"
      whileHover="hover"
    >
      <motion.div
        variants={{
          rest: { y: 0 },
          hover: { y: -30, opacity: 0 }
        }}
        transition={{ duration: 0.4, ease: smoothOut }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        variants={{
          rest: { y: 30, opacity: 0 },
          hover: { y: 0, opacity: 1 }
        }}
        transition={{ duration: 0.4, ease: smoothOut }}
      >
        {revealed}
      </motion.div>
    </motion.div>
  );
}

// ===== ANIMATED COUNTER =====
interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({ 
  value, 
  className = "",
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Smooth easing
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (value - startValue) * eased;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
      {suffix}
    </span>
  );
}

// ===== HERO ENTRANCE VARIANTS =====
export const heroVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  },
  badge: {
    hidden: { opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.8,
        ease: smoothOut,
      },
    },
  },
  title: {
    hidden: { opacity: 0, y: 80, filter: "blur(20px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration: 1,
        ease: elasticOut,
      },
    },
  },
  subtitle: {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration: 0.8,
        ease: smoothOut,
      },
    },
  },
  cta: {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: elasticOut,
      },
    },
  },
  image: {
    hidden: { opacity: 0, scale: 0.85, x: 100, filter: "blur(30px)" },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { 
        duration: 1.2,
        ease: smoothOut,
      },
    },
  },
};

// ===== CARD VARIANTS =====
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 100,
    scale: 0.9,
    filter: "blur(20px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: smoothOut,
    },
  },
};
