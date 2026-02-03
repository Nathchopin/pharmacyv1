import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { smoothOut, elasticOut, fluidSpring } from "@/components/animations/FluidMotion";
import { useIsMobile } from "@/hooks/use-mobile";

// Import carousel images
import weightLossImg from "@/assets/carousel/weight-loss.png";
import hairLossImg from "@/assets/carousel/hair-loss.png";
import bloodTestImg from "@/assets/carousel/blood-test.png";
import pharmacyFirstImg from "@/assets/carousel/pharmacy-first.png";
import travelImg from "@/assets/carousel/travel.png";
import shopImg from "@/assets/carousel/shop.avif";
interface Slide {
  id: number;
  headline: string;
  subhead: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  accentColor: string;
}
const slides: Slide[] = [
  {
    id: 1,
    headline: "Lose the weight. For good.",
    subhead: "Clinically proven GLP-1 treatments. Supervised by UK pharmacists.",
    buttonText: "Check Eligibility",
    buttonLink: "/weight-loss",
    image: weightLossImg,
    accentColor: "#134E4A",
  },
  {
    id: 2,
    headline: "Keep your hair.",
    subhead: "FDA-approved treatments for male pattern baldness. Discreet delivery.",
    buttonText: "Start Treatment",
    buttonLink: "/hair",
    image: hairLossImg,
    accentColor: "#1F2937",
  },
  {
    id: 3,
    headline: "Decode your health.",
    subhead: "Clinical-grade diagnostics. Results analysed within 48 hours.",
    buttonText: "View Panels",
    buttonLink: "/blood-tests",
    image: bloodTestImg,
    accentColor: "#EF4444",
  },
  {
    id: 4,
    headline: "Skip the GP Wait.",
    subhead: "Same-day treatment for common conditions. Free NHS service.",
    buttonText: "Start Triage",
    buttonLink: "/pharmacy-first",
    image: pharmacyFirstImg,
    accentColor: "#005EB8",
  },
  {
    id: 5,
    headline: "Explore safely.",
    subhead: "Complete travel health consultations with required vaccinations.",
    buttonText: "Find Destination",
    buttonLink: "/travel",
    image: travelImg,
    accentColor: "#8B5CF6",
  },
  {
    id: 6,
    headline: "Daily Essentials.",
    subhead: "Premium supplements and health products, curated by our pharmacists.",
    buttonText: "Browse Shop",
    buttonLink: "/shop",
    image: shopImg,
    accentColor: "#EC4899",
  },
];
const SLIDE_DURATION = 4000;

// Enhanced text animation variants
const textVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
  },
};
const headlineVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    filter: "blur(25px)",
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 1,
      ease: elasticOut,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    filter: "blur(10px)",
    transition: {
      duration: 0.4,
    },
  },
};
const subheadVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    filter: "blur(15px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: smoothOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};
const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: elasticOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
};
export function CinematicCarousel() {
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLElement>(null);

  // Smooth parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const smoothScrollProgress = useSpring(scrollYProgress, fluidSpring);
  const parallaxY = useTransform(smoothScrollProgress, [0, 1], [0, 200]);
  const parallaxScale = useTransform(smoothScrollProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(smoothScrollProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(smoothScrollProgress, [0, 0.5], [0, 100]);
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
    progressRef.current = 0;
    startTimeRef.current = performance.now();
  }, []);

  // Progress bar animation with smooth easing
  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }
    startTimeRef.current = performance.now() - progressRef.current * SLIDE_DURATION;
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const newProgress = Math.min(elapsed / SLIDE_DURATION, 1);
      progressRef.current = newProgress;
      setProgress(newProgress);
      if (newProgress >= 1) {
        nextSlide();
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, currentSlide, nextSlide]);
  const currentAccent = slides[currentSlide].accentColor;
  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Smooth Parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 1,
            ease: smoothOut,
          }}
          className="absolute inset-0"
          style={{
            y: parallaxY,
            scale: parallaxScale,
          }}
        >
          <motion.img
            src={slides[currentSlide].image}
            alt=""
            className="w-full h-full object-cover object-[85%_15%] md:object-[right_top]"
            style={{
              transformOrigin: "right top",
            }}
            initial={{
              scale: 1.05,
              filter: "blur(10px)",
            }}
            animate={{
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1.4,
              ease: smoothOut,
            }}
          />
          {/* Light overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content with scroll-linked effects */}
      <motion.div
        className="container relative z-10 pt-32 pb-20"
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} initial="hidden" animate="visible" exit="exit" variants={textVariants}>
              {/* Headline with fluid reveal */}
              <motion.h1 className="heading-hero text-foreground mb-8" variants={headlineVariants}>
                {slides[currentSlide].headline}
              </motion.h1>

              {/* Subhead with smooth blur */}
              <motion.p className="text-elegant text-muted-foreground max-w-xl mb-12" variants={subheadVariants}>
                {slides[currentSlide].subhead}
              </motion.p>

              {/* Button with magnetic effect */}
              <motion.div variants={buttonVariants}>
                <motion.div
                  whileHover={{
                    scale: 1.06,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                  }}
                >
                  <Button
                    asChild
                    className="text-white hover:opacity-90 px-10 py-7 h-auto rounded-full text-base font-medium transition-all duration-500 shadow-2xl hover:shadow-3xl"
                    style={{
                      backgroundColor: currentAccent,
                    }}
                  >
                    <Link to={slides[currentSlide].buttonLink} onClick={() => window.scrollTo(0, 0)}>
                      {slides[currentSlide].buttonText}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators with fluid progress */}
        <motion.div
          className="flex justify-start gap-3 mt-16"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            ease: smoothOut,
          }}
        >
          {slides.map((slide, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setProgress(0);
                progressRef.current = 0;
                startTimeRef.current = performance.now();
              }}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-600"
              style={{
                width: index === currentSlide ? 56 : 6,
              }}
              aria-label={`Go to slide ${index + 1}`}
              whileHover={{
                scale: 1.3,
              }}
              whileTap={{
                scale: 0.9,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-white/25 backdrop-blur-sm" />

              {/* Progress fill for active slide */}
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: currentAccent,
                  }}
                  layoutId="carouselProgress"
                  transition={{
                    duration: 0.1,
                  }}
                />
              )}

              {/* Completed indicator */}
              {index < currentSlide && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: currentAccent,
                  }}
                  initial={{
                    scaleX: 0,
                  }}
                  animate={{
                    scaleX: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: smoothOut,
                  }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator */}
    </section>
  );
}
