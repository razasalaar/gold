import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const reviews = [
  {
    name: "Aisha Khan",
    role: "Lahore, Pakistan",
    text: "The craftsmanship is breathtaking. My bridal set arrived beautifully packaged and felt like a true heirloom from the moment I opened it.",
    initials: "AK",
  },
  {
    name: "Zara Ahmed",
    role: "Karachi, Pakistan",
    text: "Ali Baba Jewellers exceeded every expectation. The Eternia band is exquisite — I receive compliments on it every single day.",
    initials: "ZA",
  },
  {
    name: "Fatima Ali",
    role: "Islamabad, Pakistan",
    text: "A truly international standard of luxury. The detailing on my Verde necklace is unlike anything I've owned before.",
    initials: "FA",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-onyx text-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Client Stories"
          title="Voices of Elegance"
          subtitle="A glimpse into the moments we've helped make unforgettable."
          light
        />
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border border-gold/20 bg-charcoal p-8 md:p-10 hover-lift"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-cream/85 leading-relaxed font-display text-xl italic">
                "{r.text}"
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-gold-soft flex items-center justify-center text-onyx font-display font-semibold">
                  {r.initials}
                </div>
                <div>
                  <p className="text-cream font-medium">{r.name}</p>
                  <p className="text-cream/50 text-xs tracking-wider uppercase">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}