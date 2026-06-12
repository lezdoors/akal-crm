-- Order contents/amounts are immutable from the CRM (they were written by
-- the storefront webhook or at manual creation). Enforce that invariant at
-- the database: CRM users may UPDATE only the fulfillment columns.
-- The storefront webhook and edge functions use the service role and are
-- unaffected. RLS row policies on orders are unchanged.

REVOKE UPDATE ON public.orders FROM authenticated, anon;
REVOKE DELETE ON public.orders FROM authenticated, anon;

GRANT UPDATE (status, tracking_number, notes, shipping_email_sent_at)
  ON public.orders TO authenticated;
