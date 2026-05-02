import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Lock, CreditCard, Truck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useShop } from "@/context/ShopContext";
import { formatPKR } from "@/lib/format";
import { productImage } from "@/lib/product-images";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Ali Baba Jewellers" },
      { name: "description", content: "Securely complete your Ali Baba Jewellers order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cartItems, cartTotal } = useShop();

  const handleWhatsAppOrder = () => {
    let message = "Hello, I want to talk about and get information about this product:\n\n";
    cartItems.forEach(({ product, qty }) => {
      const categoryName = product.category?.name ?? "Jewellery";
      message += `Category: ${categoryName}\nProduct: ${qty}x ${product.name}\nPrice: ${formatPKR(Number(product.price_pkr) * qty)}\n\n`;
    });
    message += `*Total: ${formatPKR(cartTotal)}*`;

    const whatsappUrl = `https://wa.me/923358627697?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-36 pb-20 bg-background">
        <div className="max-w-xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Secure Checkout</p>
            <h1 className="font-display text-4xl md:text-5xl text-onyx">Complete Your Order</h1>
          </div>

          <aside className="bg-cream border border-border p-7 h-fit">
            <h2 className="font-display text-2xl text-onyx mb-5">Your Order</h2>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your bag is empty.</p>
              ) : (
                cartItems.map(({ product, qty }) => (
                  <div key={product.id} className="flex gap-3">
                    <div className="relative shrink-0">
                      <img src={productImage(product.image_url, product.slug, product.category?.slug)} alt={product.name} className="w-16 h-16 object-cover bg-background" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-onyx text-cream text-[10px] flex items-center justify-center font-semibold">
                        {qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm text-onyx leading-tight">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category?.name ?? ""}</p>
                    </div>
                    <p className="font-display text-sm">{formatPKR(Number(product.price_pkr) * qty)}</p>
                  </div>
                ))
              )}
            </div>
            <div className="gold-divider my-5" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPKR(cartTotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Complimentary</span></div>
            </div>
            <div className="gold-divider my-5" />
            <div className="flex justify-between items-baseline">
              <span className="text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground">Total</span>
              <span className="font-display text-3xl text-onyx">{formatPKR(cartTotal)}</span>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              disabled={cartItems.length === 0}
              className="mt-6 w-full bg-gradient-gold text-onyx py-4 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:shadow-gold transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Order Confirm in WhatsApp
            </button>
            <Link
              to="/cart"
              className="mt-3 block text-center text-xs tracking-[0.25em] uppercase text-muted-foreground hover:text-gold-dark transition-colors py-2"
            >
              Return to Bag
            </Link>
          </aside>

          {/* 
          // Previous payment/info form (commented out as requested)
          <div className="hidden lg:col-span-2 space-y-8">
            <Section title="Contact" icon={<Lock className="w-4 h-4" />}>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Email" type="email" required />
                <Input label="Phone" type="tel" required />
              </div>
            </Section>

            <Section title="Shipping Address" icon={<Truck className="w-4 h-4" />}>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="First Name" required />
                <Input label="Last Name" required />
              </div>
              <Input label="Street Address" required />
              <div className="grid sm:grid-cols-3 gap-5">
                <Input label="City" required />
                <Input label="Postal Code" required />
                <Input label="Country" defaultValue="United Kingdom" required />
              </div>
            </Section>

            <Section title="Payment" icon={<CreditCard className="w-4 h-4" />}>
              <Input label="Cardholder Name" required />
              <Input label="Card Number" placeholder="1234 5678 9012 3456" required />
              <div className="grid grid-cols-2 gap-5">
                <Input label="Expiry (MM/YY)" placeholder="04/28" required />
                <Input label="CVV" placeholder="123" required />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2 pt-2">
                <Lock className="w-3 h-3" /> Your payment is secured with end-to-end encryption.
              </p>
            </Section>
          </div>
          */}
        </div>
      </section>
    </SiteLayout>
  );
}

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="bg-card border border-border p-7 space-y-5">
      <h2 className="font-display text-2xl text-onyx flex items-center gap-3">
        <span className="w-8 h-8 bg-gold/10 text-gold-dark flex items-center justify-center">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Input({
  label,
  type = "text",
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground">{label}</span>
      <input
        type={type}
        {...rest}
        className="mt-1.5 w-full bg-transparent border-b border-input py-2.5 outline-none focus:border-gold transition-colors"
      />
    </label>
  );
}