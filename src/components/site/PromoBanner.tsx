import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import promo from "@/assets/promo-bridal.jpg";

export function PromoBanner() {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <motion.img
        src={promo}
        alt="Bridal Collection"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-onyx/80 via-onyx/40 to-transparent" />
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px bg-gold" />
            <span className="text-[0.7rem] tracking-[0.4em] uppercase text-gold font-sans">
              Exclusive Edit
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-cream leading-[1.05]">
            The New Bridal Collection
          </h2>
          <p className="mt-5 text-cream/75 text-lg max-w-md leading-relaxed">
            Handcrafted bridal sets designed for the most important promise — to
            love, to cherish, and to wear forever.
          </p>
          <Link
            to="/shop"
            className="mt-9 inline-flex items-center gap-3 bg-gold text-onyx px-9 py-4 text-[0.75rem] tracking-[0.3em] uppercase font-sans font-semibold hover:bg-gold-light transition-colors"
          >
            Shop Bridal <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}