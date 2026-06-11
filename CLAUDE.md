# Akal CRM — fork of marmelab/atomic-crm

Back-office CRM for Akal's consumer brands. v1 serves **Maison Tanneurs**; Maison Izem is added at its launch as a second build of this same repo with Izem env vars (no code fork).

Upstream's agent-team harness (`.claude/`, old CLAUDE.md/MEMORY.md) was removed 2026-06-11 — this fork uses Ryan's standard fleet workflow. `AGENTS.md` (upstream dev docs: commands, architecture, schema workflow) remains accurate and useful.

## Architecture facts

- **Backend**: the live Maison Tanneurs Supabase project `xbtabpurfavngwmwtawc` — the SAME project the production storefront writes to. Atomic's CRM schema (contacts, deals, tasks, sales…) is installed alongside the storefront tables (`orders`, `products`, `craftsmen`, `admin_users`). Never modify storefront tables except by explicitly additive migration.
- **Production storefront**: `lezdoors/mt-lestanneurs`, local clone `~/maison-tanneurs-storefront` — ANOTHER AGENT'S workspace, read-only, never edit. Its Revolut webhook inserts `orders` (status `paid`), flips products sold, sends order-confirmation + admin emails, fires Meta CAPI. The CRM must never duplicate those jobs.
- **CRM owns fulfillment**: order status transitions (paid → shipped → delivered), tracking numbers, internal notes, the shipping-notification email (Edge Function `shipping-email`, exactly-once via `orders.shipping_email_sent_at`), manual Etsy/offline order entry, and contacts auto-created from orders (Postgres trigger).
- **Auth**: Supabase Auth; first signup became admin (Ryan). Invite-only afterwards.
- **Deployment**: LIVE at **https://crm.akalds.com** — Vercel project `akal-crm` (team scope `team_CLVH6A5V4NT1rzmtlaFXTAwV`), static `dist/` deploys. To ship (only on Ryan's "ship it"): bake env at build (`NODE_ENV=production VITE_SUPABASE_URL=… VITE_SB_PUBLISHABLE_KEY=… VITE_ATTACHMENTS_BUCKET=attachments npm run build`), then `cd dist && npx vercel deploy --prod --yes`. Hash routing + relative base; do not add a BrowserRouter. Supabase auth site_url points at crm.akalds.com (+ localhost:5174 for dev).
- **Money**: order amounts are integer minor units with a `currency` ISO column. Never sum across currencies; aggregate per ISO code.

## Rules

- NO Vercel deploys without Ryan's explicit "ship it" — batch all changes into one deploy.
- `~/kechken` (prior storefront) is reference/port-source only, read-only.
- Keep `upstream` remote (marmelab/atomic-crm) for pulling component updates; never push to upstream.
