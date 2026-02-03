import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Gift, Phone, CheckCircle, Users } from "lucide-react";
import { BookingButton } from "@/components/booking/BookingButton";

const ReferralProgramPage = () => {
  return (
    <Layout>
      {/* Compact Hero + How It Works Combined */}
      <section className="relative bg-gradient-to-b from-secondary to-background overflow-hidden pt-32 md:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        
        <div className="container relative z-10 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-8 h-[2px] bg-accent rounded-full" />
                <span className="text-label text-accent tracking-widest text-sm">Referral Program</span>
                <span className="w-8 h-[2px] bg-accent rounded-full" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                Refer a Friend
                <span className="block text-accent font-normal">Both Get £50 Off</span>
              </h1>
              
              <p className="text-muted-foreground max-w-md">
                Share the gift of beautiful skin with your friends and family. When they book with us, you both enjoy exclusive savings.
              </p>
            </motion.div>

            {/* Right - Steps Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {[
                {
                  icon: Users,
                  step: "01",
                  title: "Share With Friends",
                  description: "Tell your friends about Cocolas Clinic and the treatments you love.",
                },
                {
                  icon: Phone,
                  step: "02",
                  title: "They Book & Mention You",
                  description: "When they book, they provide your phone number for verification.",
                },
                {
                  icon: Gift,
                  step: "03",
                  title: "Both Save £50",
                  description: "Claim the discount at payment at reception. Simple!",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex gap-4 p-5 bg-white border border-border/50 shadow-sm"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/10 shrink-0">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-accent font-semibold">{item.step}</span>
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terms Section - Compact Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-light tracking-tight text-center mb-8">
              Important <span className="text-accent">Terms & Conditions</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[
                {
                  title: "£250 Minimum",
                  description: "The referred person must book treatments worth at least £250 to qualify.",
                },
                {
                  title: "Claim at Reception",
                  description: "The £50 discount must be claimed at the moment of payment at our reception.",
                },
                {
                  title: "Phone Verification",
                  description: "Provide the referring client's phone number so we can verify their account.",
                },
                {
                  title: "Existing Clients Only",
                  description: "The referring person must be an existing client in our records.",
                },
                {
                  title: "One-Time Use",
                  description: "Each referral can only be used once per new client.",
                },
                {
                  title: "Cannot Combine",
                  description: "This discount cannot be combined with other promotional offers.",
                },
              ].map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3 p-4 bg-secondary/30 border border-border/30"
                >
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{term.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{term.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compact CTA */}
      <section className="py-12 bg-secondary/50 border-t border-border/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto"
          >
            <div>
              <h3 className="text-xl font-semibold mb-1">Questions about the referral program?</h3>
              <p className="text-muted-foreground text-sm">
                Call us at{" "}
                <a href="tel:+442084584411" className="text-accent hover:underline font-medium">
                  +44 20 8458 4411
                </a>
                {" "}or{" "}
                <a href="tel:+447483339422" className="text-accent hover:underline font-medium">
                  +44 7483 339 422
                </a>
              </p>
            </div>
            
            <BookingButton
              calendarType="consultation"
              showNoShowPolicy={false}
              className="bg-black text-white hover:bg-black/90 px-8 py-4 text-sm tracking-widest whitespace-nowrap"
            >
              Book Free Consultation
            </BookingButton>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ReferralProgramPage;
