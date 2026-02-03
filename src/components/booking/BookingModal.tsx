import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function BookingModal() {
  const { state, closeBookingModal } = useBookingModal();
  const { isOpen, calendarUrl, showNoShowPolicy } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  // Load the GoHighLevel form embed script with security measures
  useEffect(() => {
    if (isOpen && !scriptLoadedRef.current) {
      const scriptUrl = "https://book.cocolas.co.uk/js/form_embed.js";
      
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.type = "text/javascript";
        script.async = true;
        // Add crossorigin for CORS compliance and security
        script.crossOrigin = "anonymous";
        // Error handling for script load failures
        script.onerror = () => {
          console.warn("Failed to load booking script. Booking functionality may be limited.");
        };
        document.body.appendChild(script);
        scriptLoadedRef.current = true;
      }
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open (robust mobile fix)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeBookingModal();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeBookingModal]);

  // Generate a unique ID for the iframe
  const iframeId = `ghl_embed_${Date.now()}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden"
        >
          {/* Close Button - Floating in top right */}
          <button
            onClick={closeBookingModal}
            className="absolute top-4 right-4 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-black/80 text-white hover:bg-black transition-colors shadow-lg"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* No-Show Policy Text - Conditional */}
          {showNoShowPolicy && (
            <div className="bg-secondary border-b border-border px-4 py-3 text-center">
              <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
                Card details are required to secure your appointment. You will NOT be charged today. 
                A £25 fee will only be applied in the event of a No-Show or Late Cancellation (less than 24 hours).
              </p>
            </div>
          )}

          {/* Payment fallback (some banks/3DS flows don't complete reliably inside iframes) - only show for paid bookings */}
          {calendarUrl && showNoShowPolicy && (
            <div className="border-b border-border bg-secondary/40 px-4 py-3">
              <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  If the payment screen keeps loading, open the booking in a new tab to complete verification.
                </p>
                <Button
                  variant="outline"
                  className="sm:shrink-0"
                  onClick={() => {
                    window.open(calendarUrl, "_blank", "noopener,noreferrer");
                    closeBookingModal();
                  }}
                >
                  Open in new tab
                </Button>
              </div>
            </div>
          )}

          {/* GHL Script Embed Container - Full remaining space */}
          <div
            ref={containerRef}
            className="flex-1 w-full overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {calendarUrl && (
              <iframe
                src={calendarUrl}
                id={iframeId}
                style={{ 
                  width: "100%",
                  height: "100%",
                  border: "none",
                  backgroundColor: "#FFFFFF",
                  display: "block",
                }}
                scrolling="yes"
                title="Book Appointment"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
