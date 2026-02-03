import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from "framer-motion";
import { useRef, ReactNode, useState, useEffect } from "react";

// Slick spring physics - Apple-style feel
const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
const fastSpring = { stiffness: 300, damping: 30, mass: 0.3 };

// ===== STAGGER REVEAL =====
// Container for staggered children animations
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: (staggerDelay: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  }),
};

export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.08 
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={staggerDelay}
    >
      {children}
    </motion.div>
  );
}

// ===== STAGGER ITEM =====
// Individual items that animate in sequence
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div 
      className={className} 
      variants={{
        hidden: { 
          opacity: 0, 
          y: 40,
          scale: 0.95,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 20,
            mass: 0.5,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== REVEAL ON SCROLL =====
// Single element that reveals when in viewport
interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  blur?: boolean;
}

export function Reveal({ 
  children, 
  className = "", 
  direction = "up",
  delay = 0,
  blur = true
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  const directionOffset = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction],
        filter: blur ? "blur(12px)" : "blur(0px)"
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0,
        filter: "blur(0px)"
      } : {}}
      transition={{
        type: "spring",
        ...springConfig,
        delay,
        filter: { duration: 0.5, delay }
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== PARALLAX =====
// Element with parallax scroll effect
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = slower, positive = faster
  scale?: boolean;
}

export function Parallax({ 
  children, 
  className = "", 
  speed = 0.3,
  scale = false
}: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]),
    fastSpring
  );

  const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const springScale = useSpring(scaleValue, fastSpring);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ 
        y,
        scale: scale ? springScale : 1
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== MAGNETIC =====
// Element that follows cursor with magnetic effect
interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className = "", strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const x = useSpring(position.x, fastSpring);
  const y = useSpring(position.y, fastSpring);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// ===== FLOAT =====
// Floating animation for decorative elements
interface FloatProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}

export function Float({ 
  children, 
  className = "", 
  duration = 4,
  distance = 15
}: FloatProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== TEXT REVEAL =====
// Character-by-character text reveal
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const words = text.split(" ");

  return (
    <motion.span 
      ref={ref} 
      className={`inline-flex flex-wrap ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex mr-[0.25em]">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              className="inline-block"
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: 30,
                  rotateX: 90
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    ...springConfig,
                    delay: delay + (wordIndex * 0.1) + (charIndex * 0.03),
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

// ===== SCROLL PROGRESS =====
// Hook for scroll-linked animations
export function useScrollProgress() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return { ref, scrollYProgress };
}

// ===== SCALE ON SCROLL =====
// Element that scales based on scroll position
interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
}

export function ScaleOnScroll({ children, className = "" }: ScaleOnScrollProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.8, 1]),
    fastSpring
  );

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.3], [0, 1]),
    fastSpring
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ scale, opacity }}
    >
      {children}
    </motion.div>
  );
}

// ===== HOVER TILT =====
// 3D tilt effect on hover
interface HoverTiltProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function HoverTilt({ children, className = "", intensity = 10 }: HoverTiltProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const springRotateX = useSpring(rotateX, fastSpring);
  const springRotateY = useSpring(rotateY, fastSpring);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    
    setRotateX(-percentY * intensity);
    setRotateY(percentX * intensity);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={className}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

// ===== MORPH =====
// Smooth shape morphing transition
interface MorphProps {
  children: ReactNode;
  className?: string;
  layoutId: string;
}

export function Morph({ children, className = "", layoutId }: MorphProps) {
  return (
    <motion.div
      className={className}
      layoutId={layoutId}
      transition={{
        type: "spring",
        ...springConfig,
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== COUNTER =====
// Animated number counter
interface CounterProps {
  from?: number;
  to: number;
  className?: string;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function Counter({ 
  from = 0, 
  to, 
  className = "", 
  duration = 2,
  suffix = "",
  prefix = ""
}: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;
    
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(from + (to - from) * eased);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}

// ===== SHIMMER =====
// Shimmer loading effect
interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className = "" }: ShimmerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

// ===== GRAVITY FALL =====
// Physics-based falling animation (Google Gravity style)
interface GravityItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  enabled?: boolean;
}

export function GravityItem({ 
  children, 
  className = "", 
  delay = 0,
  enabled = false
}: GravityItemProps) {
  const [hasFallen, setHasFallen] = useState(false);
  
  useEffect(() => {
    if (enabled && !hasFallen) {
      const timer = setTimeout(() => setHasFallen(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [enabled, delay, hasFallen]);

  return (
    <motion.div
      className={className}
      animate={hasFallen ? {
        y: [0, -20, 300],
        rotate: [0, -5, Math.random() * 60 - 30],
        opacity: [1, 1, 0],
      } : {}}
      transition={{
        y: { 
          times: [0, 0.1, 1],
          duration: 2,
          ease: [0.22, 1, 0.36, 1] 
        },
        rotate: {
          times: [0, 0.1, 1],
          duration: 2,
        },
        opacity: {
          times: [0, 0.8, 1],
          duration: 2,
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== PAGE TRANSITION =====
// Full page transition wrapper
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        ...springConfig,
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== HERO TEXT =====
// Cinematic hero text animation
interface HeroTextProps {
  children: ReactNode;
  className?: string;
}

export function HeroText({ children, className = "" }: HeroTextProps) {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        y: 80,
        scale: 0.9
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: 1
      }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 20,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  );
}

// ===== SPLIT TEXT =====
// Split text with staggered word animation
interface SplitTextProps {
  children: string;
  className?: string;
  wordClassName?: string;
}

export function SplitText({ children, className = "", wordClassName = "" }: SplitTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const words = children.split(" ");

  return (
    <motion.span 
      ref={ref} 
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={`inline-block mr-[0.25em] ${wordClassName}`}
          variants={{
            hidden: { 
              opacity: 0, 
              y: 20,
              filter: "blur(8px)"
            },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                type: "spring",
                ...springConfig,
                delay: index * 0.05,
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
