import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    eyebrow: "Heritage Collection",
    title: "Timeless Gold\nElegance",
    subtitle: "Hand-crafted heirlooms designed to be cherished for generations.",
    cta: { label: "Shop Now", to: "/shop" },
  },
  {
    image: hero2,
    eyebrow: "New Arrivals",
    title: "Luxury Jewelry\nCollection",
    subtitle: "Where artistry meets the brilliance of natural stones.",
    cta: { label: "Explore Collection", to: "/shop" },
  },
  {
    image: hero3,
    eyebrow: "Bridal 2026",
    title: "Crafted for Every\nPrecious Moment",
    subtitle: "Bespoke bridal pieces created to celebrate love that lasts forever.",
    cta: { label: "Discover Bridal", to: "/shop" },
  },
];

export function HeroSlider() {
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, duration: 35 },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
  }, [embla]);

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);
  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <section className="relative h-screen min-h-[640px] max-h-[900px] overflow-hidden bg-onyx">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((s, i) => (
            <div key={i} className="relative flex-[0_0_100%] h-full">
              <motion.img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.08 }}
                animate={{ scale: selected === i ? 1 : 1.08 }}
                transition={{ duration: 7, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-onyx/85 via-onyx/40 to-onyx/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-gold" />
                <span className="text-[0.7rem] tracking-[0.4em] uppercase text-gold font-sans">
                  {slides[selected].eyebrow}
                </span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream leading-[0.95] whitespace-pre-line">
                {slides[selected].title}
              </h1>
              <p className="mt-6 text-lg text-cream/75 max-w-lg leading-relaxed">
                {slides[selected].subtitle}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to={slides[selected].cta.to}
                  className="group relative inline-flex items-center gap-3 bg-gold text-onyx px-9 py-4 text-[0.75rem] tracking-[0.3em] uppercase font-sans font-semibold overflow-hidden hover:shadow-gold transition-shadow"
                >
                  <span className="relative z-10">{slides[selected].cta.label}</span>
                  <span className="absolute inset-0 bg-cream translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 border border-cream/30 text-cream px-9 py-4 text-[0.75rem] tracking-[0.3em] uppercase font-sans font-medium hover:border-gold hover:text-gold transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center border border-cream/30 text-cream/80 hover:bg-gold hover:border-gold hover:text-onyx transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center border border-cream/30 text-cream/80 hover:bg-gold hover:border-gold hover:text-onyx transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-px transition-all duration-500 ${
              selected === i ? "w-12 bg-gold" : "w-6 bg-cream/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}