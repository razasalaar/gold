import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Edit2, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProducts } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { formatPKR } from "@/lib/format";
import { productImage } from "@/lib/product-images";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/products/")({
  head: () => ({ meta: [{ title: "Admin · Products — Ali Baba Jewellers" }] }),
  component: AdminProducts,
});

function AdminProducts() {
  const { data: products = [], isLoading } = useProducts();
  const [q, setQ] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();

  const filtered = products.filter((p) =>
    [p.name, p.category?.name, p.slug].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    const product = products.find((p) => p.id === pendingDelete);
    // Best-effort: remove image from storage if it lives in our bucket
    if (product?.image_url?.includes("/product-images/")) {
      try {
        const path = product.image_url.split("/product-images/")[1]?.split("?")[0];
        if (path) await supabase.storage.from("product-images").remove([path]);
      } catch { /* ignore */ }
    }
    const { error } = await supabase.from("products").delete().eq("id", pendingDelete);
    setBusy(false);
    setPendingDelete(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product removed");
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  return (
    <AdminLayout title="Products">
      <div className="bg-card border border-border">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-10 pr-4 py-2.5 bg-cream border border-border text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-onyx text-cream px-5 py-2.5 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:bg-gold hover:text-onyx transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-2xl text-onyx">No products yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Add your first piece to start the catalog.</p>
            <Link to="/admin/products/new" className="mt-6 inline-flex items-center gap-2 bg-gradient-gold text-onyx px-5 py-3 text-[0.7rem] tracking-[0.3em] uppercase font-semibold">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr className="text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Category</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Stock</th>
                  <th className="text-right p-4 font-medium">Price</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-cream/50">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={productImage(p.image_url, p.slug, p.category?.slug)} alt="" className="w-12 h-12 object-cover" />
                        <div>
                          <p className="font-display text-base text-onyx">{p.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{p.category?.name ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">{p.category?.name ?? "—"}</td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`inline-block px-2.5 py-1 text-xs ${p.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {p.stock > 0 ? `${p.stock} in stock` : "Out"}
                      </span>
                    </td>
                    <td className="p-4 text-right font-display text-lg">{formatPKR(p.price_pkr)}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1">
                        <Link to="/admin/products/$id/edit" params={{ id: p.id }} className="p-2 hover:text-gold-dark inline-flex" aria-label="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setPendingDelete(p.id)} className="p-2 hover:text-destructive" aria-label="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will disappear from the storefront immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={busy} className="bg-destructive hover:bg-destructive/90">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
