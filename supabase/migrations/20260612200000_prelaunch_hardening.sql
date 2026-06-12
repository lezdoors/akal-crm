-- Pre-launch hardening (2026-06-12 audit).
--
-- 1. crm_contact_from_order: a NULL sales_channel or total propagated NULL
--    through string concatenation, producing contact_notes with text = NULL.
--    Coalesce every nullable field used in the note.
-- 2. Revoke anon EXECUTE on RPC-callable functions (defense in depth — none
--    are SECURITY DEFINER, but anon has no business calling them).
--    merge_contacts keeps authenticated EXECUTE: the CRM's contact-merge
--    button calls it via PostgREST RPC.

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
    'Order ' || coalesce(o.order_number, '?')
      || ' — ' || to_char(coalesce(o.total, 0) / 100.0, 'FM999999990.00')
      || ' ' || coalesce(o.currency, 'USD')
      || ' — ' || coalesce(jsonb_array_length(o.items), 0) || ' item(s)'
      || ' [' || coalesce(o.sales_channel, 'web') || ']',
    o.created_at,
    v_sales_id
  );

  return v_contact_id;
end;
$$;

-- anon inherits EXECUTE through PUBLIC, so the revoke must target PUBLIC;
-- authenticated + service_role get explicit grants back.
REVOKE EXECUTE ON FUNCTION public.crm_contact_from_order(o public.orders) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.merge_contacts(loser_id bigint, winner_id bigint) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_avatar_for_email(email text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_domain_favicon(domain_name text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.crm_contact_from_order(o public.orders) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.merge_contacts(loser_id bigint, winner_id bigint) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_avatar_for_email(email text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_domain_favicon(domain_name text) TO authenticated, service_role;
