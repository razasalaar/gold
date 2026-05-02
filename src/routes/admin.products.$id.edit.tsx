import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { useProduct } from "@/lib/products";

export const Route = createFileRoute("/admin/products/$id/edit")({
  head: () => ({ meta: [{ title: "Admin · Edit Product — Ali Baba Jewellers" }] }),
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const { data: product, isLoading } = useProduct(id);

  return (
    <AdminLayout title="Edit Product">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold-dark mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>
      {isLoading ? (
        <div className="text-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gold-dark inline" /></div>
      ) : !product ? (
        <p className="text-muted-foreground">Product not found.</p>
      ) : (
        <ProductForm existing={product} />
      )}
    </AdminLayout>
  );
}
