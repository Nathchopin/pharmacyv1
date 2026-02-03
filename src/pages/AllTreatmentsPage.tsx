import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { treatmentCategories } from "@/data/clinicData";
import { BookingButton } from "@/components/booking/BookingButton";

// Category images
import laserHairRemovalPhoto from "@/assets/laser-hair-removal-photo.jpg";
import facialTreatmentPhoto from "@/assets/facial-treatment-photo.png";
import bodyTreatmentPhoto from "@/assets/body-treatment-photo.jpg";
import injectablesFacePhoto from "@/assets/injectables-face-new.jpeg";
const categoryImages: Record<string, string> = {
  "laser-hair-removal": laserHairRemovalPhoto,
  "skin-facials": facialTreatmentPhoto,
  "body-wellness": bodyTreatmentPhoto,
  "injectables": injectablesFacePhoto
};
const AllTreatmentsPage = () => {
  return <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-charcoal text-white relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        <div className="container relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="max-w-3xl mx-auto text-center">
            
            <h1 className="heading-display mb-6">All Treatments</h1>
            <p className="text-elegant text-white/80">
              Explore our full range of advanced aesthetic treatments, from laser hair removal to injectables. Each treatment is designed to deliver remarkable, natural-looking results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Treatment Categories Grid */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {treatmentCategories.map((category, index) => <motion.div key={category.id} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }}>
                <Link to={`/treatments/${category.id}`} className="group block relative overflow-hidden aspect-[4/3] shadow-card hover:shadow-lg transition-all duration-300 border border-transparent hover:border-accent/30">
                  {/* Background Image */}
                  <img src={categoryImages[category.id] || laserHairRemovalPhoto} alt={category.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Purple accent line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-white text-sm font-medium group-hover:gap-3 transition-all border-none border-2">
                      View Treatments
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
                
                {/* Subcategory Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 4).map(sub => {
                const subId = sub.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
                return <Link key={sub.title} to={`/treatments/${category.id}#${subId}`} onClick={() => window.scrollTo(0, 0)} className="text-xs bg-accent/10 text-accent/80 px-3 py-1 rounded-full border border-accent/20 hover:bg-accent/20 transition-colors">
                        {sub.title}
                      </Link>;
              })}
                  {category.subcategories.length > 4 && <span className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-full">
                      +{category.subcategories.length - 4} more
                    </span>}
                </div>
              </motion.div>)}
          </div>
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
            <h2 className="heading-section mb-4">Not Sure Where to Start?</h2>
            <p className="text-elegant text-muted-foreground mb-8">
              Book a free consultation with our experts for personalized advice on the best treatments for you.
            </p>
            <BookingButton calendarType="consultation" showNoShowPolicy={false} className="bg-black text-white hover:bg-black/90 rounded-full px-10 py-6 text-label tracking-widest border border-accent/30 hover:border-accent/50 transition-colors">
              Book Free Consultation
            </BookingButton>
          </motion.div>
        </div>
      </section>
    </Layout>;
};
export default AllTreatmentsPage;