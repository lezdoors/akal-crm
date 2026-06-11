-- Maison Tanneurs fork: give the CRM (authenticated Supabase Auth users)
-- access to the storefront-owned `orders` table, and add the exactly-once
-- guard column for the shipping-notification email.
--
-- Additive only. The storefront writes via service role and is unaffected.
-- `anon` remains blocked: the storefront's original
-- "Orders not publicly readable" (USING false) policy stays in place, and
-- permissive policies are OR'd per role — authenticated gains access,
-- anon gains nothing. No DELETE policy on purpose: orders are financial
-- records and must not be deletable from the CRM.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_email_sent_at timestamp with time zone;

DROP POLICY IF EXISTS "Orders readable by authenticated" ON public.orders;
CREATE POLICY "Orders readable by authenticated"
  ON public.orders FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Orders updatable by authenticated" ON public.orders;
CREATE POLICY "Orders updatable by authenticated"
  ON public.orders FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Orders insertable by authenticated" ON public.orders;
CREATE POLICY "Orders insertable by authenticated"
  ON public.orders FOR INSERT TO authenticated
  WITH CHECK (true);
