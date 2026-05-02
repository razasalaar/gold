
-- Fix search_path on helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Restrict execute on SECURITY DEFINER functions (only triggers/internal use)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
-- has_role is used inside RLS policies which run as the policy's role context;
-- keep it executable to authenticated for client-side role checks (own roles only).
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Tighten storage SELECT to specific product-images files (no listing of arbitrary buckets)
DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');
