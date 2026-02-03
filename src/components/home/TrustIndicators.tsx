import { motion } from "framer-motion";
import { Star, Award, ShieldCheck } from "lucide-react";

const indicators = [
  {
    icon: Award,
    title: "Treatwell Top Rated",
    subtitle: "2023 – 2026",
    highlight: "5 Stars",
  },
  {
    icon: Star,
    title: "1,200+ Reviews",
    subtitle: "Verified on Treatwell",
    highlight: "5.0",
  },
  {
    icon: ShieldCheck,
    title: "Google Reviews",
    subtitle: "240+ Reviews",
    highlight: "5.0",
  },
];

export function TrustIndicators() {
  return (
    <section id="trust-indicators" className="bg-secondary py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {indicators.map((indicator, index) => (
            <motion.div
              key={indicator.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex items-center gap-5 p-5 bg-card rounded-lg shadow-sm border border-border"
            >
              <div className="w-12 h-12 rounded-full bg-charcoal flex items-center justify-center shrink-0">
                <indicator.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif text-xl font-semibold text-foreground">
                    {indicator.highlight}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <p className="font-medium text-foreground text-sm">{indicator.title}</p>
                <p className="text-xs text-muted-foreground">{indicator.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
