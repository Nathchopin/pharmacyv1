import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Scale, Droplets, Pill } from "lucide-react";

const services = [
  {
    title: "Weight Management",
    description: "GLP-1 treatments and clinical support.",
    icon: Scale,
    badge: "High Demand",
    link: "/treatments/weight-management",
  },
  {
    title: "Blood Testing",
    description: "Home testing kits with GP analysis.",
    icon: Droplets,
    badge: null,
    link: "/health-checks",
  },
  {
    title: "Pharmacy First",
    description: "Same-day treatment for minor ailments.",
    icon: Pill,
    badge: null,
    link: "/treatments/pharmacy-first",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function ServiceGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-accent rounded-full" />
            <span className="text-label text-accent tracking-widest">
              Our Services
            </span>
            <span className="w-8 h-[2px] bg-accent rounded-full" />
          </div>
          <h2 className="heading-section">How Can We Help You?</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={cardVariants}>
              <Link
                to={service.link}
                onClick={() => window.scrollTo(0, 0)}
                className="group block h-full"
              >
                <div className="relative h-full bg-secondary rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-accent/20">
                  {/* Badge */}
                  {service.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white">
                        {service.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <service.icon className="w-8 h-8 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="heading-card mb-3 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-elegant text-muted-foreground">
                    {service.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
