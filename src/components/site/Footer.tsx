import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube, Phone, MapPin, Clock, Globe } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-onyx text-cream/80 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14">
          <div className="space-y-5">
            <Logo />
            <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
              Crafting timeless gold jewelry since 1962 — heirlooms made for
              every precious moment.
            </p>
            <div className="flex gap-3 pt-2">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-onyx transition-all"
                  aria-label="social"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-sans font-semibold">Shop</h4>
            <ul className="space-y-3 text-sm">
              {["Rings", "Necklaces", "Earrings", "Bracelets", "Bridal Sets"].map((c) => (
                <li key={c}>
                  <Link to="/shop" className="hover:text-gold transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-sans font-semibold">Maison</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Boutiques</Link></li>
              <li><a href="#" className="hover:text-gold transition-colors">Craftsmanship</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Sustainability</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs tracking-[0.3em] uppercase mb-5 font-sans font-semibold">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <a
                  href="https://wa.me/923358627697"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 hover:text-gold transition-colors leading-relaxed"
                >
                  Yaseen · +92 335 8627697
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-cream/70 leading-relaxed">Rail Bazaar, Faisalabad</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-cream/70 leading-relaxed">Mon–Thu &amp; Sat–Sun · Open<br />Friday · Closed</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="text-cream/70 leading-relaxed">Online 24 / 7</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-divider" />
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-cream/50 tracking-wider">
          <p>© {new Date().getFullYear()} Ali Baba Jewellers. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}