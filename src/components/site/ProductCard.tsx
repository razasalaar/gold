import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { DbProduct } from "@/lib/products";
import { useShop } from "@/context/ShopContext";
import { toast } from "sonner";
import { formatPKR, formatWeightShort } from "@/lib/format";
import { productImage } from "@/lib/product-images";

export function ProductCard({ product, index = 0 }: { product: DbProduct; index?: number }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const wished = isWishlisted(product.id);
  const img = productImage(product.image_url, product.slug, product.category?.slug);
  const weight = formatWeightShort(product.weight_tola, product.weight_grams);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
    toast.success(`${product.name} added to bag`);
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    toast(wished ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative overflow-hidden bg-cream aspect-[4/5] mb-5">
        <Link to="/product/$id" params={{ id: product.slug }} className="block w-full h-full">
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>
        {product.badge && (
          <span className="absolute top-4 left-4 bg-onyx text-gold text-[0.6rem] tracking-[0.25em] uppercase px-3 py-1.5 font-sans font-semibold">
            {product.badge}
          </span>
        )}
        <button
          aria-label="Add to wishlist"
          onClick={handleWish}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/90 backdrop-blur flex items-center justify-center transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-[-4px] sm:group-hover:translate-y-0 ${
            wished ? "text-gold-dark" : "text-onyx hover:bg-gold hover:text-cream"
          }`}
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-gold-dark" : ""}`} />
        </button>
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <button onClick={handleAdd} className="w-full bg-onyx text-cream py-3 text-[0.7rem] tracking-[0.3em] uppercase font-sans font-semibold hover:bg-gold hover:text-onyx transition-colors">
            Add to Bag
          </button>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground mb-1.5">
          {product.category?.name ?? ""}
        </p>
        <Link
          to="/product/$id"
          params={{ id: product.slug }}
          className="font-display text-xl text-onyx hover:text-gold-dark transition-colors"
        >
          {product.name}
        </Link>
        {weight && (
          <p className="mt-1.5 text-[0.65rem] tracking-[0.25em] uppercase text-gold-dark">
            {weight} · {product.purity ?? "22K"}
          </p>
        )}
        <p className="mt-2 font-display text-lg text-onyx tracking-wide">
          {formatPKR(product.price_pkr)}
        </p>
      </div>
    </motion.div>
  );
}