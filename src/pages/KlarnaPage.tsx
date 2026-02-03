import { Layout } from "@/components/layout/Layout";
import { Calendar, Sparkles, Smartphone, CreditCard, Shield, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import klarnaLogo from "@/assets/klarna-logo.png";
const KlarnaPage = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="bg-[#FFB3C7] pt-28 pb-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <img src={klarnaLogo} alt="Klarna" className="h-16 md:h-20 mx-auto mb-8" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-black mb-6">
              Treat Now, Pay Later.
            </h1>
            <p className="text-lg md:text-xl text-black/80 max-w-2xl mx-auto">
              Spread the cost of your treatments into 3 interest-free payments with Klarna.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our simple in-clinic process makes paying easy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center p-8 bg-cream/50 rounded-none">
              <div className="w-16 h-16 bg-[#FFB3C7] rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-black" />
              </div>
              <div className="text-sm font-semibold text-[#FFB3C7] mb-2">STEP 1</div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                Book Your Slot
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Book your appointment online today for £0. No payment is taken until you visit us.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-8 bg-cream/50 rounded-none">
              <div className="w-16 h-16 bg-[#FFB3C7] rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <div className="text-sm font-semibold text-[#FFB3C7] mb-2">STEP 2</div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                Get Treated
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Come in for your treatment and enjoy the results.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-8 bg-cream/50 rounded-none">
              <div className="w-16 h-16 bg-[#FFB3C7] rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-black" />
              </div>
              <div className="text-sm font-semibold text-[#FFB3C7] mb-2">STEP 3</div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                Pay by Link
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                At reception, simply ask to pay with Klarna. We will text a secure link to your phone. You complete the setup on your mobile in seconds, splitting your total into 3 easy payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-border">
                <AccordionTrigger className="text-left font-medium py-5">
                  Can I use this for any treatment?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  Yes, for any total over £50.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-border">
                <AccordionTrigger className="text-left font-medium py-5">
                  Do I need to apply before I arrive?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  No, you do it instantly at reception via a link we send to your mobile.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-border">
                <AccordionTrigger className="text-left font-medium py-5">
                  Does it affect my credit score?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  Klarna performs a soft search which does not affect your credit score.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            Klarna's Pay in 3 / Pay in 30 days are unregulated credit agreements. Borrowing more than you can afford or paying late may negatively impact your financial status and ability to obtain credit. 18+, UK residents only. Subject to status. T&Cs apply.
          </p>
        </div>
      </section>
    </Layout>;
};
export default KlarnaPage;