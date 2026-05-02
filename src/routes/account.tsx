import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Ali Baba Jewellers" },
      { name: "description", content: "Sign in or create your Ali Baba Jewellers private account." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, isAdmin, loading, signOut, refreshRole } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search }) as { redirect?: string };

  useEffect(() => {
    if (!loading && user && search.redirect) {
      navigate({ to: search.redirect });
    }
  }, [loading, user, search.redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to the maison.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account` },
    });
    if (error) toast.error(error.message);
  };

  const handleClaimAdmin = async () => {
    const { data, error } = await supabase.rpc("claim_admin_if_first");
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data) {
      await refreshRole();
      toast.success("Admin access granted");
    } else {
      toast("Admin already exists. Ask an admin to grant access.");
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="pt-40 pb-32 text-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin inline" />
        </div>
      </SiteLayout>
    );
  }

  if (user) {
    const initials = (user.user_metadata?.full_name || user.email || "U")
      .split(/[\s@]/)[0]
      .slice(0, 2)
      .toUpperCase();
    return (
      <SiteLayout>
        <section className="pt-32 md:pt-36 pb-24 bg-background min-h-[80vh]">
          <div className="max-w-xl mx-auto px-5">
            <div className="text-center">
              <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Private Salon</p>
              <h1 className="font-display text-5xl text-onyx">My Account</h1>
            </div>

            <div className="mt-12 bg-card border border-border p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-gold-soft flex items-center justify-center text-onyx font-display text-xl">
                {initials}
              </div>
              <p className="mt-4 font-display text-2xl text-onyx">
                {user.user_metadata?.full_name || "Welcome"}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {isAdmin && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.25em] uppercase text-gold-dark">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </p>
              )}
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <Link to="/wishlist" className="border border-border p-5 hover:border-gold hover:text-gold-dark transition-colors text-center text-[0.7rem] tracking-[0.25em] uppercase">
                My Wishlist
              </Link>
              <Link to="/cart" className="border border-border p-5 hover:border-gold hover:text-gold-dark transition-colors text-center text-[0.7rem] tracking-[0.25em] uppercase">
                Shopping Bag
              </Link>
              {isAdmin && (
                <Link to="/admin" className="sm:col-span-2 bg-onyx text-cream p-5 hover:bg-gold hover:text-onyx transition-colors text-center text-[0.7rem] tracking-[0.3em] uppercase font-semibold">
                  Open Admin Console →
                </Link>
              )}
              {!isAdmin && (
                <button
                  onClick={handleClaimAdmin}
                  className="sm:col-span-2 border border-gold/40 text-gold-dark p-5 hover:bg-gold hover:text-onyx transition-colors text-center text-[0.7rem] tracking-[0.3em] uppercase font-semibold"
                >
                  Claim Admin (first user only)
                </button>
              )}
              <button
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out");
                }}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 border border-border p-5 hover:border-destructive hover:text-destructive transition-colors text-[0.7rem] tracking-[0.25em] uppercase"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="pt-32 md:pt-36 pb-24 bg-background min-h-[80vh]">
        <div className="max-w-md mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[0.7rem] tracking-[0.4em] uppercase text-gold mb-3">Private Salon</p>
            <h1 className="font-display text-5xl text-onyx">
              {mode === "signin" ? "Welcome Back" : "Join the Maison"}
            </h1>
            <p className="mt-3 text-muted-foreground text-sm">
              {mode === "signin"
                ? "Sign in to access your orders, wishlist and private invitations."
                : "Create an account to enjoy exclusive previews and a personal concierge."}
            </p>
          </div>

          <div className="flex border-b border-border mb-8">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 pb-4 text-[0.7rem] tracking-[0.3em] uppercase font-semibold transition-colors relative ${
                  mode === m ? "text-onyx" : "text-muted-foreground hover:text-onyx"
                }`}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
                {mode === m && (
                  <motion.span layoutId="account-underline" className="absolute left-0 right-0 bottom-[-1px] h-px bg-gold" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleGoogle}
            className="w-full border border-border py-3.5 text-sm font-medium hover:border-gold hover:text-gold-dark transition-colors flex items-center justify-center gap-3 mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.5-5.9 7.7-11.3 7.7-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16 4 9.1 8.6 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2 1.4-4.6 2.3-7.5 2.3-5.4 0-9.7-3.2-11.3-7.7l-6.5 5C9 39.4 16 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.5C40 35.7 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {mode === "signup" && (
                <Field label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              )}
              <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-onyx text-cream py-4 text-[0.7rem] tracking-[0.3em] uppercase font-semibold hover:bg-gold hover:text-onyx transition-colors disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin inline" /> : (mode === "signin" ? "Sign In" : "Create Account")}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, type = "text", ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground">{label}</span>
      <input
        type={type}
        {...rest}
        className="mt-2 w-full bg-transparent border-b border-input py-3 outline-none focus:border-gold transition-colors"
      />
    </label>
  );
}
