-- One-time backfill: create CRM contacts + order notes for orders that
-- existed before the contacts_from_orders trigger was installed.
--
-- RUN ONCE, AFTER the first admin user has signed up (so sales has an
-- administrator row and contacts get an owner). Re-running duplicates
-- contact_notes — the guard below skips orders whose order number already
-- appears in a note, making a re-run a no-op.
--
-- Oldest first so first_seen / last_seen / note dates are chronological.

DO $$
declare
  o public.orders%rowtype;
begin
  if not exists (select from public.sales where administrator) then
    raise exception 'No administrator in sales yet — sign up the first CRM user before backfilling.';
  end if;

  for o in
    select * from public.orders
    where not exists (
      select from public.contact_notes n
      where n.text like 'Order ' || public.orders.order_number || ' — %'
    )
    order by created_at asc
  loop
    perform public.crm_contact_from_order(o);
  end loop;
end;
$$;
