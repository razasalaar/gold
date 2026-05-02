import { Link } from "@tanstack/react-router";

export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const color = variant === "dark" ? "text-onyx" : "text-cream";
  return (
    <Link to="/" className="flex flex-col leading-none group">
      <span
        className={`font-display text-2xl tracking-[0.18em] uppercase ${color} group-hover:text-gold transition-colors`}
      >
        Ali Baba
      </span>
      <span className="text-[0.6rem] tracking-[0.4em] uppercase text-gold mt-0.5">
        Jewellers
      </span>
    </Link>
  );
}
