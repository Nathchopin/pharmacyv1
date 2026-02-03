import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingButton, type CalendarType } from "@/components/booking/BookingButton";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import injectablesFacePhoto from "@/assets/injectables-face-photo.jpeg";
import laserHairRemovalPhoto from "@/assets/laser-hair-removal-photo.jpg";
import facialTreatmentPhoto from "@/assets/facial-treatment-photo.png";
import bodyTreatmentPhoto from "@/assets/body-treatment-photo.jpg";
import ivTherapyPhoto from "@/assets/iv-therapy-photo.jpg";
import laserSmallLargePhoto from "@/assets/laser-small-large-photo.jpg";
import ivDripPhoto from "@/assets/iv-drip-photo.jpg";
import bikiniUnderarmsPhoto from "@/assets/bikini-underarms-photo-new.jpeg";
import mensFaceNeckPhoto from "@/assets/mens-face-neck-laser-photo.jpeg";
import radioFrequencyPhoto from "@/assets/rf-stomach-photo-new.jpeg";

export interface PopularOffer {
  id: string;
  badge: string;
  badgeColor: "red" | "purple" | "gold";
  category: string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  calendarType: CalendarType;
}

export const popularOffers: PopularOffer[] = [
  {
    id: "anti-wrinkle-injections",
    badge: "Client Favourite",
    badgeColor: "purple",
    category: "Injectables",
    title: "Anti Wrinkle Injections (3 Areas)",
    price: "£250",
    image: injectablesFacePhoto,
    calendarType: "offerAntiWrinkle3Areas",
  },
  {
    id: "full-body-laser",
    badge: "Popular!",
    badgeColor: "purple",
    category: "Laser Hair Removal",
    title: "Full Body (6 Sessions)",
    price: "£850",
    originalPrice: "£1,200",
    image: laserHairRemovalPhoto,
    calendarType: "laserFullBody6Sessions",
  },
  {
    id: "bikini-underarms-laser",
    badge: "Popular!",
    badgeColor: "purple",
    category: "Laser Hair Removal",
    title: "Bikini and Underarms (6 Sessions)",
    price: "£300",
    originalPrice: "£660",
    image: bikiniUnderarmsPhoto,
    calendarType: "laserBikiniUnderarmsOffer",
  },
  {
    id: "radio-frequency-stomach",
    badge: "Popular!",
    badgeColor: "purple",
    category: "Body & Wellness",
    title: "Radio Frequency For Stomach (Course of 3)",
    price: "£279",
    originalPrice: "£387",
    image: radioFrequencyPhoto,
    calendarType: "rfBodyTighteningStomach3Sessions",
  },
  {
    id: "mens-face-neck-laser",
    badge: "Best Value",
    badgeColor: "purple",
    category: "Laser Hair Removal",
    title: "Men's Full Face and Neck (6 Sessions)",
    price: "£285",
    originalPrice: "£540",
    image: mensFaceNeckPhoto,
    calendarType: "laserMensFaceNeckOffer",
  },
  {
    id: "microneedling-course",
    badge: "Best Value",
    badgeColor: "purple",
    category: "Skin & Facials",
    title: "Microneedling (Course of 3)",
    price: "£249",
    originalPrice: "£357",
    image: facialTreatmentPhoto,
    calendarType: "microneedlingFaceNeck3Sessions",
  },
  {
    id: "fat-freeze-course",
    badge: "Best Value",
    badgeColor: "purple",
    category: "Body & Wellness",
    title: "Fat Freeze Cryolipolysis (Course of 3)",
    price: "£279",
    originalPrice: "£417",
    image: bodyTreatmentPhoto,
    calendarType: "offerFatFreeze3Sessions",
  },
  {
    id: "biotin-bepanthene",
    badge: "Limited Offer",
    badgeColor: "purple",
    category: "IV Therapy",
    title: "Biotin & Bepanthene (12 Injections)",
    price: "£250",
    originalPrice: "£400",
    image: ivTherapyPhoto,
    calendarType: "offerBiotinBepanthene12Sessions",
  },
  {
    id: "2-small-1-large",
    badge: "Limited Offer",
    badgeColor: "purple",
    category: "Laser Hair Removal",
    title: "2 Small & 1 Large Area (6 Sessions)",
    price: "£499",
    image: laserSmallLargePhoto,
    calendarType: "laser2Small1LargeOffer",
  },
  {
    id: "iv-glutathione-vitc",
    badge: "New Client Offer!",
    badgeColor: "purple",
    category: "IV Therapy",
    title: "IV Glutathione & Vitamin C (Course of 3)",
    price: "£249",
    originalPrice: "£387",
    image: ivDripPhoto,
    calendarType: "offerIVGlutathioneVitC3Sessions",
  },
];

const badgeColors = {
  red: "bg-red-600",
  purple: "bg-purple-600",
  gold: "bg-gradient-gold",
};

export function MostPopularOffers() {
  return (
    <section className="py-12 bg-background relative overflow-hidden">
      {/* Decorative accent elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-accent rounded-full" />
              <p className="text-label text-accent">SALE NOW ON</p>
            </div>
            <h2 className="heading-section">Most Popular Offers</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/offers" 
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors hidden sm:block group"
            >
              <span className="flex items-center gap-2">
                View all
                <span className="w-4 h-[2px] bg-accent rounded-full group-hover:w-6 transition-all duration-300" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Full-width Carousel - edge to edge on mobile */}
      <div className="sm:px-6 lg:px-8">
        <Carousel
          opts={{
            align: "center",
            loop: true,
            startIndex: 0,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {popularOffers.map((offer, index) => (
              <CarouselItem key={offer.id} className="pl-3 sm:pl-4 basis-[80%] sm:basis-1/2 lg:basis-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative h-[450px] lg:h-[500px] overflow-hidden group"
              >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${offer.image})` }}
                  />
                  
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
                      {offer.originalPrice && (
                        <span className="text-sm text-white/50 line-through">{offer.originalPrice}</span>
                      )}
                    </div>

                    <BookingButton
                      calendarType={offer.calendarType}
                      showNoShowPolicy={true}
                      className="w-full bg-black hover:bg-black/90 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-full transition-colors"
                    >
                      Book now
                    </BookingButton>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Custom Navigation */}
          <div className="hidden sm:flex items-center gap-2 absolute top-1/2 -translate-y-1/2 left-2">
            <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-border bg-white/90 hover:bg-white shadow-md" />
          </div>
          <div className="hidden sm:flex items-center gap-2 absolute top-1/2 -translate-y-1/2 right-2">
            <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-border bg-white/90 hover:bg-white shadow-md" />
          </div>
        </Carousel>
      </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center sm:hidden">
          <Link 
            to="/offers" 
            onClick={() => window.scrollTo(0, 0)}
            className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            View all offers →
          </Link>
        </div>
    </section>
  );
}
