import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image as ImageIcon, Video } from "lucide-react";
import hifuBefore1 from "@/assets/hifu-before-after-1.jpeg";
import hifuBefore2 from "@/assets/hifu-before-after-2.jpeg";
import hifuBefore3 from "@/assets/hifu-before-after-3.jpeg";
const injectablesPhotoUrl = "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&h=800&fit=crop&crop=face";

const featuredTreatments = [
  {
    name: "HIFU Face Lift",
    description: "Non-surgical lifting and tightening using focused ultrasound technology",
    price: "From £99",
    image: hifuBefore1,
  },
  {
    name: "Injectables",
    description: "Premium dermal fillers and anti-wrinkle treatments for natural rejuvenation",
    price: "From £180",
    image: injectablesPhotoUrl,
    link: "/treatments#injectables",
  },
  {
    name: "Microneedling",
    description: "Advanced skin resurfacing for acne scarring and texture improvement",
    price: "From £119",
    image: hifuBefore3,
  },
];

export function FeaturedTreatments() {
  return (
    <section className="section-padding bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-label text-accent mb-4">Signature Treatments</p>
          <h2 className="heading-section mb-4">
            Transform Your Skin
          </h2>
          <p className="text-elegant text-muted-foreground max-w-2xl mx-auto">
            Discover our most sought-after treatments, each designed to deliver remarkable, natural-looking results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredTreatments.map((treatment, index) => (
            <motion.div
              key={treatment.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group bg-background rounded-xl overflow-hidden shadow-card"
            >
              {/* Treatment Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={treatment.image}
                  alt={treatment.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="heading-card">{treatment.name}</h3>
                  <span className="text-label text-accent text-xs">{treatment.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{treatment.description}</p>
                <Link
                  to={treatment.link || "/treatments"}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg px-8 py-5 text-label tracking-widest"
          >
            <Link to="/treatments" onClick={() => window.scrollTo(0, 0)}>
              View All Treatments
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
