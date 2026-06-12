-- One-of-one pieces: any paid order (web, Etsy, offline) must remove its
-- pieces from sale. The storefront webhook already flips products for web
-- orders in app code; this trigger makes the rule universal so manual CRM
-- orders (Etsy / in-person) cannot oversell. Idempotent — setting an
-- already-sold piece to sold is a no-op.
--
-- Same safety contract as the contacts trigger: errors are swallowed so
-- order persistence is never broken.

CREATE OR REPLACE FUNCTION public.mark_order_products_sold()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_item jsonb;
  v_product_id uuid;
begin
  if new.status not in ('paid', 'shipped', 'delivered') then
    return new;
  end if;

  for v_item in select * from jsonb_array_elements(coalesce(new.items, '[]'::jsonb))
  loop
    begin
      v_product_id := (v_item->>'product_id')::uuid;
    exception when others then
      continue; -- free-text product_id on a manual order
    end;

    update products
    set status = 'sold'
    where id = v_product_id
      and status is distinct from 'sold';
  end loop;

  return new;
exception when others then
  raise warning 'mark_order_products_sold failed for order %: %', new.id, sqlerrm;
  return new;
end;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_order_products_sold() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS order_created_mark_sold ON public.orders;
CREATE TRIGGER order_created_mark_sold
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.mark_order_products_sold();
