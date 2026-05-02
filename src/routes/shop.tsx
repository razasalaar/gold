import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts, useCategories } from "@/lib/products";
import { ProductGridSkeleton } from "@/components/site/Skeletons";

const searchSchema = z.object({
  category: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Collection — Ali Baba Jewellers" },
      { name: "description", content: "Browse the full Ali Baba Jewellers collection of gold rings, necklaces, earrings, bracelets and bridal sets." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const filter = category ?? "all";

  const { data: cats = [] } = useCategories();
  const { data: list = [], isLoading } = useProducts({ categorySlug: filter });
  const tabs = [{ slug: "all", name: "All" }, ...cats.map((c) => ({ slug: c.slug, name: c.name }))];
  const activeCat = cats.find((c) => c.slug === filter);

  const setFilter = (slug: string) => {
    navigate({ search: slug === "all" ? {} : { category: slug } });
  };

  return (
    <SiteLayout>
      <section className="pt-36 pb-12 bg-onyx text-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">The Maison</p>
          <h1 className="font-display text-5xl md:text-6xl">
            {activeCat ? activeCat.name : "Our Collection"}
          </h1>
          <p className="mt-5 text-cream/70 max-w-xl mx-auto">
            Pieces handcrafted in gold, designed to last lifetimes and travel through generations.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14">
            {tabs.map((c) => (
              <button
                key={c.slug}
                onClick={() => setFilter(c.slug)}
                className={`px-5 py-2.5 text-[0.7rem] tracking-[0.25em] uppercase font-sans font-medium transition-all ${
                  filter === c.slug
                    ? "bg-onyx text-gold border border-onyx"
                    : "border border-onyx/15 text-onyx hover:border-gold hover:text-gold-dark"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : list.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Coming Soon</p>
              <h2 className="font-display text-3xl text-onyx">
                {activeCat ? `No ${activeCat.name} available yet` : "No products yet"}
              </h2>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                Our maison is preparing exquisite new pieces. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {list.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
