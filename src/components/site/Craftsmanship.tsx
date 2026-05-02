import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import craftsmanshipImg from "@/assets/craftsmanship.jpg";

export function Craftsmanship() {
  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <img
            src={craftsmanshipImg}
            alt="Hands of a master goldsmith"
            loading="lazy"
            className="w-full aspect-[4/5] object-cover"
          />
          <div className="absolute -bottom-6 -right-6 hidden md:flex w-40 h-40 bg-gold items-center justify-center text-onyx">
            <div className="text-center">
              <p className="font-display text-5xl leading-none">62</p>
              <p className="text-[0.6rem] tracking-[0.25em] uppercase mt-2">Years of craft</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">The Atelier</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-onyx leading-[1.05]">
            Hand-crafted, never <span className="italic text-gradient-gold">manufactured</span>.
          </h2>
          <div className="gold-divider my-8 max-w-[120px] !bg-gold mx-0" />
          <p className="text-muted-foreground leading-relaxed text-lg">
            Every Ali Baba Jewellers creation is shaped by the hands of master goldsmiths
            in our flagship atelier — a quiet room where time is measured not in hours,
            but in the careful arc of a chisel and the patience to do it right.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 pb-2">
            {[
              { n: "100%", l: "Ethical Gold" },
              { n: "22k", l: "Hallmarked" },
              { n: "∞", l: "Lifetime Warranty" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-3xl text-onyx">{s.n}</p>
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground mt-1.5">{s.l}</p>
              </div>
            ))}
          </div>

          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-3 border border-onyx text-onyx px-9 py-4 text-[0.72rem] tracking-[0.3em] uppercase font-medium hover:bg-onyx hover:text-cream transition-colors"
          >
            Discover Our Story <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}