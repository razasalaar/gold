import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
};

export type DbProduct = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  price_pkr: number;
  weight_tola: number | null;
  weight_masha: number | null;
  weight_ratti: number | null;
  weight_grams: number | null;
  purity: string | null;
  image_url: string | null;
  stock: number;
  badge: string | null;
  is_featured: boolean;
  created_at: string;
  category?: DbCategory | null;
};

const PRODUCT_SELECT =
  "id,name,slug,category_id,description,price_pkr,weight_tola,weight_masha,weight_ratti,weight_grams,purity,image_url,stock,badge,is_featured,created_at,category:categories(id,name,slug,image_url)";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<DbCategory[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,slug,image_url")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useProducts(opts?: { featured?: boolean; categorySlug?: string | null }) {
  return useQuery({
    queryKey: ["products", opts ?? {}],
    queryFn: async (): Promise<DbProduct[]> => {
      let q = supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
      if (opts?.featured) q = q.eq("is_featured", true);
      const { data, error } = await q;
      if (error) throw error;
      let rows = (data ?? []) as unknown as DbProduct[];
      if (opts?.categorySlug && opts.categorySlug !== "all") {
        rows = rows.filter((r) => r.category?.slug === opts.categorySlug);
      }
      return rows;
    },
  });
}

export function useProduct(slugOrId: string | undefined) {
  return useQuery({
    queryKey: ["product", slugOrId],
    enabled: !!slugOrId,
    queryFn: async (): Promise<DbProduct | null> => {
      if (!slugOrId) return null;
      const isUuid = /^[0-9a-f]{8}-/i.test(slugOrId);
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq(isUuid ? "id" : "slug", slugOrId)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as DbProduct) ?? null;
    },
  });
}

export function useRelatedProducts(productId: string | undefined, categoryId: string | null | undefined) {
  return useQuery({
    queryKey: ["related", productId, categoryId],
    enabled: !!productId,
    queryFn: async (): Promise<DbProduct[]> => {
      let q = supabase.from("products").select(PRODUCT_SELECT).neq("id", productId!).limit(4);
      if (categoryId) q = q.eq("category_id", categoryId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as DbProduct[];
    },
  });
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");