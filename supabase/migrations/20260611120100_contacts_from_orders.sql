-- Maison Tanneurs fork: auto-create CRM contacts from storefront orders.
--
-- Every order upserts a contact (matched case-insensitively on
-- customer_email inside email_jsonb) and appends a contact_note with the
-- order summary. Runs as an AFTER INSERT trigger on public.orders, so it
-- covers both the storefront's Stripe webhook inserts (service role) and
-- the CRM's manual order entry.
--
-- Design constraints:
-- * NEVER break order persistence — the trigger swallows its own errors.
-- * NEVER add latency to the webhook transaction — contacts are created
--   with avatar='{}' so Atomic's handle_contact_saved trigger skips its
--   synchronous Gravatar HTTP fetch.
-- * sales_id falls back to the first administrator because webhook
--   inserts carry no auth context (auth.uid() is null under service role).

CREATE OR REPLACE FUNCTION public.crm_contact_from_order(o public.orders)
RETURNS bigint
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
declare
  v_email text := lower(trim(o.customer_email));
  v_name text := coalesce(trim(o.customer_name), '');
  v_first text;
  v_last text;
  v_contact_id bigint;
  v_sales_id bigint;
begin
  if v_email is null or v_email = '' then
    return null;
  end if;

  select id into v_sales_id
  from sales
  where administrator
  order by id
  limit 1;

  select id into v_contact_id
  from contacts
  where email_jsonb @> jsonb_build_array(jsonb_build_object('email', v_email))
  limit 1;

  if v_contact_id is null then
    v_first := coalesce(nullif(split_part(v_name, ' ', 1), ''), 'Unknown');
    v_last := nullif(trim(substr(v_name, length(split_part(v_name, ' ', 1)) + 1)), '');

    insert into contacts (
      first_name, last_name, email_jsonb, avatar,
      first_seen, last_seen, has_newsletter, status, background, sales_id
    ) values (
      v_first, v_last,
      jsonb_build_array(jsonb_build_object('email', v_email, 'type', 'Other')),
      '{}'::jsonb,
      o.created_at, o.created_at, false, 'hot',
      'Maison Tanneurs customer (auto-created from order)',
      v_sales_id
    )
    returning id into v_contact_id;
  else
    update contacts
    set last_seen = greatest(coalesce(last_seen, o.created_at), o.created_at)
    where id = v_contact_id;
  end if;

  insert into contact_notes (contact_id, text, date, sales_id)
  values (
    v_contact_id,
    'Order ' || o.order_number
      || ' — ' || to_char(o.total / 100.0, 'FM999999990.00')
      || ' ' || coalesce(o.currency, 'USD')
      || ' — ' || coalesce(jsonb_array_length(o.items), 0) || ' item(s)'
      || ' [' || o.sales_channel || ']',
    o.created_at,
    v_sales_id
  );

  return v_contact_id;
end;
$$;

CREATE OR REPLACE FUNCTION public.handle_order_created()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
begin
  perform public.crm_contact_from_order(new);
  return new;
exception when others then
  -- CRM bookkeeping must never break order persistence.
  raise warning 'contacts_from_orders failed for order %: %', new.id, sqlerrm;
  return new;
end;
$$;

DROP TRIGGER IF EXISTS order_created_crm_contact ON public.orders;
CREATE TRIGGER order_created_crm_contact
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_created();

-- NOTE: the one-time backfill of pre-existing orders is intentionally NOT
-- part of this migration. It must run AFTER the first admin signs up so
-- contacts get a sales_id owner. See supabase/backfill_contacts_from_orders.sql.
