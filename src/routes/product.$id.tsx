import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Truck, ShieldCheck, RefreshCw, Minus, Plus } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { useProduct, useRelatedProducts } from "@/lib/products";
import { useShop } from "@/context/ShopContext";
import { toast } from "sonner";
import { formatPKR } from "@/lib/format";
import { productImage } from "@/lib/product-images";
import { ProductDetailSkeleton } from "@/components/site/Skeletons";

export const Route = createFileRoute("/product/$id")({
  head: () => ({ meta: [{ title: "Product — Ali Baba Jewellers" }] }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="pt-40 pb-32 text-center">
        <h1 className="font-display text-5xl text-onyx">Piece not found</h1>
        <p className="mt-4 text-muted-foreground">The product you're looking for is no longer available.</p>
        <Link to="/shop" className="mt-8 inline-block text-gold-dark luxury-link">Return to collection</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="pt-40 pb-32 text-center text-muted-foreground">{error.message}</div>
    </SiteLayout>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: related = [] } = useRelatedProducts(product?.id, product?.category_id);
  const [qty, setQty] = useState(1);
  const { cart, addToCart, toggleWishlist, isWishlisted } = useShop();
  const navigate = useNavigate();

  if (isLoading) return <SiteLayout><ProductDetailSkeleton /></SiteLayout>;
  if (!product) {
    return (
      <SiteLayout>
        <div className="pt-40 pb-32 text-center">
          <h1 className="font-display text-5xl text-onyx">Piece not found</h1>
          <Link to="/shop" className="mt-8 inline-block text-gold-dark luxury-link">Return to collection</Link>
        </div>
      </SiteLayout>
    );
  }
  const wished = isWishlisted(product.id);
  const img = productImage(product.image_url, product.slug, product.category?.slug);

  const handleAdd = () => {
    addToCart(product.id, qty);
    toast.success(`${product.name} added to bag`);
  };
  const handleBuyNow = () => {
    // If already in cart, go straight to checkout without adding again
    const alreadyInCart = cart.some((i) => i.id === product.id);
    if (!alreadyInCart) addToCart(product.id, qty);
    navigate({ to: "/checkout" });
  };

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-36 pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <nav className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-10">
            <Link to="/" className="hover:text-gold-dark">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-gold-dark">Collection</Link>
            <span className="mx-2">/</span>
            <span className="text-onyx">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div className="aspect-square bg-cream overflow-hidden">
                <img src={img} alt={product.name} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:pt-6"
            >
              <p className="text-[0.7rem] tracking-[0.35em] uppercase text-gold mb-4">{product.category?.name ?? ""}</p>
              <h1 className="font-display text-4xl md:text-5xl text-onyx leading-tight">{product.name}</h1>

              <p className="mt-6 font-display text-3xl text-onyx">{formatPKR(product.price_pkr)}</p>
              <p className="mt-2 text-[0.7rem] tracking-[0.3em] uppercase text-gold-dark">Purity · {product.purity ?? "22K"}</p>

              <div className="gold-divider my-8" />

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Tola", value: product.weight_tola },
                  { label: "Masha", value: product.weight_masha },
                  { label: "Ratti", value: product.weight_ratti },
                  { label: "Grams", value: product.weight_grams },
                ].map((w) => (
                  <div key={w.label} className="border border-border bg-cream/40 p-3 text-center">
                    <p className="text-[0.55rem] tracking-[0.3em] uppercase text-muted-foreground">{w.label}</p>
                    <p className="font-display text-xl text-onyx mt-1">{Number(w.value ?? 0)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center gap-5">
                <div className="flex items-center border border-onyx/20">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:text-gold-dark">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-display text-lg">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:text-gold-dark">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={handleAdd} className="flex-1 bg-onyx text-cream py-4 text-[0.75rem] tracking-[0.3em] uppercase font-sans font-semibold hover:bg-gold hover:text-onyx transition-colors">
                  Add to Bag
                </button>
                <button
                  aria-label="Wishlist"
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast(wished ? "Removed from wishlist" : "Saved to wishlist");
                  }}
                  className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                    wished ? "border-gold text-gold-dark" : "border-onyx/20 hover:border-gold hover:text-gold"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wished ? "fill-gold-dark" : ""}`} />
                </button>
              </div>

              <button onClick={handleBuyNow} className="mt-4 w-full bg-gradient-gold text-onyx py-4 text-[0.75rem] tracking-[0.3em] uppercase font-sans font-semibold hover:shadow-gold transition-shadow">
                Buy Now
              </button>

              <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-border">
                {[
                  { Icon: Truck, label: "Complimentary Shipping" },
                  { Icon: ShieldCheck, label: "Lifetime Warranty" },
                  { Icon: RefreshCw, label: "30-Day Returns" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-5 h-5 mx-auto text-gold-dark mb-2" />
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-onyx text-center mb-14">You May Also Love</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}