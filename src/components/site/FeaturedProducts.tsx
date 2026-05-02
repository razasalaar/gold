import { Link } from "@tanstack/react-router";
import { SectionHeading } from "./SectionHeading";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/lib/products";
import { ProductGridSkeleton } from "./Skeletons";

export function FeaturedProducts() {
  const { data: products, isLoading } = useProducts({ featured: true });
  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Signature Pieces"
          title="Bestselling Treasures"
          subtitle="Each piece tells a story — discover the creations our clients return to again and again."
        />
        <div className="mt-16">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (products ?? []).length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gold/30 bg-background/50">
              <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Coming Soon</p>
              <p className="font-display text-2xl text-onyx">New treasures arriving shortly</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {(products ?? []).slice(0, 8).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-16 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 border border-onyx text-onyx px-9 py-4 text-[0.75rem] tracking-[0.3em] uppercase font-sans font-medium hover:bg-onyx hover:text-cream transition-colors"
          >
            View Full Collection
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}