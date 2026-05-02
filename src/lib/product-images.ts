import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catNecklaces from "@/assets/cat-necklaces.jpg";
import catEarrings from "@/assets/cat-earrings.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";
import catBridal from "@/assets/cat-bridal.jpg";

/** Fallback images for seed products (so storefront isn't empty before admin uploads). */
const SLUG_MAP: Record<string, string> = {
  "celeste-solitaire": p1,
  "aurora-pendant": p2,
  "pave-hoops": p3,
  "lumiere-chain": p4,
  "eternia-band": p5,
  "verde-emerald": p6,
  "azure-studs": p7,
  "heritage-bangle": p8,
};

const CATEGORY_MAP: Record<string, string> = {
  rings: catRings,
  necklaces: catNecklaces,
  earrings: catEarrings,
  bracelets: catBracelets,
  bridal: catBridal,
};

export const productImage = (
  imageUrl?: string | null,
  slug?: string | null,
  categorySlug?: string | null,
) => {
  if (imageUrl && imageUrl.length > 0) return imageUrl;
  if (slug && SLUG_MAP[slug]) return SLUG_MAP[slug];
  if (categorySlug && CATEGORY_MAP[categorySlug]) return CATEGORY_MAP[categorySlug];
  return p1;
};

export const categoryImage = (slug?: string | null) =>
  (slug && CATEGORY_MAP[slug]) || catRings;