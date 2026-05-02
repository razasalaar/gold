import { useEffect, useState } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  LogOut,
  Menu,
  X,
  Loader2,
  Store,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/products/new", label: "Add Product", icon: PlusCircle },
  { to: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin) {
      toast.error("Admin access required");
      router.navigate({ to: "/account" });
    }
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-6 h-6 animate-spin text-gold-dark" />
      </div>
    );
  }

  const initials = (user.user_metadata?.full_name || user.email || "A")
    .split(/[\s@]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-cream flex">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-7 border-b border-sidebar-border flex items-center justify-between">
          <Logo />
          <button onClick={() => setOpen(false)} className="lg:hidden text-sidebar-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="px-7 mt-6 text-[0.6rem] tracking-[0.35em] uppercase text-gold font-sans font-semibold">
          Maison Console
        </p>
        <nav className="flex-1 px-4 mt-4 space-y-1">
          {nav.map(({ to, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === to
              : pathname === to || (pathname.startsWith(to) && to !== "/admin");
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-colors rounded-sm ${
                  active
                    ? "bg-gold/15 text-gold border-l-2 border-gold"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-gold"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-sidebar-foreground/70 hover:text-gold transition-colors">
            <Store className="w-4 h-4" />
            Back to Site
          </Link>
          <button
            onClick={async () => {
              await signOut();
              toast.success("Signed out");
              router.navigate({ to: "/" });
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-sidebar-foreground/70 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 lg:ml-0 flex flex-col min-w-0">
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-5 lg:px-10 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display text-2xl text-onyx">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground">{user.email}</span>
            <div className="w-9 h-9 rounded-full bg-gradient-gold-soft flex items-center justify-center text-onyx font-semibold text-sm">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-10 max-w-[1400px] w-full">{children}</main>
      </div>
    </div>
  );
}
