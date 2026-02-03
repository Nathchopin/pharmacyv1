import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { BookingButton } from "@/components/booking/BookingButton";
import { popularOffers } from "@/components/home/MostPopularOffers";
import { KlarnaBar } from "@/components/home/KlarnaBar";
const badgeColors = {
  red: "bg-red-600",
  purple: "bg-purple-600",
  gold: "bg-gradient-gold"
};
const OffersPage = () => {
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
              Special <span className="italic font-light">Offers</span>
            </h1>
            <p className="text-elegant text-white/80">
              Take advantage of our exclusive packages and seasonal promotions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Klarna Bar */}
      <KlarnaBar />

      {/* Offers Grid */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
        
        <div className="container max-w-6xl relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularOffers.map((offer, index) => <motion.div key={offer.id} initial={{
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
          }} className="relative h-[450px] lg:h-[500px] overflow-hidden group border border-transparent hover:border-accent/30 transition-all duration-300">
                {/* Purple accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                
                {/* Background Image */}
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{
              backgroundImage: `url(${offer.image})`
            }} />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`${badgeColors[offer.badgeColor]} text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-sm`}>
                    {offer.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-xs text-white/70 mb-1">{offer.category}</p>
                  <h3 className="font-serif text-xl font-semibold mb-3 leading-tight">{offer.title}</h3>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-label text-white/60 text-xs">FROM</span>
                    <span className="text-2xl font-bold">{offer.price}</span>
                    {offer.originalPrice && <span className="text-sm text-white/50 line-through">{offer.originalPrice}</span>}
                  </div>

                  <BookingButton calendarType={offer.calendarType} showNoShowPolicy={true} className="w-full bg-black hover:bg-black/90 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-full transition-colors">
                    Book now
                  </BookingButton>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-secondary relative overflow-hidden">
        {/* Decorative purple accents */}
        <div className="absolute left-1/4 top-1/2 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute right-1/4 top-1/2 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
        
        <div className="container max-w-3xl text-center relative z-10">
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
        }}>
            <div className="w-12 h-0.5 bg-accent/50 mx-auto mb-6" />
            <h3 className="heading-card mb-4">Terms & Conditions</h3>
            <p className="text-sm text-muted-foreground">
              All offers are subject to availability and may not be combined with other promotions. 
              Package prices must be paid in full at the time of booking. Offers may be withdrawn at any time.
              Please speak to our team for full terms and conditions.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>;
};
export default OffersPage;