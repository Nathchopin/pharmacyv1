import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
const BOOKING_URL = "https://widget.treatwell.co.uk/place/cocolas-laser-aesthetics/";
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/vrt3f8x7kdiA3KhK8";
const contactInfo = [{
  icon: MapPin,
  title: "Visit Us",
  details: ["73 Golders Green Rd", "London NW11 8EL, United Kingdom"],
  link: GOOGLE_MAPS_URL
}, {
  icon: Phone,
  title: "Call Us",
  details: ["+44 20 8458 4411", "+44 7483 339 422", "Available on WhatsApp"],
  link: "tel:+442084584411"
}, {
  icon: Mail,
  title: "Email Us",
  details: ["info@cocolas.co.uk", "We respond within 24 hours"],
  link: "mailto:info@cocolas.co.uk"
}, {
  icon: Clock,
  title: "Opening Hours",
  details: ["Tue - Fri: 10am - 7pm", "Sat: 10am - 5pm", "Sun: 11am - 4pm", "Mon: Closed"]
}];
const ContactPage = () => {
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
        }} className="text-center max-w-3xl mx-auto">
            
            <h1 className="heading-display mb-6">
              Contact <span className="italic font-light">Us</span>
            </h1>
            <p className="text-elegant text-white/80">
              We'd love to hear from you. Book a consultation or get in touch with our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
        
        <div className="container max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {contactInfo.map((item, index) => <motion.div key={item.title} initial={{
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
          }} className="group flex gap-5 p-8 bg-card border border-border hover:border-accent/30 rounded-sm transition-all duration-300 relative overflow-hidden">
                {/* Purple accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="heading-card mb-3 group-hover:text-accent transition-colors duration-300">{item.title}</h3>
                  {item.link ? <a href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined} className="block hover:text-accent transition-colors">
                      {item.details.map((detail, i) => <p key={i} className="text-muted-foreground text-sm">
                          {detail}
                        </p>)}
                    </a> : item.details.map((detail, i) => <p key={i} className="text-muted-foreground text-sm">
                        {detail}
                      </p>)}
                </div>
              </motion.div>)}
          </div>

          {/* Booking Section */}
          
        </div>
      </section>

      {/* Map */}
      <section className="h-96 bg-gradient-charcoal">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2479.8961!2d-0.1944!3d51.5775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761897e6e6e6e7%3A0x0!2s73%20Golders%20Green%20Rd%2C%20London%20NW11%208EL!5e0!3m2!1sen!2suk!4v1234567890" width="100%" height="100%" style={{
        border: 0
      }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Cocolas Clinic Location" />
      </section>
    </Layout>;
};
export default ContactPage;