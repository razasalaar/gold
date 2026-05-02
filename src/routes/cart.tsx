import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useShop } from "@/context/ShopContext";
import { formatPKR } from "@/lib/format";
import { productImage } from "@/lib/product-images";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Bag — Ali Baba Jewellers" },
      { name: "description", content: "Review the pieces in your shopping bag at Ali Baba Jewellers." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cartItems, cartTotal, updateQty, removeFromCart, clearCart } = useShop();
  const empty = cartItems.length === 0;
  const shipping = cartTotal > 0 ? 0 : 0;

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-36 pb-20 bg-background min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Your Selection</p>
            <h1 className="font-display text-5xl md:text-6xl text-onyx">Shopping Bag</h1>
          </div>

          {empty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto py-16"
            >
              <div className="w-20 h-20 rounded-full bg-cream border border-gold/30 mx-auto flex items-center justify-center text-gold-dark mb-6">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="font-display text-3xl text-onyx">Your bag awaits</h2>
              <p className="mt-3 text-muted-foreground">
                Begin your journey through our collection of timeless creations.
              </p>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-3 bg-onyx text-cream px-8 py-4 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:bg-gold hover:text-onyx transition-colors"
              >
                Discover Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-2">
                <div className="hidden md:grid grid-cols-12 gap-4 text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground pb-4 border-b border-border">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                {cartItems.map(({ product, qty }) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-12 gap-4 items-center py-6 border-b border-border"
                  >
                    <div className="col-span-12 md:col-span-6 flex gap-5">
                      <Link to="/product/$id" params={{ id: product.slug }} className="shrink-0">
                        <img src={productImage(product.image_url, product.slug, product.category?.slug)} alt={product.name} className="w-24 h-24 md:w-28 md:h-28 object-cover bg-cream" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground mb-1">{product.category?.name ?? ""}</p>
                        <Link to="/product/$id" params={{ id: product.slug }} className="font-display text-xl text-onyx hover:text-gold-dark transition-colors">
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="col-span-4 md:col-span-2 text-left md:text-center font-display text-lg">
                      {formatPKR(product.price_pkr)}
                    </div>
                    <div className="col-span-4 md:col-span-2 flex md:justify-center">
                      <div className="inline-flex items-center border border-onyx/20">
                        <button onClick={() => updateQty(product.id, qty - 1)} className="p-2 hover:text-gold-dark" aria-label="Decrease">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-display">{qty}</span>
                        <button onClick={() => updateQty(product.id, qty + 1)} className="p-2 hover:text-gold-dark" aria-label="Increase">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="col-span-4 md:col-span-2 text-right font-display text-lg text-onyx">
                      {formatPKR(Number(product.price_pkr) * qty)}
                    </div>
                  </motion.div>
                ))}
                <div className="pt-6 flex justify-end">
                  <button onClick={clearCart} className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Clear Bag
                  </button>
                </div>
              </div>

              <aside className="bg-cream border border-border p-7 h-fit lg:sticky lg:top-28">
                <h2 className="font-display text-2xl text-onyx mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <Row label="Subtotal" value={formatPKR(cartTotal)} />
                  <Row label="Shipping" value={shipping === 0 ? "Complimentary" : formatPKR(shipping)} />
                  <Row label="Estimated Tax" value="Calculated at checkout" small />
                </div>
                <div className="gold-divider my-6" />
                <div className="flex justify-between items-baseline">
                  <span className="text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground">Total</span>
                  <span className="font-display text-3xl text-onyx">{formatPKR(cartTotal)}</span>
                </div>
                <Link
                  to="/checkout"
                  className="mt-7 w-full inline-flex justify-center items-center gap-2 bg-onyx text-cream py-4 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:bg-gold hover:text-onyx transition-colors"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="mt-3 w-full inline-flex justify-center items-center text-xs tracking-[0.25em] uppercase text-muted-foreground hover:text-gold-dark transition-colors py-2"
                >
                  Continue Shopping
                </Link>
                <p className="mt-6 text-xs text-muted-foreground text-center">
                  Complimentary shipping & lifetime warranty on every order.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={small ? "text-muted-foreground text-xs" : "text-onyx"}>{value}</span>
    </div>
  );
}