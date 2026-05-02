import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCategories, slugify, type DbProduct } from "@/lib/products";
import { toast } from "sonner";

type FormState = {
  name: string;
  slug: string;
  category_id: string;
  description: string;
  price_pkr: string;
  weight_tola: string;
  weight_masha: string;
  weight_ratti: string;
  weight_grams: string;
  purity: string;
  stock: string;
  badge: string;
  is_featured: boolean;
  image_url: string;
};

const empty: FormState = {
  name: "", slug: "", category_id: "", description: "",
  price_pkr: "", weight_tola: "", weight_masha: "", weight_ratti: "", weight_grams: "",
  purity: "22K", stock: "1", badge: "", is_featured: false, image_url: "",
};

export function ProductForm({ existing }: { existing?: DbProduct }) {
  const { data: cats = [] } = useCategories();
  const [form, setForm] = useState<FormState>(empty);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        slug: existing.slug,
        category_id: existing.category_id ?? "",
        description: existing.description ?? "",
        price_pkr: String(existing.price_pkr ?? ""),
        weight_tola: String(existing.weight_tola ?? ""),
        weight_masha: String(existing.weight_masha ?? ""),
        weight_ratti: String(existing.weight_ratti ?? ""),
        weight_grams: String(existing.weight_grams ?? ""),
        purity: existing.purity ?? "22K",
        stock: String(existing.stock ?? 0),
        badge: existing.badge ?? "",
        is_featured: !!existing.is_featured,
        image_url: existing.image_url ?? "",
      });
      setPreview(existing.image_url);
    }
  }, [existing]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v, ...(k === "name" && !existing ? { slug: slugify(String(v)) } : {}) }));

  const onFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : form.image_url);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price_pkr || !form.category_id) {
      toast.error("Name, category and price are required");
      return;
    }
    setBusy(true);
    try {
      let imageUrl = form.image_url;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${Date.now()}-${slugify(form.name)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = pub.publicUrl;
      }

      const payload = {
        name: form.name.trim(),
        slug: (form.slug || slugify(form.name)).trim(),
        category_id: form.category_id,
        description: form.description.trim() || null,
        price_pkr: Number(form.price_pkr) || 0,
        weight_tola: Number(form.weight_tola) || 0,
        weight_masha: Number(form.weight_masha) || 0,
        weight_ratti: Number(form.weight_ratti) || 0,
        weight_grams: Number(form.weight_grams) || 0,
        purity: form.purity || "22K",
        stock: Number(form.stock) || 0,
        badge: form.badge.trim() || null,
        is_featured: form.is_featured,
        image_url: imageUrl || null,
      };

      if (existing) {
        const { error } = await supabase.from("products").update(payload).eq("id", existing.id);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Product published");
      }
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      navigate({ to: "/admin/products" });
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card border border-border p-7 space-y-6">
        <Field label="Product Name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Celeste Solitaire Ring" />
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground mb-2">Category *</label>
            <select
              required
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
              className="w-full bg-cream border border-border px-4 py-3 outline-none focus:border-gold transition-all"
            >
              <option value="">Select category…</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Field label="Price (PKR) *" required type="number" min="0" value={form.price_pkr} onChange={(e) => set("price_pkr", e.target.value)} placeholder="0" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Tola" type="number" step="0.01" min="0" value={form.weight_tola} onChange={(e) => set("weight_tola", e.target.value)} />
          <Field label="Masha" type="number" step="0.01" min="0" value={form.weight_masha} onChange={(e) => set("weight_masha", e.target.value)} />
          <Field label="Ratti" type="number" step="0.01" min="0" value={form.weight_ratti} onChange={(e) => set("weight_ratti", e.target.value)} />
          <Field label="Grams" type="number" step="0.001" min="0" value={form.weight_grams} onChange={(e) => set("weight_grams", e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Purity" value={form.purity} onChange={(e) => set("purity", e.target.value)} placeholder="22K" />
          <Field label="Stock" type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
          <Field label="Badge" value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="New, Bestseller…" />
        </div>

        <Field label="Description" textarea value={form.description} onChange={(e) => set("description", (e.target as HTMLTextAreaElement).value)} placeholder="Tell the story of this piece…" />

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="accent-gold w-4 h-4" />
          <span className="text-sm">Feature on homepage</span>
        </label>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border p-7">
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground mb-4">Product Image</p>
          <label className="aspect-square border-2 border-dashed border-border hover:border-gold transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-cream">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <ImagePlus className="w-8 h-8 text-gold-dark mb-3" />
                <p className="text-sm text-muted-foreground">Click to upload</p>
                <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG up to 5MB</p>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          </label>
          {preview && (
            <button type="button" onClick={() => { setFile(null); setPreview(null); set("image_url", ""); }} className="mt-3 text-xs text-muted-foreground hover:text-destructive">
              Remove image
            </button>
          )}
        </div>

        <div className="bg-card border border-border p-7">
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-gradient-gold text-onyx py-4 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:shadow-gold transition-shadow disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin inline" /> : (existing ? "Save Changes" : "Publish Product")}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label, textarea = false, ...rest
}: { label: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-[0.65rem] tracking-[0.3em] uppercase text-muted-foreground mb-2">{label}</label>
      {textarea ? (
        <textarea
          rows={5}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className="w-full bg-cream border border-border px-4 py-3 outline-none focus:border-gold transition-all resize-none"
        />
      ) : (
        <input
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          className="w-full bg-cream border border-border px-4 py-3 outline-none focus:border-gold transition-all"
        />
      )}
    </div>
  );
}
