import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { SectionHeading } from "./SectionHeading";
import { useCategories } from "@/lib/products";
import { categoryImage } from "@/lib/product-images";
import { Skeleton } from "@/components/ui/skeleton";

const SPANS = ["md:col-span-2 md:row-span-2", "", "", "", ""];

export function Categories() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Collections"
          title="Curated by Category"
          subtitle="From everyday brilliance to ceremonial heirlooms — explore our most coveted creations."
        />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-5 md:h-[640px]">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className={`bg-onyx/5 rounded-none ${SPANS[i] || ""} aspect-square md:aspect-auto`} />
              ))
            : categories.slice(0, 5).map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative overflow-hidden group cursor-pointer ${SPANS[i] || ""} aspect-square md:aspect-auto`}
                >
                  <Link
                    to="/shop"
                    search={{ category: c.slug }}
                    className="absolute inset-0"
                  >
                    <img
                      src={c.image_url || categoryImage(c.slug)}
                      alt={c.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/20 to-transparent transition-opacity duration-500 group-hover:from-onyx/95" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <p className="text-[0.65rem] tracking-[0.35em] uppercase text-gold font-sans mb-2">
                        Discover
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl text-cream">
                        {c.name}
                      </h3>
                      <div className="mt-3 w-0 h-px bg-gold transition-all duration-500 group-hover:w-16" />
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
