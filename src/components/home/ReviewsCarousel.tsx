import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import treatwellLogo from "@/assets/treatwell-logo.png";

// Google Logo SVG - Official colors
const GoogleLogo = ({ className = "h-6" }: { className?: string }) => (
  <svg viewBox="0 0 74 24" className={`${className} w-auto`}>
    <path d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z" fill="#4285F4"/>
    <path d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z" fill="#EA4335"/>
    <path d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.5 3.1 3.54 0 2.03-1.36 3.5-3.1 3.5z" fill="#4285F4"/>
    <path d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z" fill="#FBBC05"/>
    <path d="M58 .24h2.51v17.57H58z" fill="#34A853"/>
    <path d="M68.26 15.52c-1.3 0-2.22-.59-2.82-1.76l7.77-3.21-.26-.66c-.48-1.3-1.96-3.7-4.97-3.7-2.99 0-5.48 2.35-5.48 5.81 0 3.26 2.46 5.81 5.76 5.81 2.66 0 4.2-1.63 4.84-2.57l-1.98-1.32c-.66.96-1.56 1.6-2.86 1.6zm-.18-7.15c1.03 0 1.91.53 2.2 1.28l-5.25 2.17c0-2.44 1.73-3.45 3.05-3.45z" fill="#EA4335"/>
  </svg>
);

// Real reviews data - combined for continuous scroll
const allReviews = [
  {
    name: "Sheniece",
    text: "The Team at COCOLAS are so warm and welcoming. The clinic is beautiful, clean and inviting. The ladies are experienced, professional and knowledgeable.",
    date: "20 days ago",
    treatment: "Micro Needling by Elissa",
    source: "treatwell"
  },
  {
    name: "Y Flores",
    text: "Great experience with my laser hair removal! The service was excellent, the staff treated me with kindness and professionalism, and the results have been very good.",
    date: "2 months ago",
    treatment: "Laser Hair Removal",
    source: "google"
  },
  {
    name: "Donna",
    text: "Cocolas is an oasis and the therapists know what they're doing. I trust them to take care of my skin.",
    date: "2 months ago",
    treatment: "HIFU Facial by Kay",
    source: "treatwell"
  },
  {
    name: "Alina Ristea",
    text: "The salon is very clean and they have high quality products. I am doing laser hair removal and I am happy with the results. I highly recommend!",
    date: "2 months ago",
    treatment: "Laser Hair Removal",
    source: "google"
  },
  {
    name: "Nathanaël",
    text: "I have had micro needling 5 times now, and it has always been a pleasure to come to the clinic. The staff is welcoming and professional!!",
    date: "2 months ago",
    treatment: "Micro Needling by Elissa",
    source: "treatwell"
  },
  {
    name: "Win Myat",
    text: "I had an absolutely wonderful experience with San at Cocolas in London. From the moment I walked in, I felt warmly welcomed and professionally cared for.",
    date: "5 months ago",
    treatment: "",
    source: "google"
  },
  {
    name: "Gosia",
    text: "Kay is really the best, very knowledgeable and thorough when performing all treatments. The studio atmosphere is lovely too. Highly recommended.",
    date: "2 months ago",
    treatment: "Radiofrequency Facial by Kay",
    source: "treatwell"
  },
  {
    name: "Yohaqine Chopin",
    text: "Highly recommended! I had a laser hair removal session and the results were impressive, fast, effective, and painless.",
    date: "5 months ago",
    treatment: "Laser Hair Removal",
    source: "google"
  },
];

export function ReviewsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 1.2; // pixels per frame - faster scroll

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Reset when we've scrolled through half the content (the duplicated portion)
        const maxScroll = scrollContainer.scrollWidth / 2;
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Duplicate reviews for seamless loop
  const duplicatedReviews = [...allReviews, ...allReviews];

  return (
    <section className="section-padding bg-secondary relative overflow-hidden">
      {/* Decorative accent elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-56 h-56 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
      
      <div className="container mb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-accent rounded-full" />
            <p className="text-label text-accent">Client Testimonials</p>
            <span className="w-8 h-[2px] bg-accent rounded-full" />
          </div>
          <h2 className="heading-section text-foreground mb-4">What Our Clients Say</h2>
          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <img src={treatwellLogo} alt="Treatwell" className="h-10 w-auto" />
              <span className="text-sm text-muted-foreground">1,200+ Reviews</span>
            </div>
            <div className="w-px h-6 bg-accent/30" />
            <div className="flex items-center gap-2">
              <GoogleLogo className="h-5" />
              <span className="text-sm text-muted-foreground">240+ Reviews</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Auto-scrolling Reviews */}
      <div 
        ref={scrollRef}
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex gap-5 px-4" style={{ width: 'max-content' }}>
          {duplicatedReviews.map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className="group bg-card rounded-xl p-6 shadow-sm border border-border min-w-[420px] max-w-[420px] relative overflow-hidden hover:border-accent/30 transition-all duration-300"
            >
              {/* Accent hover line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Quote className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {review.source === "treatwell" ? (
                      <img src={treatwellLogo} alt="Treatwell" className="h-4 w-auto opacity-60" />
                    ) : (
                      <GoogleLogo className="h-4 opacity-60" />
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="font-semibold text-sm text-foreground">{review.name}</p>
                  {review.treatment && (
                    <p className="text-xs text-accent mt-0.5">{review.treatment}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
