import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Quote } from "lucide-react";
import treatwellLogo from "@/assets/treatwell-logo.png";
const BOOKING_URL = "https://widget.treatwell.co.uk/place/cocolas-laser-aesthetics/";

// Google Logo SVG - Official colors
const GoogleLogo = ({
  className = "h-6"
}: {
  className?: string;
}) => <svg viewBox="0 0 74 24" className={`${className} w-auto`}>
    <path d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z" fill="#4285F4" />
    <path d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z" fill="#EA4335" />
    <path d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.5 3.1 3.54 0 2.03-1.36 3.5-3.1 3.5z" fill="#4285F4" />
    <path d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z" fill="#FBBC05" />
    <path d="M58 .24h2.51v17.57H58z" fill="#34A853" />
    <path d="M68.26 15.52c-1.3 0-2.22-.59-2.82-1.76l7.77-3.21-.26-.66c-.48-1.3-1.96-3.7-4.97-3.7-2.99 0-5.48 2.35-5.48 5.81 0 3.26 2.46 5.81 5.76 5.81 2.66 0 4.2-1.63 4.84-2.57l-1.98-1.32c-.66.96-1.56 1.6-2.86 1.6zm-.18-7.15c1.03 0 1.91.53 2.2 1.28l-5.25 2.17c0-2.44 1.73-3.45 3.05-3.45z" fill="#EA4335" />
  </svg>;

// Real reviews data
const realReviews = {
  treatwell: [{
    name: "Sheniece",
    text: "The Team at COCOLAS are so warm and welcoming. The clinic is beautiful, clean and inviting. The ladies are experienced, professional and knowledgeable. The ladies are so friendly and kind. This was my first experience of Microneedling and I was given the right advice, guidance and treatment that has definitely given me great results so far!",
    date: "20 days ago",
    treatment: "Micro Needling by Elissa",
    rating: 5
  }, {
    name: "Donna",
    text: "Cocolas is an oasis and the therapists know what they're doing. I trust them to take care of my skin.",
    date: "2 months ago",
    treatment: "HIFU Facial by Kay",
    rating: 5
  }, {
    name: "Leo",
    text: "Very professional and friendly. Talked me through the process of the treatment in great detail.",
    date: "2 months ago",
    treatment: "Radiofrequency Facial",
    rating: 5
  }, {
    name: "Nathanaël",
    text: "I have had micro needling 5 times now, and it has always been a pleasure to come to the clinic. The staff is welcoming and professional!!",
    date: "2 months ago",
    treatment: "Micro Needling by Elissa",
    rating: 5
  }, {
    name: "Gosia",
    text: "Kay is really the best, very knowledgeable and thorough when performing all treatments. The studio atmosphere is lovely too, making customers feel at home. Highly recommended.",
    date: "2 months ago",
    treatment: "Radiofrequency Facial by Kay",
    rating: 5
  }, {
    name: "Donna",
    text: "Mila is amazing. She is so knowledgeable and calm that it makes the whole experience comfortable and pleasant. She's a gem.",
    date: "about 1 month ago",
    treatment: "Laser Hair Removal by Mila",
    rating: 5
  }],
  google: [{
    name: "Y Flores",
    text: "Great experience with my laser hair removal! I recently had my laser removal done at Cocolas and I'm really happy with the whole experience. The service was excellent, the staff treated me with kindness and professionalism, and the results have been very good. Everything felt clean, safe, and comfortable from start to finish. I definitely recommend them!",
    date: "2 months ago",
    treatment: "Laser Hair Removal",
    rating: 5
  }, {
    name: "Alina Ristea",
    text: "The salon is very clean and they have high quality products. I am doing laser hair removal for my legs and Hollywood. I am happy with the results. Mila is very nice and professional. I went to a different salon to try one session and I was highly disappointed - I immediately returned to COCOLAS and booked a package. I highly recommend!",
    date: "2 months ago",
    treatment: "Laser Hair Removal",
    rating: 5
  }, {
    name: "Win Myat",
    text: "I had an absolutely wonderful experience with San at Cocolas in London. From the moment I walked into the clinic, I felt warmly welcomed and professionally cared for. San was not only kind and attentive, but also highly knowledgeable about the treatments.",
    date: "5 months ago",
    treatment: "",
    rating: 5
  }, {
    name: "Yohaqine Chopin",
    text: "Highly recommended! I had a laser hair removal session and the results were impressive, fast, effective, and painless. The clinic is beautifully decorated with a relaxing atmosphere.",
    date: "5 months ago",
    treatment: "Laser Hair Removal",
    rating: 5
  }, {
    name: "Fullstop Comma",
    text: "I had an incredible microneedling experience at Cocolas! From the moment I walked in, Coco made me feel so welcomed and at ease. She has a warm, calming presence and is clearly passionate about what she does. Her professionalism is outstanding.",
    date: "5 months ago",
    treatment: "Microneedling",
    rating: 5
  }, {
    name: "Day with Magda",
    text: "I had a wonderful experience with Cocolas! The staff was very professional, the prices were super affordable, and the place was always clean and hygienic. They were respectful and punctual with appointments, which made me feel comfortable.",
    date: "5 months ago",
    treatment: "",
    rating: 5
  }, {
    name: "Bianca Ilina",
    text: "I have started doing laser since more than a year ago and I made the best decision. I also found the best place which is Cocolas. Mila is very friendly, calm and a perfectionist in her job. I am very pleased with the choice that I made and I would highly recommend Mila!",
    date: "5 months ago",
    treatment: "Laser Hair Removal",
    rating: 5
  }, {
    name: "Y Mohsani",
    text: "I would highly recommend Cocola's! They are professional, kind and so friendly. Everything was explained throughout the process and I have left feeling great after treatments. I've had a microneedling and chemical peel done and have been very happy with the results.",
    date: "4 months ago",
    treatment: "Microneedling & Chemical Peel",
    rating: 5
  }]
};
const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState<"treatwell" | "google">("treatwell");
  const activeReviews = realReviews[activeTab];
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
              Client <span className="italic font-light">Reviews</span>
            </h1>
            <p className="text-elegant text-white/80">
              Top rated aesthetic specialist in North London with over 1,200 verified 5-star reviews.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats with Logos */}
      <section className="py-12 bg-secondary border-b border-accent/20 relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute left-1/4 top-1/2 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute right-1/4 top-1/2 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
        
        <div className="container relative z-10">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            <div className="text-center">
              <img src={treatwellLogo} alt="Treatwell" className="h-14 mx-auto mb-3" />
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-3xl font-serif font-semibold text-foreground">5.0</span>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-label text-xs text-muted-foreground">1,200+ Reviews</p>
            </div>
            <div className="w-px h-20 bg-accent/30 hidden md:block" />
            <div className="text-center">
              <GoogleLogo className="h-8 mx-auto mb-3" />
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-3xl font-serif font-semibold text-foreground">5.0</span>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-label text-xs text-muted-foreground">240+ Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
        
        <div className="container max-w-4xl relative z-10">
          {/* Tab Toggle with Logos */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-secondary rounded-sm p-1 gap-1 border border-accent/20">
              <button onClick={() => setActiveTab("treatwell")} className={`flex items-center gap-3 px-6 py-4 transition-all rounded-sm ${activeTab === "treatwell" ? "bg-background shadow-sm border border-accent/30" : "hover:bg-background/50"}`}>
                <img src={treatwellLogo} alt="Treatwell" className="h-8" />
                <span className="text-xs text-muted-foreground">1,200+</span>
              </button>
              <button onClick={() => setActiveTab("google")} className={`flex items-center gap-3 px-6 py-4 transition-all rounded-sm ${activeTab === "google" ? "bg-background shadow-sm border border-accent/30" : "hover:bg-background/50"}`}>
                <GoogleLogo className="h-5" />
                <span className="text-xs text-muted-foreground">240+</span>
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeReviews.map((review, index) => <motion.div key={`${review.name}-${index}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }} className="group p-8 bg-card border border-border hover:border-accent/30 rounded-sm transition-all duration-300 relative overflow-hidden">
                {/* Purple accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-accent" />
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{review.text}</p>
                {review.treatment && <p className="text-sm text-accent mb-4">{review.treatment}</p>}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </motion.div>)}
          </div>

          {/* Load More Placeholder */}
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.5,
          duration: 0.6
        }} className="text-center mt-12">
            <p className="text-muted-foreground text-sm mb-6">See all our reviews on</p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <a href="https://www.treatwell.co.uk/place/cocolas-laser-aesthetics/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border rounded-sm hover:bg-accent/10 transition-colors">
                <img src={treatwellLogo} alt="Treatwell" className="h-8" />
                <span className="text-sm text-muted-foreground">1,200+ Reviews</span>
              </a>
              <a href="https://share.google/jbtC72aYHNsAZxvgu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border rounded-sm hover:bg-accent/10 transition-colors">
                <GoogleLogo className="h-6" />
                <span className="text-sm text-muted-foreground">240+ Reviews</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      
    </Layout>;
};
export default ReviewsPage;