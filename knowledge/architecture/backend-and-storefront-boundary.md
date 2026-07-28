---
okf: 0.1
type: reference
title: Backend & storefront boundary
status: current
owner: any-agent
updated: 2026-06-28
resource: "Supabase project xbtabpurfavngwmwtawc (Maison Tanneurs production)"
tags: [supabase, boundary, storefront]
links: [fulfillment-ownership, deployment-and-money]
---

## Shared backend

The CRM's backend is the **live Maison Tanneurs Supabase project
`xbtabpurfavngwmwtawc`** — the *same* project the production storefront writes
to. Atomic's CRM schema (`contacts`, `deals`, `tasks`, `sales`…) is installed
alongside the storefront tables (`orders`, `products`, `craftsmen`,
`admin_users`).

> **Never modify storefront tables except by explicitly additive migration.**

v1 serves **Maison Tanneurs**. Maison Izem is added at its launch as a second
*build* of this same repo with Izem env vars — **no code fork**.

## The storefront is another agent's workspace — read-only

Production storefront: `lezdoors/mt-lestanneurs`, local clone
`~/maison-tanneurs-storefront`. **Read-only, never edit.**

The storefront's Stripe webhook owns these jobs — the CRM must **never**
duplicate them:
- inserts `orders` (status `paid`)
- flips products sold
- sends order-confirmation + admin emails
- fires Meta CAPI

The Stripe PaymentIntent id (`pi_…`) lands in `orders.stripe_payment_intent_id`
— the idempotency key (`UNIQUE`, the `ON CONFLICT` target). Maison Tanneurs is
Stripe-only; this column was renamed from the pre-launch `revolut_order_id`
name on 2026-06-28. The separate `stripe_session_id` column is unused on Tanneurs.

See [fulfillment-ownership](./fulfillment-ownership.md) for what the CRM *does*
own.
