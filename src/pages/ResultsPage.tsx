import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { BOOKING_CALENDARS } from "@/components/booking/BookingButton";
import { KlarnaBar } from "@/components/home/KlarnaBar";

// Body & Wellness Results Images
import fatFreezeBack from "@/assets/results/fat-freeze-back.png";
import fatFreezeSide from "@/assets/results/fat-freeze-side.png";
import cavitationStomach from "@/assets/results/cavitation-stomach.png";

// Skin & Facials Results Images
import iprfScalp from "@/assets/results/iprf-scalp.png";
import microneedling1 from "@/assets/results/microneedling-1.png";
import microneedling2 from "@/assets/results/microneedling-2.png";
import laserAcne from "@/assets/results/laser-acne.png";
import hifuFace from "@/assets/results/hifu-face.avif";
interface ResultItem {
  id: string;
  title: string;
  treatmentName: string;
  area: string;
  sessions: string;
  image: string;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  benefits: string[];
  categoryPath: string;
  treatmentHash: string;
  treatmentAnchor: string;
}
interface TreatmentCategory {
  id: string;
  title: string;
  description: string;
  results: ResultItem[];
  bookingType: string;
}
const treatmentResults: TreatmentCategory[] = [{
  id: "body-wellness",
  title: "Body & Wellness",
  description: "Advanced body contouring and sculpting treatments",
  bookingType: "bodyWellness",
  results: [{
    id: "fat-freeze-back",
    title: "Back Fat Reduction",
    treatmentName: "Fat Freeze (Cryolipolysis)",
    area: "Back & Love Handles",
    sessions: "After 3 Sessions",
    image: fatFreezeBack,
    objectPosition: "center center",
    benefits: ["Up to 25% fat reduction", "Non-invasive treatment", "No downtime required"],
    categoryPath: "/treatments/body-wellness",
    treatmentHash: "#body-contouring-firming",
    treatmentAnchor: "fat-freeze-cryolipolysis"
  }, {
    id: "fat-freeze-side",
    title: "Flank Transformation",
    treatmentName: "Fat Freeze (Cryolipolysis)",
    area: "Flanks & Waist",
    sessions: "After 3 Sessions",
    image: fatFreezeSide,
    objectPosition: "center center",
    benefits: ["Visible contouring", "Targeted fat elimination", "Long-lasting results"],
    categoryPath: "/treatments/body-wellness",
    treatmentHash: "#body-contouring-firming",
    treatmentAnchor: "fat-freeze-cryolipolysis"
  }, {
    id: "cavitation-stomach",
    title: "Stomach Sculpting",
    treatmentName: "Ultrasound Cavitation",
    area: "Abdomen",
    sessions: "After 6 Sessions",
    image: cavitationStomach,
    objectPosition: "center center",
    benefits: ["Breaks down fat cells", "Improves skin texture", "Reduces circumference"],
    categoryPath: "/treatments/body-wellness",
    treatmentHash: "#body-contouring-firming",
    treatmentAnchor: "ultrasound-cavitation"
  }]
}, {
  id: "skin-facials",
  title: "Skin & Facials",
  description: "Advanced skin rejuvenation and facial treatments",
  bookingType: "skinFacials",
  results: [{
    id: "iprf-scalp",
    title: "Hair Restoration",
    treatmentName: "I-PRF (Injectable Platelet Rich Fibrin)",
    area: "Scalp Treatment",
    sessions: "After 4 Sessions",
    image: iprfScalp,
    objectPosition: "center 30%",
    objectFit: "cover",
    benefits: ["Stimulates hair growth", "Natural regeneration", "Thicker, fuller hair"],
    categoryPath: "/treatments/skin-facials",
    treatmentHash: "#lifting-tightening",
    treatmentAnchor: "i-prf-injectable-platelet-rich-fibrin"
  }, {
    id: "microneedling-1",
    title: "Acne Scar Reduction",
    treatmentName: "Microneedling",
    area: "Full Face",
    sessions: "After 4 Sessions",
    image: microneedling1,
    objectPosition: "center 40%",
    objectFit: "cover",
    benefits: ["Reduces scarring", "Evens skin tone", "Boosts collagen"],
    categoryPath: "/treatments/skin-facials",
    treatmentHash: "#skin-resurfacing-texture-refinement",
    treatmentAnchor: "microneedling"
  }, {
    id: "microneedling-2",
    title: "Skin Texture Renewal",
    treatmentName: "Microneedling",
    area: "Full Face",
    sessions: "After 3 Sessions",
    image: microneedling2,
    objectPosition: "center 40%",
    objectFit: "cover",
    benefits: ["Smooths texture", "Minimizes pores", "Youthful glow"],
    categoryPath: "/treatments/skin-facials",
    treatmentHash: "#skin-resurfacing-texture-refinement",
    treatmentAnchor: "microneedling"
  }, {
    id: "laser-acne",
    title: "Acne Clearance",
    treatmentName: "Laser Acne Treatment",
    area: "Full Face",
    sessions: "After 6 Sessions",
    image: laserAcne,
    objectPosition: "center 35%",
    objectFit: "cover",
    benefits: ["Clears active acne", "Reduces inflammation", "Prevents scarring"],
    categoryPath: "/treatments/skin-facials",
    treatmentHash: "#advanced-laser-light-therapies",
    treatmentAnchor: "laser-acne-treatment"
  }, {
    id: "hifu-face",
    title: "Non-Surgical Facelift",
    treatmentName: "HIFU Non-Surgical Face Lift",
    area: "Face & Neck",
    sessions: "After 1 Session",
    image: hifuFace,
    objectPosition: "center center",
    objectFit: "cover",
    benefits: ["Lifts & tightens", "Stimulates collagen", "No surgery required"],
    categoryPath: "/treatments/skin-facials",
    treatmentHash: "#lifting-tightening",
    treatmentAnchor: "hifu-non-surgical-face-lift"
  }]
}];
const ResultsPage = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const {
    openBookingModal
  } = useBookingModal();
  const navigate = useNavigate();
  const activeCategory = treatmentResults[activeCategoryIndex];
  const activeResult = activeCategory.results[activeResultIndex];
  const handleCategoryChange = (index: number) => {
    setActiveCategoryIndex(index);
    setActiveResultIndex(0);
  };
  const handleNavigateToTreatment = (result: ResultItem) => {
    // Navigate to the treatment category page with the specific treatment anchor
    navigate(`${result.categoryPath}#${result.treatmentAnchor}`);
  };
  return <Layout>
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-10 md:pb-16 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="container relative z-10 px-4 md:px-6">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              
              
            </div>
            <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6">Before & After Results</h1>
            <p className="text-elegant text-muted-foreground max-w-2xl mx-auto text-sm md:text-base px-2">
              Witness the transformative power of our advanced treatments. Every image showcases real results from real clients at Cocolas Clinic.
            </p>
          </motion.div>
        </div>
      </section>

      <KlarnaBar />

      {/* Category Tabs */}
      <section className="py-4 md:py-8 bg-background border-b border-border sticky top-[64px] z-40">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {treatmentResults.map((category, index) => <button key={category.id} onClick={() => handleCategoryChange(index)} className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-label text-[10px] md:text-xs whitespace-nowrap transition-all duration-300 ${activeCategoryIndex === index ? "bg-accent text-white shadow-lg" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                {category.title}
              </button>)}
            <span className="text-muted-foreground text-xs md:text-sm italic ml-2 md:ml-4 whitespace-nowrap">
              More coming soon...
            </span>
          </div>
        </div>
      </section>

      {/* Main Results Gallery */}
      <section className="py-8 md:py-16 lg:py-20 bg-background relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-48 md:w-96 h-48 md:h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-1/4 left-0 w-36 md:w-72 h-36 md:h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />

        <div className="container max-w-6xl relative z-10 px-4 md:px-6">
          {/* Category Header */}
          <motion.div key={activeCategory.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="mb-6 md:mb-12">
            <h2 className="heading-section text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3">{activeCategory.title}</h2>
            <p className="text-elegant text-muted-foreground text-sm md:text-base">{activeCategory.description}</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
            {/* Image Showcase */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="relative">
              <div className="relative aspect-[4/3] rounded-lg md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                {/* Main Image with Animation */}
                <AnimatePresence mode="wait">
                  <motion.div key={activeResult.id} initial={{
                  opacity: 0,
                  scale: 1.05
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} exit={{
                  opacity: 0,
                  scale: 0.95
                }} transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }} className="absolute inset-0">
                    <img src={activeResult.image} alt={activeResult.title} className={`w-full h-full ${activeResult.objectFit === "cover" ? "object-cover" : "object-contain bg-black/5"}`} style={{
                    objectPosition: activeResult.objectPosition || "center center"
                  }} />
                  </motion.div>
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Result Badge */}
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.3
              }} className="absolute top-3 left-3 md:top-6 md:left-6">
                  <div className="bg-accent text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-label text-[10px] md:text-xs font-medium shadow-lg">
                    {activeResult.sessions}
                  </div>
                </motion.div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeResult.id} initial={{
                    opacity: 0,
                    y: 20
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    y: -20
                  }} transition={{
                    duration: 0.4
                  }}>
                      <p className="text-white/70 text-label text-[10px] md:text-xs mb-0.5 md:mb-1">
                        {activeResult.treatmentName}
                      </p>
                      <h3 className="text-white text-lg md:text-2xl lg:text-3xl font-medium font-oswald uppercase tracking-wide mb-0.5 md:mb-1">
                        {activeResult.title}
                      </h3>
                      <p className="text-white/60 text-xs md:text-sm">
                        {activeResult.area}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Hover Effect - Reveal Benefits */}
                <motion.div initial={false} animate={{
                opacity: isHovering ? 1 : 0
              }} transition={{
                duration: 0.3
              }} className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-white p-8">
                    <p className="text-label text-accent text-xs mb-4">Key Benefits</p>
                    <ul className="space-y-3">
                      {activeResult.benefits.map((benefit, index) => <motion.li key={benefit} initial={{
                      opacity: 0,
                      x: -20
                    }} animate={{
                      opacity: isHovering ? 1 : 0,
                      x: isHovering ? 0 : -20
                    }} transition={{
                      delay: index * 0.1 + 0.1
                    }} className="flex items-center gap-3 justify-center">
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                          <span className="text-lg">{benefit}</span>
                        </motion.li>)}
                    </ul>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements - Hidden on mobile */}
              <div className="hidden md:block absolute -bottom-4 -right-4 w-32 h-32 border-2 border-accent/20 rounded-2xl -z-10" />
              <div className="hidden md:block absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-2xl blur-xl -z-10" />
            </motion.div>

            {/* Results Navigation & Details */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} className="space-y-4 md:space-y-6">
              {/* Result Thumbnails */}
              <div className="space-y-2">
                {activeCategory.results.map((result, index) => <motion.button key={result.id} onClick={() => setActiveResultIndex(index)} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-left group ${activeResultIndex === index ? "bg-accent/10 border border-accent/30" : "bg-secondary hover:bg-secondary/80 border border-transparent"}`} whileTap={{
                scale: 0.98
              }}>
                    {/* Thumbnail */}
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden flex-shrink-0 ring-2 ring-offset-1 ring-offset-background transition-all duration-300 ${activeResultIndex === index ? "ring-accent" : "ring-transparent"}`}>
                      <img src={result.image} alt={result.title} className="w-full h-full object-cover" style={{
                    objectPosition: result.objectPosition || "center center"
                  }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-[9px] md:text-[10px] text-accent mb-0.5 uppercase tracking-wider font-medium truncate">
                        {result.treatmentName}
                      </p>
                      <h4 className="font-medium text-sm md:text-base text-foreground leading-tight">
                        {result.title}
                      </h4>
                      <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5">
                        {result.area} • {result.sessions}
                      </p>
                    </div>

                    {/* Arrow - Navigate to Treatment */}
                    <button onClick={e => {
                  e.stopPropagation();
                  handleNavigateToTreatment(result);
                }} className="p-1.5 rounded-full bg-accent/10 hover:bg-accent hover:text-white transition-all duration-300 group/arrow flex-shrink-0" title={`View ${result.treatmentName} details`}>
                      <ArrowRight className="w-4 h-4 text-accent group-hover/arrow:text-white transition-colors" />
                    </button>
                  </motion.button>)}
              </div>

              {/* CTA */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.6
            }} className="pt-4 md:pt-6 border-t border-border">
                <Button onClick={() => openBookingModal(BOOKING_CALENDARS.consultation)} className="w-full bg-accent hover:bg-accent/90 py-4 md:py-6 tracking-wider text-white text-sm">
                  Book Free Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-center text-[11px] md:text-sm text-muted-foreground mt-2 md:mt-3">
                  Free consultation • No obligation
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-secondary">
        <div className="container max-w-5xl">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="text-center mb-12">
            <h2 className="heading-section mb-4">Why Clients Choose Us</h2>
            <p className="text-elegant text-muted-foreground">
              Our commitment to excellence delivers results you can trust.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{
            value: "500+",
            label: "Treatments Done"
          }, {
            value: "95%",
            label: "Client Satisfaction"
          }, {
            value: "1000+",
            label: "Happy Clients"
          }, {
            value: "5★",
            label: "Average Rating"
          }].map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="text-center p-8 bg-background rounded-xl shadow-sm">
                <p className="text-4xl md:text-5xl font-oswald font-medium text-accent mb-2">
                  {stat.value}
                </p>
                <p className="text-label text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      
    </Layout>;
};
export default ResultsPage;