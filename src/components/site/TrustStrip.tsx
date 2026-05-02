import { Truck, ShieldCheck, RefreshCw, Gem } from "lucide-react";

const items = [
  { Icon: Truck, title: "Complimentary Shipping", desc: "Insured worldwide delivery" },
  { Icon: Gem, title: "Certified 22k Gold", desc: "Hallmarked & ethically sourced" },
  { Icon: ShieldCheck, title: "Lifetime Warranty", desc: "Free polishing & re-plating" },
  { Icon: RefreshCw, title: "30-Day Returns", desc: "No-questions-asked promise" },
];

export function TrustStrip() {
  return (
    <section className="bg-onyx border-y border-gold/15 py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map(({ Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full border border-gold/40 flex items-center justify-center text-gold shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-cream text-sm font-medium">{title}</p>
              <p className="text-cream/55 text-xs mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}