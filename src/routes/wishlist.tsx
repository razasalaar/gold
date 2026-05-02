import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { useShop } from "@/context/ShopContext";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Ali Baba Jewellers" },
      { name: "description", content: "Your saved pieces from the Ali Baba Jewellers collection." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlistItems } = useShop();

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-36 pb-20 bg-background min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Saved For You</p>
            <h1 className="font-display text-5xl md:text-6xl text-onyx">Wishlist</h1>
            <p className="mt-4 text-muted-foreground">
              Your treasured selection — kept safe until you're ready.
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center max-w-md mx-auto py-12">
              <div className="w-20 h-20 rounded-full bg-cream border border-gold/30 mx-auto flex items-center justify-center text-gold-dark mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="font-display text-3xl text-onyx">No saved pieces yet</h2>
              <p className="mt-3 text-muted-foreground">
                Tap the heart on any creation to keep it close.
              </p>
              <Link to="/shop" className="mt-8 inline-block bg-onyx text-cream px-8 py-4 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:bg-gold hover:text-onyx transition-colors">
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {wishlistItems.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}