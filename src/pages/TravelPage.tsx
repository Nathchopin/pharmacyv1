import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, MapPin, AlertTriangle, Shield, Syringe, Plane, 
  Loader2, CheckCircle, X, Droplets, Phone, Calendar, 
  Package, Pill, ChevronDown, ChevronUp
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/carousel/travel.png";
import { 
  heroVariants,
  springConfig,
  fastSpring
} from "@/components/animations/FluidMotion";
import { useTravelHealthAdvisor, TravelHealthAdvice } from "@/hooks/useTravelHealthAdvisor";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

// Pharmacy Purple (carousel color)
const ACCENT_COLOR = "#8B5CF6";

const riskColors = {
  low: { bg: "bg-success/10", text: "text-[hsl(var(--success-dark))]", dot: "bg-[hsl(var(--success))]", label: "Low Risk" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Medium Risk" },
  high: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "High Risk" },
};

function TravelAdviceCard({ advice, onClose }: { advice: TravelHealthAdvice; onClose: () => void }) {
  const risk = riskColors[advice.riskLevel];
  const [vaccinesExpanded, setVaccinesExpanded] = useState(true);
  const [adviceExpanded, setAdviceExpanded] = useState(true);
  const [bundleExpanded, setBundleExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl shadow-2xl border border-border/50 overflow-hidden max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50" style={{ background: `linear-gradient(135deg, ${ACCENT_COLOR}15, ${ACCENT_COLOR}05)` }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${ACCENT_COLOR}20` }}>
              <MapPin className="w-7 h-7" style={{ color: ACCENT_COLOR }} />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-medium">{advice.destination}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${risk.bg} ${risk.text}`}>
                  <span className={`w-2 h-2 rounded-full ${risk.dot}`} />
                  {risk.label}
                </span>
                {advice.malariaInfo.risk && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                    <AlertTriangle className="w-3 h-3" /> Malaria Zone
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-4">{advice.summary}</p>
      </div>

      <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
        {/* Vaccines Section */}
        <Collapsible open={vaccinesExpanded} onOpenChange={setVaccinesExpanded}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full text-left group">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
                <h3 className="font-medium text-lg">Vaccination Requirements</h3>
              </div>
              {vaccinesExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            {advice.requiredVaccines.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Required Vaccines
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {advice.requiredVaccines.map((vaccine, i) => (
                    <div key={i} className="p-3 rounded-xl bg-red-50 border border-red-100">
                      <p className="font-medium text-sm">{vaccine.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{vaccine.description}</p>
                      <p className="text-xs text-red-600 mt-1">⏱️ {vaccine.timing}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {advice.recommendedVaccines.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-amber-600 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Recommended Vaccines
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {advice.recommendedVaccines.map((vaccine, i) => (
                    <div key={i} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                      <p className="font-medium text-sm">{vaccine.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{vaccine.description}</p>
                      <p className="text-xs text-amber-600 mt-1">⏱️ {vaccine.timing}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Malaria Info */}
        {advice.malariaInfo.risk && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-red-600" />
              <h3 className="font-medium text-red-700">Malaria Protection Required</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{advice.malariaInfo.zones}</p>
            <p className="text-sm"><strong>Recommended prophylaxis:</strong> {advice.malariaInfo.prophylaxis}</p>
          </div>
        )}

        {/* Health Advice */}
        <Collapsible open={adviceExpanded} onOpenChange={setAdviceExpanded}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
                <h3 className="font-medium text-lg">Health Advice</h3>
              </div>
              {adviceExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 grid sm:grid-cols-2 gap-3">
            {advice.healthAdvice.map((tip, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/50 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Food & Water Safety */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-700">Food & Water Safety</h3>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${advice.foodWaterSafety.tapWaterSafe ? "bg-success/20 text-success" : "bg-red-100 text-red-600"}`}>
              Tap Water: {advice.foodWaterSafety.tapWaterSafe ? "Safe" : "Not Safe"}
            </span>
          </div>
          <ul className="space-y-1">
            {advice.foodWaterSafety.tips.map((tip, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-blue-500">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Travel Bundle */}
        <Collapsible open={bundleExpanded} onOpenChange={setBundleExpanded}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full text-left">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
                <h3 className="font-medium text-lg">Travel Health Bundle</h3>
              </div>
              {bundleExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Essential Kit
                </h4>
                <ul className="space-y-1">
                  {advice.travelBundle.essentialKit.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Pill className="w-4 h-4" /> Medications to Pack
                </h4>
                <ul className="space-y-1">
                  {advice.travelBundle.medications.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-eucalyptus/10 border border-eucalyptus/20 text-center">
              <p className="text-sm text-eucalyptus font-medium">
                Estimated Vaccine Cost: {advice.travelBundle.estimatedVaccineCost}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Emergency Info */}
        <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-medium">Emergency Contacts</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Local Emergency</p>
              <p className="font-medium">{advice.emergencyInfo.localEmergency}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">UK Embassy</p>
              <p className="font-medium">{advice.emergencyInfo.ukEmbassy}</p>
            </div>
          </div>
        </div>

        {/* Best Time to Visit */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Best Time to Visit (Health)</p>
            <p className="text-sm">{advice.bestTimeToVisit}</p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-6 border-t border-border/50 bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 text-white rounded-full" style={{ backgroundColor: ACCENT_COLOR }}>
            Book Vaccination Appointment
          </Button>
          <Button variant="outline" className="flex-1 rounded-full">
            Download Travel Pack
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function DestinationSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { advice, loading, error, fetchAdvice, clearAdvice } = useTravelHealthAdvisor();

  const handleSearch = () => {
    if (query.trim()) {
      fetchAdvice(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        className="relative"
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Where are you traveling? (e.g. Thailand, Kenia, Brazl...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="w-full h-16 pl-14 pr-32 text-lg rounded-2xl border-2 border-transparent bg-white shadow-lg focus:border-accent focus:ring-0 transition-all duration-300"
        />
        <div className="absolute inset-y-0 right-3 flex items-center gap-2">
          <Button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="rounded-full text-white px-6"
            style={{ backgroundColor: ACCENT_COLOR }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-500 mt-4"
        >
          {error}
        </motion.p>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8"
        >
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: ACCENT_COLOR }} />
          <p className="text-muted-foreground">Generating travel health advice...</p>
          <p className="text-xs text-muted-foreground mt-1">Our AI is analyzing vaccination requirements and health risks</p>
        </motion.div>
      )}

      <AnimatePresence>
        {advice && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <TravelAdviceCard advice={advice} onClose={clearAdvice} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TravelPage() {
  const isMobile = useIsMobile();
  const heroRef = useRef(null);
  const destinationsRef = useRef(null);
  const destinationsInView = useInView(destinationsRef, { once: true, margin: "-10%" });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.2]), springConfig);
  const heroImageY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), springConfig);

  const popularDestinations = [
    { country: "Thailand", riskLevel: "medium" as const, malaria: false, advice: "Popular tourist destination. Recommended vaccinations for food/water-borne diseases." },
    { country: "Kenya", riskLevel: "high" as const, malaria: true, advice: "Safari destinations require comprehensive protection and mandatory yellow fever." },
    { country: "Bali", riskLevel: "low" as const, malaria: false, advice: "Popular resort island with lower health risks than mainland Indonesia." },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroImageScale, y: heroImageY }}>
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
          <motion.div variants={heroVariants.container} initial="hidden" animate="visible" className="max-w-xl">
            <motion.span variants={heroVariants.badge} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white mb-6" style={{ backgroundColor: ACCENT_COLOR }}>
              <Plane className="w-3 h-3" /> AI-Powered Travel Health
            </motion.span>
            <motion.h1 variants={heroVariants.title} className="heading-hero text-foreground mb-6">Explore Safely.</motion.h1>
            <motion.p variants={heroVariants.subtitle} className="text-elegant text-muted-foreground mb-10">
              AI-powered travel health consultations. Get instant vaccine recommendations, malaria advice, and health bundles for any destination — even with typos!
            </motion.p>
            <motion.div variants={heroVariants.cta}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Button className="text-white hover:opacity-90 px-8 py-6 h-auto rounded-full text-base font-medium shadow-2xl" style={{ backgroundColor: ACCENT_COLOR }}>
                  Find Your Destination
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Destination Search */}
      <section className="section-padding overflow-hidden" style={{ background: `linear-gradient(to bottom, ${ACCENT_COLOR}10, transparent)` }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, ...springConfig }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">Search Your Destination</h2>
            <p className="text-elegant text-muted-foreground max-w-lg mx-auto">
              Type any destination — even with spelling mistakes — and get AI-powered health recommendations instantly.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, ...springConfig, delay: 0.2 }}
          >
            <DestinationSearch />
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section-padding bg-secondary overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">Popular Destinations</h2>
            <p className="text-elegant text-muted-foreground">Quick access to travel health requirements for trending destinations.</p>
          </motion.div>

          <motion.div 
            ref={destinationsRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate={destinationsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            {popularDestinations.map((dest, index) => {
              const risk = riskColors[dest.riskLevel];
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, ...springConfig } },
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", ...fastSpring }}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-500 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${risk.bg} ${risk.text}`}>
                      <span className={`w-2 h-2 rounded-full ${risk.dot}`} />
                      {risk.label}
                    </span>
                    {dest.malaria && <Shield className="w-4 h-4 text-red-500" />}
                  </div>
                  <h3 className="font-serif text-2xl font-medium mb-2">{dest.country}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{dest.advice}</p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full rounded-full border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300">
                      View Requirements
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-white overflow-hidden" style={{ backgroundColor: ACCENT_COLOR }}>
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}>
            <h2 className="heading-section mb-6">Need Personal Consultation?</h2>
            <p className="text-elegant text-white/70 mb-10 max-w-lg mx-auto">Book a comprehensive travel consultation with our pharmacists for personalized advice.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Button asChild className="bg-white hover:bg-white/90 px-10 py-7 h-auto rounded-full text-base font-medium shadow-2xl" style={{ color: ACCENT_COLOR }}>
                <Link to="/contact">Book Consultation</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
