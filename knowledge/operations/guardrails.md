---
okf: 0.1
type: reference
title: Guardrails — what not to do
status: current
owner: any-agent
updated: 2026-06-28
tags: [guardrails, rules]
links: [deployment-and-money, backend-and-storefront-boundary, ../design/le-registre]
---

Fast-reference of the hard "do not" rules. Detail lives in the linked nodes.

- **No Vercel deploys without Ryan's explicit "ship it."** Batch all changes
  into one deploy. See [deployment-and-money](../architecture/deployment-and-money.md).
- **Never edit the storefront** (`~/maison-tanneurs-storefront`,
  `lezdoors/mt-lestanneurs`) — another agent's workspace, read-only. See
  [backend-and-storefront-boundary](../architecture/backend-and-storefront-boundary.md).
- **Never modify storefront tables** except by explicitly additive migration.
- **Never duplicate storefront webhook jobs** (order insert, sold flip,
  confirmation email, Meta CAPI).
- **Orders are immutable except fulfillment columns** — keep `OrderEdit` sending
  only `status, tracking_number, notes, shipping_email_sent_at`. See
  [fulfillment-ownership](../architecture/fulfillment-ownership.md).
- **Never `getPublicUrl`** on the private attachments bucket — re-sign `path`.
- **Never sum across currencies** — aggregate per ISO code.
- **No `BrowserRouter`** — hash routing + relative base only.
- **Le Registre always wins** over installed design skills. See
  [le-registre](../design/le-registre.md).
- `~/kechken` (prior storefront) is reference/port-source only, read-only.
- Keep the `upstream` remote (`marmelab/atomic-crm`) for component updates;
  **never push to upstream.**
