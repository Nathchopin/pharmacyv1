import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { BookingButton } from "@/components/booking/BookingButton";
import { team } from "@/data/clinicData";
import { Award, GraduationCap, Heart, Users } from "lucide-react";
import missEliisaPhoto from "@/assets/miss-eliisa-photo.jpeg";
import drMilaPhoto from "@/assets/dr-mila-photo-new.jpeg";
import mrsKayPhoto from "@/assets/mrs-kay-photo-new.jpeg";
import aboutHeroBg from "@/assets/about-hero-bg.png";
const values = [{
  icon: Heart,
  title: "Patient-Centered Care",
  description: "Your comfort and satisfaction are our top priorities."
}, {
  icon: GraduationCap,
  title: "Continuous Education",
  description: "Our team stays at the forefront of aesthetic innovation."
}, {
  icon: Award,
  title: "Clinical Excellence",
  description: "Evidence-based treatments with proven results."
}, {
  icon: Users,
  title: "Trusted Partnership",
  description: "Building long-term relationships with every client."
}];
const AboutPage = () => {
  return <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 text-white relative overflow-hidden">
        {/* Background Image */}
        <img
          src={aboutHeroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[100%_center] origin-right scale-[1.1] md:scale-100 md:origin-center"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        
        <div className="container relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center max-w-3xl mx-auto">
            
            
            <h1 className="heading-display mb-6">
              About <span className="italic font-light">Us</span>
            </h1>
            <p className="text-elegant text-white/90 text-lg">
              North London's trusted destination for advanced aesthetic treatments,
              where clinical expertise is combined with personalised care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-secondary relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
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
        }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-accent rounded-full" />
              <p className="text-label text-accent">Our Experts</p>
              <span className="w-8 h-[2px] bg-accent rounded-full" />
            </div>
            <h2 className="heading-section mb-4">Meet Our Team</h2>
            <div className="w-16 h-0.5 bg-accent/50 mx-auto mb-6" />
            
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => <motion.div key={member.name} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.15,
            duration: 0.6
          }} className="group bg-background overflow-hidden shadow-card hover:shadow-xl transition-all duration-500 border border-transparent hover:border-accent/30 relative">
                {/* Purple accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                
                {/* Team photo */}
                <div className="aspect-[4/5] bg-gradient-charcoal flex items-center justify-center overflow-hidden relative">
                  {member.image === "miss-eliisa" ? <img src={missEliisaPhoto} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : member.image === "dr-mila" ? <img src={drMilaPhoto} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : member.image === "mrs-kay" ? <img src={mrsKayPhoto} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full bg-gradient-to-b from-muted to-muted/80 flex items-center justify-center">
                      <span className="text-6xl font-serif text-muted-foreground/30">
                        {member.name.charAt(0)}
                      </span>
                    </div>}
                  
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="p-6 text-center">
                  {/* Name */}
                  <h3 className="heading-card text-xl mb-2 group-hover:text-accent transition-colors duration-300">{member.name}</h3>
                  
                  {/* Role badge */}
                  <div className="inline-block bg-accent/10 px-3 py-1 rounded-full mb-3 border border-accent/20">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-accent font-medium">
                      {member.role}
                    </p>
                  </div>
                  
                  {/* Experience */}
                  <p className="text-xs text-primary/60 mb-4 font-medium">
                    {member.experience}
                  </p>
                  
                  {/* Description - lighter and more readable */}
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {member.description}
                  </p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-background relative">
        <div className="container max-w-5xl">
          {/* Main Philosophy Block */}
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
        }} className="text-center mb-20 relative">
            {/* Decorative quote marks */}
            
            
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-accent rounded-full" />
              <span className="text-label text-accent">What We Believe</span>
              <span className="w-8 h-[2px] bg-accent rounded-full" />
            </div>
            <h2 className="heading-section mb-8">Our Philosophy</h2>
            <div className="w-16 h-0.5 bg-accent/50 mx-auto mb-8" />
            
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
                At Cocolas Clinic, we believe that beauty is not about transformation, but{" "}
                <span className="font-medium text-foreground">enhancement</span>.
              </p>
              <p className="text-elegant text-muted-foreground leading-relaxed">
                Our approach combines the precision of medical science with an artistic eye,
                delivering results that celebrate your natural features while addressing your concerns.
                As an official Dermalogica partner and Treatwell top-rated clinic, we're committed to
                excellence in every treatment we offer.
              </p>
            </div>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => <motion.div key={value.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }} className="group flex gap-5 p-6 bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-accent/30 rounded-lg transition-all duration-300 relative overflow-hidden">
                {/* Purple accent line on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                  <value.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="heading-card text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-0.5 bg-accent/50 mx-auto mb-6" />
            <h2 className="heading-section mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-elegant text-muted-foreground mb-8">
              Book a consultation with our expert team and discover how we can help you achieve your aesthetic goals.
            </p>
            <BookingButton size="lg" calendarType="consultation" className="px-8 border border-accent/30 hover:border-accent/50 transition-colors">
              Book Your Consultation
            </BookingButton>
          </motion.div>
        </div>
      </section>
    </Layout>;
};
export default AboutPage;