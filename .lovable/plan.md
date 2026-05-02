## Goal
Convert Baba Jewellers from a static demo into a real app backed by Lovable Cloud, with authenticated users, admin-only product management, PKR pricing with traditional Pakistani gold weight units, and snappier perceived performance via skeleton loaders.

---

## 1. Enable Lovable Cloud + Auth
- Enable Lovable Cloud (Supabase under the hood).
- Auth methods: **Email + Password** and **Google** (defaults).
- Auto-confirm email enabled for smooth signup.
- A `/reset-password` route will be added for password reset flow.

## 2. Database Schema (migrations)
Tables:
- `profiles` — `id (uuid, FK auth.users)`, `full_name`, `avatar_url`, `phone`, timestamps. Auto-created via trigger on signup.
- `app_role` enum: `admin`, `user`.
- `user_roles` — `id`, `user_id`, `role` (separate table, security-definer `has_role()` function — required to avoid RLS recursion / privilege escalation).
- `categories` — `id`, `name`, `slug`, `image_url`, `created_at`.
- `products` — `id`, `name`, `slug`, `category_id`, `description`, `price_pkr (numeric)`, `weight_tola`, `weight_masha`, `weight_ratti`, `weight_grams`, `purity` (e.g. "22K"), `image_url`, `stock`, `badge`, `is_featured`, `created_at`.

RLS:
- `products`, `categories`: public SELECT; INSERT/UPDATE/DELETE only when `has_role(auth.uid(), 'admin')`.
- `profiles`: user can select/update own row; admins can select all.
- `user_roles`: user can read own roles; only admins can modify.

Storage:
- Public bucket `product-images` for product photos. Admin-only write policy.

Seed: insert a few starter categories (Rings, Necklaces, Earrings, Bracelets, Bridal) and a few products converted from current demo data so the storefront isn't empty.

## 3. Auth UI
- Rebuild `/account` as real Sign In / Sign Up (email+password + Google button).
- `/reset-password` page (required by password reset flow).
- Add `useAuth` hook wrapping `onAuthStateChange` + `getSession` (listener set up FIRST).
- Navbar: when logged out → "Sign In"; when logged in → dropdown with "My Account", "Orders" (placeholder), "Sign Out", and "Admin" link if user has admin role.
- `_authenticated` layout route guarding `/account` area.
- `_authenticated/_admin` layout route guarding `/admin/*` via `has_role` check.

**First admin**: after signup, the user can be promoted via a one-time SQL insert into `user_roles` (I'll explain how in chat). No client-side admin toggle.

## 4. Admin — real CRUD
- `/admin/products` — list from DB, search, delete (with confirm), edit link.
- `/admin/products/new` and `/admin/products/$id/edit` — form with image upload to Storage, all weight fields, category dropdown, PKR price, purity, stock, featured toggle.
- `/admin/categories` — list + add + delete categories (currently a dead link).
- Dashboard stats wired to real counts (products, categories, users).
- All writes via server functions using `requireSupabaseAuth` + admin check in handler.

## 5. Storefront wired to DB
- Replace static `src/data/products.ts` usage with server-fn loaders (`getProducts`, `getProduct`, `getCategories`, `getFeatured`).
- Product cards & detail page show:
  - Price in **PKR** (e.g. `₨ 2,89,000`) — Pakistani locale formatter.
  - Weight breakdown: **Tola · Masha · Ratti · Grams** in a styled spec table on the detail page; compact "X tola" badge on cards.
  - Purity (22K / 24K).
- Cart/wishlist remain in localStorage but reference real product IDs.

## 6. Skeleton loaders + route progress
- Add `RouteProgress` component (top thin gold bar) using `useRouterState({ select: s => s.status })` to show during `pending` route transitions.
- Add reusable skeletons: `ProductCardSkeleton`, `ProductDetailSkeleton`, `AdminTableSkeleton`, `HeroSkeleton`.
- Use TanStack Router's `pendingComponent` on data routes so the page shell appears immediately with skeletons while the loader resolves — this fixes the "page feels slow due to animations before content".
- Reduce/disable entrance animations on initial mount when route is still pending; keep hover/micro animations.
- Add `<Suspense>` fallbacks where appropriate.

## 7. Cleanup
- Remove demo "HB" avatar and hardcoded admin chrome — show real user initials/email.
- Remove static demo products file once DB is seeded (keep type definitions).
- Toasts (sonner) already in place — used for auth + CRUD feedback.

---

## Technical notes
- Server functions in `src/server/*.functions.ts`, server-only helpers in `*.server.ts`.
- Admin mutations: `requireSupabaseAuth` middleware + explicit `has_role` check inside handler before using `supabaseAdmin` for the write.
- Image uploads: signed-upload or direct upload to public bucket; store returned public URL on product row.
- Currency formatter: `new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })`.
- Weight conversions reference (for admin helper text): 1 tola = 12 masha = 96 ratti ≈ 11.664 g.

---

## Out of scope (ask if you want these next)
- Real checkout / payments (Stripe/JazzCash).
- Order history table & admin orders view.
- Email notifications.

Reply **approve** to proceed, or tell me what to change.