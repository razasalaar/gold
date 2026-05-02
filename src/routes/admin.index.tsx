import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Package, Tags, Star, ArrowUpRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/lib/products";
import { formatPKR } from "@/lib/format";
import { productImage } from "@/lib/product-images";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin · Dashboard — Ali Baba Jewellers" }] }),
  component: AdminDashboard,
});

function useStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [pc, cc, fc] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("is_featured", true),
      ]);
      return {
        products: pc.count ?? 0,
        categories: cc.count ?? 0,
        featured: fc.count ?? 0,
      };
    },
  });
}

function AdminDashboard() {
  const { data: stats } = useStats();
  const { data: products = [] } = useProducts();

  const cards = [
    { label: "Products", value: stats?.products ?? 0, Icon: Package },
    { label: "Categories", value: stats?.categories ?? 0, Icon: Tags },
    { label: "Featured", value: stats?.featured ?? 0, Icon: Star },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-card p-6 border border-border hover-lift"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground">{s.label}</p>
                <p className="font-display text-4xl text-onyx mt-2">{s.value}</p>
              </div>
              <div className="w-10 h-10 bg-gold/10 text-gold-dark flex items-center justify-center">
                <s.Icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-8">
        <div className="lg:col-span-2 bg-card p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-onyx">Recent Products</h2>
            <Link to="/admin/products" className="text-xs tracking-[0.25em] uppercase text-gold-dark luxury-link inline-flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No products yet.</p>
              <Link to="/admin/products/new" className="mt-3 inline-block text-xs tracking-[0.3em] uppercase text-gold-dark luxury-link">
                Add the first piece →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <img src={productImage(p.image_url, p.slug, p.category?.slug)} alt="" className="w-14 h-14 object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg text-onyx truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground tracking-wide">{p.category?.name ?? "Uncategorized"}</p>
                  </div>
                  <p className="font-display text-lg">{formatPKR(p.price_pkr)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-onyx text-cream p-7 border border-gold/20">
          <p className="text-[0.6rem] tracking-[0.35em] uppercase text-gold mb-3">Quick action</p>
          <h3 className="font-display text-2xl">Add a new piece</h3>
          <p className="text-cream/65 text-sm mt-3 leading-relaxed">
            Showcase your latest creation in the boutique within minutes.
          </p>
          <Link
            to="/admin/products/new"
            className="mt-7 inline-flex items-center gap-3 bg-gold text-onyx px-6 py-3 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:bg-gold-light transition-colors"
          >
            New Product →
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
