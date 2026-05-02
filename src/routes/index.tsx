import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HeroSlider } from "@/components/site/HeroSlider";
import { Categories } from "@/components/site/Categories";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { PromoBanner } from "@/components/site/PromoBanner";
import { Testimonials } from "@/components/site/Testimonials";
import { Craftsmanship } from "@/components/site/Craftsmanship";
import { TrustStrip } from "@/components/site/TrustStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ali Baba Jewellers — Timeless Gold Elegance" },
      { name: "description", content: "Premium handcrafted gold jewelry, bridal sets and luxury heirlooms by Ali Baba Jewellers." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <HeroSlider />
      <TrustStrip />
      <Categories />
      <FeaturedProducts />
      <Craftsmanship />
      <PromoBanner />
      <Testimonials />
    </SiteLayout>
  );
}
