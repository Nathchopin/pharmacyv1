import { useState, createContext, useContext, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Plus, Minus, X, Check } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/carousel/shop.avif";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  heroVariants,
  smoothOut,
  fluidSpring,
  snappySpring,
  springConfig,
  fastSpring,
  StaggerGrid,
  StaggerGridItem
} from "@/components/animations/FluidMotion";

// Pink color
const ACCENT_COLOR = "#EC4899";

// Product data
const products = [
  { id: 1, name: "Vitamin D3 4000 IU", description: "High-strength daily supplement for bone health and immunity.", price: 12.99, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80", category: "Vitamins", badge: "Best Seller" },
  { id: 2, name: "Omega-3 Fish Oil", description: "Premium EPA & DHA for heart and brain health.", price: 18.99, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&q=80", category: "Supplements" },
  { id: 3, name: "Zinc & Vitamin C Complex", description: "Immune support formula with antioxidants.", price: 9.99, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80", category: "Immunity", badge: "New" },
  { id: 4, name: "Magnesium Glycinate", description: "Highly absorbable form for muscle and sleep support.", price: 14.99, image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80", category: "Minerals" },
  { id: 5, name: "Probiotic 50 Billion CFU", description: "Multi-strain formula for digestive health.", price: 24.99, image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80", category: "Gut Health" },
  { id: 6, name: "B-Complex Energy", description: "Complete B vitamins for energy metabolism.", price: 11.99, image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&q=80", category: "Vitamins" },
];

// Cart Context
interface CartItem { id: number; name: string; price: number; quantity: number; image: string; }
interface CartContextType { items: CartItem[]; addItem: (product: typeof products[0]) => void; removeItem: (id: number) => void; updateQuantity: (id: number, quantity: number) => void; total: number; itemCount: number; }
const CartContext = createContext<CartContextType | null>(null);

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: typeof products[0]) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }];
    });

    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="flex items-center gap-3 bg-foreground text-background px-4 py-3 rounded-2xl shadow-xl"
      >
        <div className="w-8 h-8 rounded-full bg-[hsl(var(--success))] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium">{product.name} added</span>
        <Button variant="ghost" size="sm" className="text-background/70 hover:text-background hover:bg-white/10 rounded-full ml-2" onClick={() => toast.dismiss(t)}>View Bag</Button>
      </motion.div>
    ), { duration: 3000, position: "bottom-center" });
  }, []);

  const removeItem = useCallback((id: number) => setItems((prev) => prev.filter((item) => item.id !== id)), []);
  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) { removeItem(id); return; }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  }, [removeItem]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, total, itemCount }}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

// Product Card with 3D hover effect
function ProductCard({ product }: { product: typeof products[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring" as const, ...springConfig }}
    >
      <div
        ref={cardRef}
        className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
        style={{ transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          
          {product.badge && (
            <motion.span 
              className="absolute top-4 left-4 px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {product.badge}
            </motion.span>
          )}

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-x-4 bottom-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => addItem(product)}
                    className="w-full text-white hover:opacity-90 rounded-full py-6 h-auto font-medium shadow-lg"
                    style={{ backgroundColor: ACCENT_COLOR }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Bag
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</span>
          <h3 className="font-serif text-lg font-medium mt-1 mb-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
          <p className="text-lg font-semibold">£{product.price.toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Slide-over Cart
function SlideOverCart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 500, damping: 25 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="rounded-full h-14 px-5 shadow-2xl text-white hover:opacity-90 border-0"
            style={{ backgroundColor: ACCENT_COLOR }}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            <span className="font-medium">{itemCount}</span>
            <span className="ml-2 text-sm text-white/70">£{total.toFixed(2)}</span>
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-white p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-serif text-2xl">Your Bag</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-64 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Your bag is empty</p>
          </motion.div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30, height: 0 }}
                    className="flex gap-4 bg-secondary rounded-2xl p-4"
                  >
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                        </motion.div>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={() => removeItem(item.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full text-white hover:opacity-90 rounded-full py-6 h-auto text-base font-medium shadow-lg" style={{ backgroundColor: ACCENT_COLOR }}>
                  Checkout
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default function ShopPage() {
  const isMobile = useIsMobile();
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const productsInView = useInView(productsRef, { once: true, margin: "-10%" });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.2]), springConfig);
  const heroImageY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), springConfig);

  return (
    <CartProvider>
      <Layout>
        {/* Hero */}
        <section ref={heroRef} className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
          <motion.div className="absolute inset-0" style={{ scale: heroImageScale, y: heroImageY }}>
            <motion.img 
              src={heroImage} 
              alt="" 
              className="w-full h-full object-cover object-[85%_15%] md:object-[right_top]"
              style={{ transformOrigin: "right top" }}
              initial={{ scale: 1.05, filter: "blur(10px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
          </motion.div>

          <div className="container relative z-10">
            <motion.div variants={heroVariants.container} initial="hidden" animate="visible" className="max-w-xl">
              <motion.span variants={heroVariants.badge} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white mb-6" style={{ backgroundColor: ACCENT_COLOR }}>
                Pharmacist Approved
              </motion.span>
              <motion.h1 variants={heroVariants.title} className="heading-hero text-foreground mb-6">Daily Essentials.</motion.h1>
              <motion.p variants={heroVariants.subtitle} className="text-elegant text-muted-foreground mb-10">
                Premium supplements and health products, curated by our pharmacists. Delivered to your door.
              </motion.p>
              <motion.div variants={heroVariants.cta}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Button className="text-white hover:opacity-90 px-8 py-6 h-auto rounded-full text-base font-medium shadow-2xl" style={{ backgroundColor: ACCENT_COLOR }}>
                    Browse Products
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="section-padding bg-background overflow-hidden">
          <div className="container">
            <motion.div 
              ref={productsRef}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate={productsInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
              }}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </div>
        </section>

        <SlideOverCart />
      </Layout>
    </CartProvider>
  );
}
