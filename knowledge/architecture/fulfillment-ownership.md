---
okf: 0.1
type: reference
title: CRM owns fulfillment (and only fulfillment)
status: current
owner: any-agent
updated: 2026-06-28
resource: "migration 20260612210000 (column-level grants on orders)"
tags: [orders, fulfillment, permissions]
links: [backend-and-storefront-boundary]
---

## What the CRM owns

- Order status transitions: `paid → shipped → delivered`
- Tracking numbers, internal notes
- The shipping-notification email — Edge Function `shipping-email`,
  exactly-once via `orders.shipping_email_sent_at`
- Manual Etsy / offline order entry
- Contacts auto-created from orders (Postgres trigger)

## Orders are immutable except fulfillment

The `authenticated` role has **column-level UPDATE only** on
`status, tracking_number, notes, shipping_email_sent_at`
(migration `20260612210000`) and **no DELETE**.

> `OrderEdit`'s transform must keep sending ONLY those fields, or saves fail
> with permission errors. Amount/contents fixes go through the **service role**.

## Attachments bucket is PRIVATE

Stored `src` URLs expire; the canonical reference is `path`, re-signed at render:
- note attachments → `notes/useAttachmentUrl.ts`
- user avatars → `signAvatarUrl` in the authProvider

> Never reintroduce `getPublicUrl`.
