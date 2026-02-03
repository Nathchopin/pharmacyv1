import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { BookingButton, CalendarType } from "@/components/booking/BookingButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { treatmentCategories } from "@/data/clinicData";
import { Clock, Star, ArrowLeft } from "lucide-react";
import { KlarnaBar } from "@/components/home/KlarnaBar";
// Category hero images - same as All Treatments page
import laserHairRemovalPhoto from "@/assets/laser-hair-removal-photo.jpg";
import facialTreatmentPhoto from "@/assets/facial-treatment-photo.png";
import bodyTreatmentPhoto from "@/assets/body-treatment-photo.jpg";
import injectablesFacePhoto from "@/assets/injectables-face-new.jpeg";
const categoryHeroImages: Record<string, string> = {
  "laser-hair-removal": laserHairRemovalPhoto,
  "skin-facials": facialTreatmentPhoto,
  "body-wellness": bodyTreatmentPhoto,
  "injectables": injectablesFacePhoto
};

// Map category IDs to calendar types
const categoryToCalendarType: Record<string, CalendarType> = {
  "laser-hair-removal": "laserHairRemoval",
  "skin-facials": "skinFacials",
  "body-wellness": "bodyWellness",
  "injectables": "injectables"
};

// Map treatment names to specific calendar types (must match clinicData.ts exactly)
const treatmentToCalendarType: Record<string, CalendarType> = {
  // HIFU treatments (Skin & Facials - Lifting & Tightening)
  "HIFU Facelift": "hifu",
  "HIFU Face and Neck Lift": "hifu",
  "HIFU Neck Lift": "hifu",
  "HIFU Eye Lift": "hifu",
  "HIFU Jowl Lift": "hifu",
  "HIFU Lower Face Lift": "hifu",
  // Laser treatments - Face Areas
  "Eyebrows": "laserEyebrows",
  "Earlobes": "laserEarlobes",
  "Upper Lip": "laserUpperLip",
  "Cheeks": "laserCheeks",
  "Chin": "laserChin",
  "Forehead": "laserForehead",
  "Sideburns": "laserSideburns",
  "Jawline": "laserJawline",
  "Neck": "laserNeck",
  "Half Face": "laserHalfFace",
  "Full Face": "laserFullFace",
  // Laser treatments - Upper Body Areas
  "Nipples": "laserNipples",
  "Navel": "laserNavel",
  "Hands": "laserHands",
  "Underarms": "laserUnderarms",
  "Shoulders": "laserShoulders",
  "Half Arms": "laserHalfArms",
  "Stomach": "laserStomach",
  "Chest Strip": "laserChestStrip",
  "Full Chest": "laserFullChest",
  "Full Arms": "laserFullArms",
  "Half Back": "laserHalfBack",
  "Full Back or Front": "laserFullBackOrFront",
  // Laser treatments - Lower Body Areas
  "Feet": "laserFeet",
  "Bikini Line": "laserBikiniLine",
  "Brazilian": "laserBrazilian",
  "Buttocks": "laserButtocks",
  "Hollywood": "laserHollywood",
  "Half Legs": "laserHalfLegs",
  "Full Legs": "laserFullLegs"
};
const TreatmentCategoryPage = () => {
  const {
    categoryId
  } = useParams();
  const location = useLocation();
  const category = treatmentCategories.find(c => c.id === categoryId);

  // Always scroll to top first, then handle hash anchor if present
  useEffect(() => {
    // First, scroll to top immediately
    window.scrollTo(0, 0);

    // Then, if there's a hash, scroll to that section after a delay
    if (location.hash) {
      const targetId = location.hash.slice(1); // Remove the #
      // Small delay to allow the page to render
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          // Get the header height plus extra padding so title is clearly visible below header
          const headerOffset = 140;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 200);
    }
  }, [location.pathname, location.hash]);
  if (!category) {
    return <Layout>
        <div className="pt-32 pb-16 text-center">
          <h1 className="heading-display mb-4">Category Not Found</h1>
          <Link to="/treatments" className="text-accent hover:underline">
            Back to Treatments
          </Link>
        </div>
      </Layout>;
  }

  // Get the default calendar type for this category
  const defaultCalendarType = categoryToCalendarType[categoryId || ""] || "general";

  // Get calendar type for a specific treatment and price option
  const getCalendarType = (treatmentName: string, priceOption?: string): CalendarType => {
    // Special handling for Skin & Facials treatments with multiple price options
    if (priceOption) {
      // HIFU Non-Surgical Face Lift
      if (treatmentName === "HIFU Non-Surgical Face Lift") {
        if (priceOption.includes("Face and Neck")) return "hifuFullFaceNeck";
        if (priceOption.includes("Full Face")) return "hifuFullFace";
        if (priceOption.includes("Jawline")) return "hifuJawline";
        if (priceOption.includes("Neck")) return "hifuNeck";
      }

      // Radio Frequency Skin Tightening
      if (treatmentName === "Radio Frequency Skin Tightening") {
        if (priceOption.includes("Chest")) return "rfSkinTighteningFaceNeckChest";
        if (priceOption.includes("Course of 3")) return "rfSkinTighteningFaceNeck3Sessions";
        if (priceOption.includes("Face and Neck") || priceOption.includes("Full Face and Neck")) return "rfSkinTighteningFaceNeck";
      }

      // I-PRF
      if (treatmentName === "I-PRF (Injectable Platelet Rich Fibrin)") {
        if (priceOption.includes("Face") && priceOption.includes("Course of 3")) return "iprfFace3Sessions";
        if (priceOption.includes("Face") && !priceOption.includes("Scalp")) return "iprfFace";
        if (priceOption.includes("Scalp") && priceOption.includes("Course of 3")) return "iprfScalp3Sessions";
        if (priceOption.includes("Scalp")) return "iprfScalp";
      }

      // Microneedling (standalone)
      if (treatmentName === "Microneedling") {
        if (priceOption.includes("Face and Neck") && priceOption.includes("Course of 3")) return "microneedlingFaceNeck3Sessions";
        if (priceOption.includes("Face and Neck")) return "microneedlingFaceNeck";
        if (priceOption.includes("Face") && !priceOption.includes("Neck")) return "microneedlingFace";
      }

      // Microneedling + Dermalogica Pro Power Peel
      if (treatmentName === "Microneedling + Dermalogica Pro Power Peel") {
        if (priceOption.includes("Face and Neck")) return "microneedlingProPowerPeelFaceNeck";
        if (priceOption.includes("Face")) return "microneedlingProPowerPeelFace";
      }

      // Dermalogica Pro Power Peels
      if (treatmentName === "Dermalogica Pro Power Peels") {
        if (priceOption.includes("Microdermabrasion") && priceOption.includes("Course of 3")) return "dermalogicaProPowerPeelsFaceMicrodermabrasion3Sessions";
        if (priceOption.includes("Microdermabrasion")) return "dermalogicaProPowerPeelsFaceMicrodermabrasion";
        if (priceOption.includes("Face") && priceOption.includes("Course of 3")) return "dermalogicaProPowerPeelsFace3Sessions";
        if (priceOption.includes("Face")) return "dermalogicaProPowerPeelsFace";
      }

      // Microdermabrasion
      if (treatmentName === "Microdermabrasion") {
        if (priceOption.includes("Face and Neck") && priceOption.includes("Course of 3")) return "microdermabrasionFaceNeck3Sessions";
        if (priceOption.includes("Face and Neck")) return "microdermabrasionFaceNeck";
        if (priceOption.includes("Face") && priceOption.includes("Course of 3")) return "microdermabrasionFace3Sessions";
        if (priceOption.includes("Face")) return "microdermabrasionFace";
      }

      // Ultrasound Oxygen Facial
      if (treatmentName === "Ultrasound Oxygen Facial") {
        if (priceOption.includes("Face") && priceOption.includes("Course of 3")) return "ultrasoundOxygenFacialFace3Sessions";
        if (priceOption.includes("Face")) return "ultrasoundOxygenFacialFace";
      }

      // Laser Carbon Peel
      if (treatmentName === "Laser Carbon Peel" || treatmentName === "Laser Carbon Peel (Body)") {
        if (priceOption.includes("Full Back") && priceOption.includes("Course of 3")) return "laserCarbonPeelFullBack3Sessions";
        if (priceOption.includes("Full Back")) return "laserCarbonPeelFullBack";
        if (priceOption.includes("Upper Back") && priceOption.includes("Course of 3")) return "laserCarbonPeelUpperBack3Sessions";
        if (priceOption.includes("Upper Back")) return "laserCarbonPeelUpperBack";
        if (priceOption.includes("Chest") && priceOption.includes("Course of 3")) return "laserCarbonPeelChest3Sessions";
        if (priceOption.includes("Chest")) return "laserCarbonPeelChest";
        if (priceOption.includes("Course of 3")) return "laserCarbonPeelFace3Sessions";
        if (priceOption.includes("Face")) return "laserCarbonPeelFace";
      }

      // Laser Acne Treatment
      if (treatmentName === "Laser Acne Treatment") {
        if (priceOption.includes("Course of 3")) return "laserAcneTreatmentFace3Sessions";
        if (priceOption.includes("Face")) return "laserAcneTreatmentFace";
      }

      // Laser Photo Rejuvenation
      if (treatmentName === "Laser Photo Rejuvenation" || treatmentName === "Laser Photo Rejuvenation (Body)") {
        if (priceOption.includes("Hands") && priceOption.includes("Course of 3")) return "laserPhotoRejuvenationHands3Sessions";
        if (priceOption.includes("Hands")) return "laserPhotoRejuvenationHands";
        if (priceOption.includes("Face and Neck") && priceOption.includes("Course of 3")) return "laserPhotoRejuvenationFaceNeck3Sessions";
        if (priceOption.includes("Face and Neck")) return "laserPhotoRejuvenationFaceNeck";
        if (priceOption.includes("Course of 3")) return "laserPhotoRejuvenationFace3Sessions";
        if (priceOption.includes("Face")) return "laserPhotoRejuvenationFace";
      }

      // Thread Vein Removal (Face)
      if (treatmentName === "Thread Vein Removal (Face)") {
        if (priceOption.includes("Large")) return "threadVeinRemovalFaceLarge";
        if (priceOption.includes("Medium")) return "threadVeinRemovalFaceMedium";
        if (priceOption.includes("Small")) return "threadVeinRemovalFaceSmall";
      }

      // Thread Vein Removal (Body)
      if (treatmentName === "Thread Vein Removal (Body)") {
        if (priceOption.includes("Large")) return "threadVeinRemovalBodyLarge";
        if (priceOption.includes("Medium")) return "threadVeinRemovalBodyMedium";
        if (priceOption.includes("Small")) return "threadVeinRemovalBodySmall";
      }

      // Dermalogica The Ultimate Luxury Facial
      if (treatmentName === "Dermalogica The Ultimate Luxury Facial") {
        return "dermalogicaUltimateLuxuryFacialFace";
      }

      // Dermalogica The Pro Luxury Facial
      if (treatmentName === "Dermalogica Pro Luxury Facial") {
        return "dermalogicaProLuxuryFacialFace";
      }

      // Mini Facial
      if (treatmentName === "Mini Facial") {
        return "miniFacialFace";
      }

      // Full Facial
      if (treatmentName === "Full Facial") {
        return "fullFacialFace";
      }

      // Body & Wellness - HIFU Body Sculpt
      if (treatmentName === "HIFU Non-Surgical Body Sculpt" || treatmentName === "HIFU Body Sculpt") {
        return "hifuBodySculpt";
      }

      // Body & Wellness - Fat Freeze (Cryolipolysis)
      if (treatmentName === "Fat Freeze (Cryolipolysis)") {
        if (priceOption.includes("6 Cups")) return "fatFreeze6Cups";
        if (priceOption.includes("2 Cups")) return "fatFreeze2Cups";
        if (priceOption.includes("1 Cup")) return "fatFreeze1Cup";
      }

      // Body & Wellness - Ultrasound Cavitation
      if (treatmentName === "Ultrasound Cavitation") {
        if (priceOption.includes("Full Thighs") && priceOption.includes("Course of 3")) return "ultrasoundCavitationFullThighs3Sessions";
        if (priceOption.includes("Full Thighs")) return "ultrasoundCavitationFullThighs";
        if (priceOption.includes("Full Stomach") && priceOption.includes("Course of 3")) return "ultrasoundCavitationFullStomach3Sessions";
        if (priceOption.includes("Full Stomach")) return "ultrasoundCavitationFullStomach";
      }

      // Body & Wellness - Radio Frequency Body Tightening
      if (treatmentName === "Radio Frequency Body Tightening" || treatmentName === "Radio Frequency Body Sculpting") {
        if (priceOption.includes("Full Stomach") && priceOption.includes("Course of 3")) return "rfBodyTighteningFullStomach3Sessions";
        if (priceOption.includes("Full Stomach")) return "rfBodyTighteningFullStomach";
        if (priceOption.includes("Lower Stomach") && priceOption.includes("Course of 3")) return "rfBodyTighteningLowerStomach3Sessions";
        if (priceOption.includes("Lower Stomach")) return "rfBodyTighteningLowerStomach";
        if (priceOption.includes("Buttocks")) return "rfBodyTighteningButtocks";
        if (priceOption.includes("Thighs") && priceOption.includes("Course of 3")) return "rfBodyTighteningThighs3Sessions";
        if (priceOption.includes("Thighs")) return "rfBodyTighteningThighs";
      }

      // Body & Wellness - Microneedling (Body areas)
      if (treatmentName === "Microneedling (Body)") {
        if (priceOption.includes("Chest") && priceOption.includes("Course of 3")) return "microneedlingChest3Sessions";
        if (priceOption.includes("Chest")) return "microneedlingChest";
        if (priceOption.includes("Half Back") && priceOption.includes("Course of 3")) return "microneedlingHalfBack3Sessions";
        if (priceOption.includes("Half Back")) return "microneedlingHalfBack";
        if (priceOption.includes("Full Back") && priceOption.includes("Course of 3")) return "microneedlingFullBack3Sessions";
        if (priceOption.includes("Full Back")) return "microneedlingFullBack";
      }

      // Body & Wellness - IV Drip Therapy
      if (treatmentName === "IV Drip Therapy") {
        if (priceOption.includes("Course of 3")) return "ivDripTherapy3Sessions";
        return "ivDripTherapy";
      }

      // Injectables - Mesotherapy
      if (treatmentName === "Mesotherapy") {
        if (priceOption.includes("Course of 3")) return "mesotherapy3Sessions";
        return "mesotherapy";
      }

      // Injectables - Vitamin B12
      if (treatmentName === "Vitamin B12") {
        if (priceOption.includes("Course of 3")) return "vitaminB12Injection3Sessions";
        return "vitaminB12Injection";
      }

      // Injectables - Biotin
      if (treatmentName === "Biotin") {
        if (priceOption.includes("Course of 6")) return "biotinInjection6Sessions";
        if (priceOption.includes("Course of 3")) return "biotinInjection3Sessions";
        return "biotinInjection";
      }

      // Injectables - Bepanthen
      if (treatmentName === "Bepanthen") {
        if (priceOption.includes("Course of 6")) return "bepanthenInjection6Sessions";
        return "bepanthenInjection";
      }

      // Injectables - Anti-Wrinkle Treatment
      if (treatmentName === "Anti-Wrinkle Treatment") {
        if (priceOption.includes("3 Areas")) return "antiWrinkle3Areas";
      }

      // Injectables - Fat Dissolving Treatment
      if (treatmentName === "Fat Dissolving Treatment") {
        return "fatDissolvingTreatment";
      }

      // Injectables - Dermal Fillers (Lips)
      if (treatmentName === "Dermal Fillers") {
        if (priceOption.includes("Lips")) return "dermaFillersLips";
      }

      // Injectables - Skin Booster
      if (treatmentName === "Skin Booster") {
        return "skinBooster";
      }

      // Injectables - Under Eye Brightening
      if (treatmentName === "Under Eye Brightening") {
        return "underEyeBrightening";
      }
    }
    return treatmentToCalendarType[treatmentName] || defaultCalendarType;
  };
  // Get the hero image for this category
  const heroImage = categoryHeroImages[categoryId || ""] || laserHairRemovalPhoto;
  return <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 text-white relative overflow-hidden" style={{
      backgroundImage: `url(${heroImage})`,
      backgroundSize: '120%',
      backgroundPosition: 'center'
    }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Decorative purple accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        <div className="container relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="max-w-3xl mx-auto">
            <Link to="/treatments" className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 text-gray-50" />
              <span className="text-sm text-secondary">Back to All Treatments</span>
            </Link>
            
            <h1 className="heading-display mb-6">{category.title}</h1>
            <p className="text-elegant text-white/80">{category.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Klarna Bar */}
      <KlarnaBar />

      {/* Subcategories */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
        
        <div className="container max-w-5xl relative z-10">
          {category.subcategories.map((subcategory, subIndex) => {
          // Create slug for anchor navigation
          const sectionId = subcategory.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          return <motion.div key={subcategory.title} id={sectionId} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: subIndex * 0.1,
            duration: 0.6
          }} className="mb-16 last:mb-0 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-accent/20">
                <span className="w-8 h-[2px] bg-accent rounded-full" />
                <h2 className="heading-section">
                  {subcategory.title}
                </h2>
              </div>

              <Accordion type="multiple" className="space-y-3">
                {subcategory.treatments.map((treatment, treatmentIndex) => {
                  // Create slug for treatment anchor navigation
                  const treatmentId = treatment.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  return <AccordionItem key={treatment.name} id={treatmentId} value={`${subIndex}-${treatmentIndex}`} className="group border border-border hover:border-accent/30 rounded-sm bg-card px-0 overflow-hidden transition-all duration-300 scroll-mt-32">
                    <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-secondary/50 transition-colors relative">
                      {/* Purple accent line on hover */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-2 text-left pr-4">
                        <div className="flex items-center gap-3">
                          <span className="heading-card">{treatment.name}</span>
                          {treatment.isClientFavourite && <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-0.5 rounded text-xs border border-accent/20">
                              <Star className="w-3 h-3 fill-current" />
                              Client Favourite
                            </span>}
                        </div>
                        <span className="text-label text-accent text-xs">
                          {treatment.prices[0]?.price}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{treatment.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-sm">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">What it Targets</h4>
                            <p className="text-sm text-muted-foreground">{treatment.whatItTargets}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">What it Is</h4>
                            <p className="text-sm text-muted-foreground">{treatment.whatItIs}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Aftercare</h4>
                            <p className="text-sm text-muted-foreground">{treatment.aftercare}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Recommendation</h4>
                            <p className="text-sm text-muted-foreground">{treatment.recommendation}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          {treatment.duration && <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-accent" />
                              <span>Duration: {treatment.duration}</span>
                            </div>}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {treatment.prices.map(price => {
                        // Check if this is the Full Body 6 Sessions option
                        const isFullBody6Sessions = treatment.name === "Full Body" && price.option.includes("6 Sessions");
                        const calendarType = isFullBody6Sessions ? "laserFullBody6Sessions" : getCalendarType(treatment.name, price.option);
                        return <BookingButton key={price.option} calendarType={calendarType} showNoShowPolicy={true} className="flex justify-between items-center gap-3 px-4 py-3 rounded-sm h-auto bg-black text-white hover:bg-black/90">
                                <span className="text-xs">Book {price.option}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  {price.originalPrice && <span className="text-xs text-white/60 line-through">
                                      {price.originalPrice}
                                    </span>}
                                  <span className="text-sm font-semibold text-white">{price.price}</span>
                                </div>
                              </BookingButton>;
                      })}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>;
                })}
              </Accordion>
            </motion.div>;
        })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container text-center max-w-2xl relative z-10">
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
        }}>
            <div className="w-16 h-0.5 bg-accent/50 mx-auto mb-6" />
            <h2 className="heading-section mb-4">Not Sure What You Need?</h2>
            <p className="text-elegant text-muted-foreground mb-8">Let our team of experts build tailored treatments just for you.</p>
            <BookingButton calendarType="consultation" showNoShowPolicy={false} className="bg-black text-white hover:bg-black/90 rounded-full px-10 py-6 text-label tracking-widest border border-accent/30 hover:border-accent/50 transition-colors">
              Book Free Consultation
            </BookingButton>
          </motion.div>
        </div>
      </section>
    </Layout>;
};
export default TreatmentCategoryPage;