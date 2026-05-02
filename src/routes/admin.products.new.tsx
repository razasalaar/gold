import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({ meta: [{ title: "Admin · Add Product — Ali Baba Jewellers" }] }),
  component: AddProduct,
});

function AddProduct() {
  return (
    <AdminLayout title="Add New Product">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold-dark mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>
      <ProductForm />
    </AdminLayout>
  );
}
