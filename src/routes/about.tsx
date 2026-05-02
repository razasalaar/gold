import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import hero from "@/assets/hero-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Ali Baba Jewellers" },
      { name: "description", content: "Six decades of craftsmanship — the story behind Ali Baba Jewellers, where every piece is made by hand and built to last." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="pt-36 pb-20 md:pb-28 bg-background">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-5">Since 1962</p>
          <h1 className="font-display text-5xl md:text-7xl text-onyx leading-[1.05]">
            A Legacy Cast in Gold
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            For over six decades, Ali Baba Jewellers has shaped the precious moments
            of generations — one hand-crafted heirloom at a time.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            src={hero}
            alt="Craftsmanship"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[4/5] object-cover w-full"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <p className="text-[0.7rem] tracking-[0.35em] uppercase text-gold mb-4">The Maison</p>
            <h2 className="font-display text-4xl text-onyx leading-tight">
              Where every gram is shaped by hand
            </h2>
            <div className="gold-divider my-8" />
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Founded in 1962 by Master Jeweler Hari Baba, our atelier began as a single
                workshop dedicated to the lost art of filigree gold work. Today, the same
                hands — passed down through three generations — still draw, hammer, and
                set every piece we offer.
              </p>
              <p>
                We believe luxury is the absence of compromise. From ethically sourced
                22k gold to conflict-free stones hand-selected by our master gemologist,
                every choice is made with the next hundred years in mind.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { n: "62+", l: "Years of Craft" },
                { n: "120k", l: "Heirlooms Made" },
                { n: "32", l: "Boutiques Worldwide" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-3xl text-gradient-gold">{s.n}</p>
                  <p className="text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}