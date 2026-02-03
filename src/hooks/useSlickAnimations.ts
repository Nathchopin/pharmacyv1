import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Slick spring configs
export const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
export const fastSpring = { stiffness: 300, damping: 30, mass: 0.3 };
export const slowSpring = { stiffness: 60, damping: 25, mass: 0.8 };

// Variant presets for common animations
export const fadeInUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", ...springConfig }
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -40, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", ...springConfig }
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: 60, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", ...springConfig }
  },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: -60, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", ...springConfig }
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(12px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { type: "spring", ...springConfig }
  },
};

export const staggerContainer = (staggerDelay = 0.08) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
});

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.98,
    filter: "blur(6px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      ...springConfig,
    },
  },
};

// Hook for parallax scroll effect
export function useParallax(speed = 0.3) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]),
    fastSpring
  );

  return { ref, y };
}

// Hook for scroll-linked opacity
export function useScrollOpacity() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0, 1]),
    fastSpring
  );

  return { ref, opacity };
}

// Hook for scroll-linked scale
export function useScrollScale() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.85, 1]),
    fastSpring
  );

  return { ref, scale };
}

// Hook for magnetic hover effect
export function useMagnetic(strength = 0.3) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const x = useSpring(position.x, fastSpring);
  const y = useSpring(position.y, fastSpring);

  const handleMouse = (e: React.MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return { x, y, handleMouse, reset };
}

// Hook for 3D tilt effect
export function useTilt(intensity = 15) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const rotateX = useSpring(rotation.x, fastSpring);
  const rotateY = useSpring(rotation.y, fastSpring);

  const handleMouse = (e: React.MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    setRotation({
      x: -percentY * intensity,
      y: percentX * intensity,
    });
  };

  const reset = () => setRotation({ x: 0, y: 0 });

  return { rotateX, rotateY, handleMouse, reset };
}

// Hook for smooth counter animation
export function useCounter(target: number, duration = 2) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [hasStarted, target, duration]);

  const start = () => setHasStarted(true);

  return { count, start, ref };
}

// Hook for intersection observer with custom options
export function useIntersection(options = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-10% 0px",
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, isIntersecting };
}

// Hook for smooth scroll-linked background color
export function useScrollColor(colors: string[]) {
  const { scrollYProgress } = useScroll();
  
  const colorIndex = useTransform(
    scrollYProgress,
    colors.map((_, i) => i / (colors.length - 1)),
    colors
  );

  return colorIndex;
}

// Hero animation sequence
export const heroSequence = {
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
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", ...springConfig },
    },
  },
  title: {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 20 },
    },
  },
  subtitle: {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", ...springConfig },
    },
  },
  cta: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", ...springConfig },
    },
  },
};

// Card hover animations
export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.02,
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", ...fastSpring },
  },
};

// Button press animation
export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  pressed: { scale: 0.95 },
};
