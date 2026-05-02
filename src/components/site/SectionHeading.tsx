import { motion } from "framer-motion";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-2xl ${alignment}`}
    >
      {eyebrow && (
        <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""} mb-4`}>
          <span className="w-8 h-px bg-gold" />
          <span className="text-[0.7rem] tracking-[0.35em] uppercase text-gold font-sans font-medium">
            {eyebrow}
          </span>
          <span className="w-8 h-px bg-gold" />
        </div>
      )}
      <h2
        className={`font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.05] ${
          light ? "text-cream" : "text-onyx"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-base leading-relaxed ${
            light ? "text-cream/70" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}