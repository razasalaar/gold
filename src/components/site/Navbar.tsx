import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X, Heart, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Collection" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const { cartCount, wishlist } = useShop();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-onyx/95 backdrop-blur-md border-b border-gold/15 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <Logo variant="light" />

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="luxury-link text-[0.78rem] tracking-[0.22em] uppercase text-cream/85 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2 text-cream/85 hover:text-gold transition-colors" aria-label="Search">
            <Search className="w-[18px] h-[18px]" />
          </button>
          <Link to="/wishlist" className="p-2 text-cream/85 hover:text-gold transition-colors relative hidden sm:inline-flex" aria-label="Wishlist">
            <Heart className="w-[18px] h-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-onyx text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/account" className="p-2 text-cream/85 hover:text-gold transition-colors hidden sm:inline-flex" aria-label="Account">
            <User className="w-[18px] h-[18px]" />
          </Link>
          {isAdmin && (
            <Link to="/admin" className="p-2 text-gold hover:text-gold-light transition-colors hidden sm:inline-flex" aria-label="Admin">
              <ShieldCheck className="w-[18px] h-[18px]" />
            </Link>
          )}
          <Link to="/cart" className="p-2 text-cream/85 hover:text-gold transition-colors relative" aria-label="Cart">
            <ShoppingBag className="w-[18px] h-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-onyx text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden p-2 text-cream/85 hover:text-gold transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-onyx/98 backdrop-blur-md border-t border-gold/15 mt-3"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  className="text-cream/90 text-sm tracking-[0.22em] uppercase hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/account" className="text-cream/90 text-sm tracking-[0.22em] uppercase hover:text-gold">
                {user ? "My Account" : "Sign In"}
              </Link>
              <Link to="/wishlist" className="text-cream/90 text-sm tracking-[0.22em] uppercase hover:text-gold">
                Wishlist
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gold text-sm tracking-[0.22em] uppercase">
                  Admin Console
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}