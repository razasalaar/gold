import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DbProduct } from "@/lib/products";

type CartItem = { id: string; qty: number };

type ShopState = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  cartItems: Array<{ product: DbProduct; qty: number }>;
  wishlistItems: DbProduct[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const ShopCtx = createContext<ShopState | null>(null);

const STORAGE_KEY = "baba-jewellers-shop";

const PRODUCT_SELECT =
  "id,name,slug,category_id,description,price_pkr,weight_tola,weight_masha,weight_ratti,weight_grams,purity,image_url,stock,badge,is_featured,created_at,category:categories(id,name,slug,image_url)";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const referencedIds = useMemo(
    () => Array.from(new Set([...cart.map((c) => c.id), ...wishlist])),
    [cart, wishlist],
  );

  const { data: refProducts = [] } = useQuery({
    queryKey: ["shop-refs", referencedIds.sort().join(",")],
    enabled: referencedIds.length > 0,
    queryFn: async (): Promise<DbProduct[]> => {
      if (referencedIds.length === 0) return [];
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .in("id", referencedIds);
      if (error) throw error;
      return (data ?? []) as unknown as DbProduct[];
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.cart)) setCart(parsed.cart);
        if (Array.isArray(parsed.wishlist)) setWishlist(parsed.wishlist);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist }));
  }, [cart, wishlist, hydrated]);

  const value = useMemo<ShopState>(() => {
    const cartItems = cart
      .map((c) => {
        const product = refProducts.find((p) => p.id === c.id);
        return product ? { product, qty: c.qty } : null;
      })
      .filter(Boolean) as Array<{ product: DbProduct; qty: number }>;

    const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
    const cartTotal = cartItems.reduce((s, i) => s + Number(i.product.price_pkr) * i.qty, 0);
    const wishlistItems = wishlist
      .map((id) => refProducts.find((p) => p.id === id))
      .filter(Boolean) as DbProduct[];

    return {
      cart,
      wishlist,
      cartCount,
      cartTotal,
      cartItems,
      wishlistItems,
      addToCart: (id, qty = 1) =>
        setCart((prev) => {
          const existing = prev.find((i) => i.id === id);
          if (existing) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
          return [...prev, { id, qty }];
        }),
      removeFromCart: (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
      updateQty: (id, qty) =>
        setCart((prev) =>
          qty <= 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, qty } : i))
        ),
      clearCart: () => setCart([]),
      toggleWishlist: (id) =>
        setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
      isWishlisted: (id) => wishlist.includes(id),
    };
  }, [cart, wishlist, refProducts]);

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}