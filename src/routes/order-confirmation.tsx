import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Ali Baba Jewellers" },
      { name: "description", content: "Thank you for your order from Ali Baba Jewellers." },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const orderNumber = `BJ-${Math.floor(100000 + Math.random() * 899999)}`;
  return (
    <SiteLayout>
      <section className="pt-36 pb-24 bg-background min-h-[70vh] flex items-center">
        <div className="max-w-xl mx-auto px-5 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="w-24 h-24 rounded-full bg-gradient-gold mx-auto flex items-center justify-center mb-8 shadow-gold"
          >
            <Check className="w-12 h-12 text-onyx" strokeWidth={2.5} />
          </motion.div>
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Thank You</p>
          <h1 className="font-display text-5xl md:text-6xl text-onyx leading-tight">
            Your order is confirmed
          </h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            A confirmation has been sent to your inbox. Our atelier will hand-prepare
            your pieces and ship them with complimentary insured delivery.
          </p>
          <div className="mt-8 inline-block bg-cream border border-gold/30 px-6 py-4">
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground">Order Number</p>
            <p className="font-display text-2xl text-onyx mt-1">{orderNumber}</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-onyx text-cream px-8 py-4 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:bg-gold hover:text-onyx transition-colors">
              Continue Shopping
            </Link>
            <Link to="/account" className="inline-flex items-center gap-2 border border-onyx text-onyx px-8 py-4 text-[0.7rem] tracking-[0.3em] uppercase font-medium hover:bg-onyx hover:text-cream transition-colors">
              View Order
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}