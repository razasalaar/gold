import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Loader2, ImagePlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCategories, slugify } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { categoryImage } from "@/lib/product-images";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({ meta: [{ title: "Admin · Categories — Ali Baba Jewellers" }] }),
  component: AdminCategories,
});

function AdminCategories() {
  const { data: cats = [], isLoading } = useCategories();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const onFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      let image_url: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `categories/${Date.now()}-${slugify(name)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, {
          contentType: file.type,
        });
        if (upErr) throw upErr;
        image_url = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from("categories").insert({
        name: name.trim(),
        slug: slugify(name),
        image_url,
      });
      if (error) throw error;
      toast.success("Category added");
      setName(""); setFile(null); setPreview(null);
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to add category");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    const { error } = await supabase.from("categories").delete().eq("id", pendingDelete);
    setBusy(false);
    setPendingDelete(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Category removed");
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  return (
    <AdminLayout title="Categories">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border">
          {isLoading ? (
            <div className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
          ) : cats.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <p>No categories yet. Add the first one →</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cats.map((c) => (
                <div key={c.id} className="flex items-center gap-4 p-4">
                  <img src={c.image_url || categoryImage(c.slug)} alt={c.name} className="w-16 h-16 object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg text-onyx">{c.name}</p>
                    <p className="text-xs text-muted-foreground">/{c.slug}</p>
                  </div>
                  <button onClick={() => setPendingDelete(c.id)} className="p-2 hover:text-destructive" aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleAdd} className="bg-card border border-border p-6 space-y-5 h-fit">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground">New Category</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rings"
            className="w-full bg-cream border border-border px-4 py-3 outline-none focus:border-gold"
          />
          <label className="aspect-video border-2 border-dashed border-border hover:border-gold flex items-center justify-center cursor-pointer overflow-hidden bg-cream">
            {preview ? (
              <img src={preview} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="flex flex-col items-center text-muted-foreground text-xs">
                <ImagePlus className="w-6 h-6 mb-2 text-gold-dark" />
                Optional cover image
              </span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          </label>
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="w-full bg-onyx text-cream py-3 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:bg-gold hover:text-onyx transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add Category</>}
          </button>
        </form>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this category?</AlertDialogTitle>
            <AlertDialogDescription>
              Products in this category will be left without a category. You can reassign them afterwards.
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
