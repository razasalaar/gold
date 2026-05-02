import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Clock, User, Globe } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ali Baba Jewellers" },
      { name: "description", content: "Visit Ali Baba Jewellers at Rail Bazaar, Faisalabad. Call us on +92 335 8627697. Open Mon–Sun (Friday off). Always available online 24/7." },
    ],
  }),
  component: ContactPage,
});

const info = [
  {
    Icon: User,
    title: "Contact Person",
    lines: [{ text: "Yaseen" }],
  },
  {
    Icon: Phone,
    title: "Phone",
    lines: [{ text: "+92 335 8627697", href: "https://wa.me/923358627697" }],
  },
  {
    Icon: MapPin,
    title: "Address",
    lines: [{ text: "Rail Bazaar" }, { text: "Faisalabad, Pakistan" }],
  },
  {
    Icon: Clock,
    title: "Shop Hours",
    lines: [
      { text: "Mon – Thu · Open" },
      { text: "Friday · Closed" },
      { text: "Sat – Sun · Open" },
    ],
  },
  {
    Icon: Globe,
    title: "Online",
    lines: [{ text: "Available 24 / 7" }],
  },
];

function ContactPage() {
  return (
    <SiteLayout>
      <section className="pt-36 pb-20 bg-background">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-4">Reach Us</p>
            <h1 className="font-display text-5xl md:text-6xl text-onyx leading-tight">Get in Touch</h1>
            <p className="mt-5 text-muted-foreground">
              Visit our boutique at Rail Bazaar, Faisalabad or call us directly. We are always happy to help.
            </p>
          </div>

          <div className="space-y-8 max-w-sm mx-auto sm:max-w-none">
            {info.map(({ Icon, title, lines }) => (
              <div key={title} className="flex gap-4">
                <div className="w-12 h-12 border border-gold/40 flex items-center justify-center text-gold-dark shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-onyx">{title}</h3>
                  {lines.map(({ text, href }) =>
                    href ? (
                      <a key={text} href={href} target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground mt-1 hover:text-gold transition-colors">
                        {text}
                      </a>
                    ) : (
                      <p key={text} className="text-sm text-muted-foreground mt-1">{text}</p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}