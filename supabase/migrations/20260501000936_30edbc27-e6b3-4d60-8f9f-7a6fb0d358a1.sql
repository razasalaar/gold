
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer (avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Auto-create profile + default user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  description TEXT,
  price_pkr NUMERIC(12,2) NOT NULL DEFAULT 0,
  weight_tola NUMERIC(8,3) DEFAULT 0,
  weight_masha NUMERIC(8,3) DEFAULT 0,
  weight_ratti NUMERIC(8,3) DEFAULT 0,
  weight_grams NUMERIC(8,3) DEFAULT 0,
  purity TEXT DEFAULT '22K',
  image_url TEXT,
  stock INT NOT NULL DEFAULT 0,
  badge TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: profiles
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- RLS: user_roles
CREATE POLICY "user_roles_select_own" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_roles_select_admin" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_admin_all" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: categories
CREATE POLICY "categories_select_public" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories_admin_all" ON public.categories
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: products
CREATE POLICY "products_select_public" ON public.products
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products_admin_all" ON public.products
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "product_images_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "product_images_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed categories
INSERT INTO public.categories (name, slug) VALUES
  ('Rings', 'rings'),
  ('Necklaces', 'necklaces'),
  ('Earrings', 'earrings'),
  ('Bracelets', 'bracelets'),
  ('Bridal', 'bridal');

-- Seed products (PKR pricing & traditional weights)
WITH cats AS (SELECT id, slug FROM public.categories)
INSERT INTO public.products (name, slug, category_id, description, price_pkr, weight_tola, weight_masha, weight_ratti, weight_grams, purity, stock, is_featured, badge)
VALUES
  ('Celeste Solitaire Ring', 'celeste-solitaire', (SELECT id FROM cats WHERE slug='rings'),
   'A timeless brilliant-cut diamond set in 22k gold. Hand-finished by master artisans.',
   285000, 0.5, 6, 0, 5.832, '22K', 5, true, 'Bestseller'),
  ('Aurora Pendant Necklace', 'aurora-pendant', (SELECT id FROM cats WHERE slug='necklaces'),
   'Sculpted gold pendant cradling a single diamond — an everyday heirloom.',
   145000, 0.25, 3, 0, 2.916, '22K', 8, true, NULL),
  ('Pavé Diamond Hoops', 'pave-hoops', (SELECT id FROM cats WHERE slug='earrings'),
   'Encrusted with hand-set diamonds, these gold hoops bring quiet, modern luxury.',
   198000, 0.4, 4, 8, 4.665, '22K', 4, true, 'New'),
  ('Lumière Chain Bracelet', 'lumiere-chain', (SELECT id FROM cats WHERE slug='bracelets'),
   'A delicate cable chain in warm gold — designed to layer beautifully.',
   89000, 0.3, 3, 6, 3.499, '22K', 12, false, NULL),
  ('Eternia Half-Eternity Band', 'eternia-band', (SELECT id FROM cats WHERE slug='rings'),
   'Seven brilliant diamonds set in solid gold — a symbol of forever.',
   345000, 0.6, 7, 2, 6.998, '22K', 3, true, NULL),
  ('Verde Emerald Necklace', 'verde-emerald', (SELECT id FROM cats WHERE slug='necklaces'),
   'A statement necklace of natural emeralds set in 22k gold.',
   589000, 1.2, 14, 4, 13.997, '22K', 2, false, 'Limited'),
  ('Azure Sapphire Studs', 'azure-studs', (SELECT id FROM cats WHERE slug='earrings'),
   'Royal-blue sapphires set in four-prong gold mounts.',
   72000, 0.2, 2, 4, 2.333, '22K', 15, false, NULL),
  ('Héritage Engraved Bangle', 'heritage-bangle', (SELECT id FROM cats WHERE slug='bracelets'),
   'Inspired by heirloom craftsmanship, this hand-engraved bangle.',
   129000, 0.5, 6, 0, 5.832, '22K', 6, true, NULL);
