import { motion } from "framer-motion";
import dermalogicaProducts from "@/assets/dermalogica-partnership-photo.avif";
export function DermalogicaPartnership() {
  return <section className="section-padding bg-gradient-to-b from-secondary/50 to-background relative overflow-hidden">
      {/* Decorative elements */}
      
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Content - Left side */}
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
        }} className="lg:pr-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-accent rounded-full" />
              <span className="text-label text-accent tracking-widest">Trusted Partnership</span>
            </div>
            
            <h2 className="heading-section mb-6">
              Official Dermalogica <span className="italic font-light">Partner</span>
            </h2>

            <p className="text-elegant text-muted-foreground mb-8 leading-relaxed">
              As an official Dermalogica Partner Clinic, we work exclusively with one of the world's most trusted professional skincare brands. All treatments are delivered by certified skin therapists using advanced, medical-grade formulations tailored to your individual needs.
            </p>

            {/* Dermalogica Certified Badge */}
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img alt="Dermalogica Certified" className="w-full h-full object-cover" src="/lovable-uploads/81e5a46c-92b0-4b82-949a-a7af52350b96.png" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Dermalogica Certified</p>
                <p className="text-xs text-accent">Professional Skincare Partner</p>
              </div>
            </div>
          </motion.div>

          {/* Image - Right side */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="relative">
            <div className="relative overflow-hidden flex items-center justify-center h-full mt-4 lg:mt-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 via-transparent to-accent/10 rounded-2xl blur-sm" />
                <img 
                  src={dermalogicaProducts} 
                  alt="Dermalogica Professional Skincare Products" 
                  className="relative w-auto h-auto max-h-[320px] lg:max-h-[380px] object-contain rounded-xl shadow-xl ring-1 ring-black/5" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
}