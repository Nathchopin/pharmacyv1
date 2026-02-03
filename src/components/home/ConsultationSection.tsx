import { motion } from "framer-motion";
import { BookingButton } from "@/components/booking/BookingButton";
import { Stethoscope, Sparkles, Clock, ArrowRight } from "lucide-react";
import expertGuidancePhoto from "@/assets/expert-guidance-photo.jpeg";

const features = [
  {
    icon: Stethoscope,
    title: "Medical Experts",
    description: "Consult with Medical Doctors and Skin Specialists",
  },
  {
    icon: Sparkles,
    title: "Personalised Plan",
    description: "Tailored treatment recommendations just for you",
  },
  {
    icon: Clock,
    title: "Complimentary",
    description: "No obligation, completely free consultation",
  },
];

export function ConsultationSection() {
  return (
    <section className="section-padding bg-secondary/30 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Right Side - Content (appears first on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-accent rounded-full" />
              <p className="text-label text-accent tracking-widest">Expert Guidance</p>
            </div>
            <h2 className="heading-section mb-6">Not Sure What You Need?</h2>
            
            {/* Image - appears after title on mobile only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:hidden relative mb-8"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={expertGuidancePhoto}
                  alt="Expert consultation at Cocolas Clinic"
                  className="w-full h-[280px] object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </motion.div>
            
            <p className="text-elegant text-muted-foreground mb-10 max-w-lg">
              Book a free consultation with our Medical Doctors and Skin Specialists. 
              We'll create a personalised treatment plan tailored to your individual needs and goals.
            </p>

            {/* Feature Cards */}
            <div className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="group relative bg-white rounded-xl p-5 shadow-sm border border-border/50 hover:shadow-lg hover:border-accent/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center flex-shrink-0 group-hover:from-accent/30 group-hover:to-accent/10 transition-all duration-300">
                      <feature.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover accent line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-accent rounded-r-full group-hover:h-12 transition-all duration-300" />
                </motion.div>
              ))}
            </div>

            {/* CTA Button - centered on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <BookingButton 
                calendarType="consultation"
                showNoShowPolicy={false}
                className="bg-black text-white hover:bg-black/90 rounded-full px-10 py-6 text-label tracking-widest group"
              >
                <span className="flex items-center gap-2">
                  Book Free Consultation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </BookingButton>
            </motion.div>
          </motion.div>

          {/* Left Side - Image (hidden on mobile, shown on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={expertGuidancePhoto}
                alt="Expert consultation at Cocolas Clinic"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Expert Team</p>
                    <p className="text-xs text-muted-foreground">Medical Doctors & Certified Specialists</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
