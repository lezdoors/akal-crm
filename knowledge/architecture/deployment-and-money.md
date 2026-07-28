---
okf: 0.1
type: reference
title: Deployment & money handling
status: current
owner: any-agent
updated: 2026-07-28
resource: "Vercel project akal-crm (team_CLVH6A5V4NT1rzmtlaFXTAwV) + scripts/ship.sh"
tags: [vercel, deployment, money, currency]
links: [backend-and-storefront-boundary, ../operations/guardrails]
---

## Deployment

LIVE at **https://crm.akalds.com** — Vercel project `akal-crm`
(team scope `team_CLVH6A5V4NT1rzmtlaFXTAwV`), static `dist/` deploys.

To ship (**only on Ryan's explicit "ship it"** — see
[guardrails](../operations/guardrails.md)):

```bash
./scripts/ship.sh
```

`ship.sh` bakes env, then **restores the `dist/.vercel` link that `vite build`
wipes**, then deploys to the `akal-crm` project.

> Never deploy from `dist` without the link, or Vercel creates a stray "dist"
> project.

- **Hash routing + relative base** — do **not** add a `BrowserRouter`.
- Supabase auth `site_url` points at `crm.akalds.com` (+ `localhost:5174` for dev).

## Money

- Order amounts are **integer minor units** with a `currency` ISO column.
- **Never sum across currencies** — aggregate per ISO code
  (`revenueByCurrency`).
- **Format in the interface locale, never the currency's own.** Use
  `useFormatMoney()` (or `formatMoney(minor, code, locale)`) from
  `orders/orderUtils`. Formatting each currency in its home locale mixes
  `680,00 €` with `$495.00` in one column; the register reads as one screen,
  one set of separators. `currencyDisplay: "narrowSymbol"` is required —
  French otherwise renders foreign currencies as `£GB` / `$US`.
- Dates follow the same rule: `useFormatDate()`, never a bare
  `toLocaleDateString()`, which silently uses the *browser's* locale and
  ignores the app's FR/EN toggle.
- `products.price` is genuinely **USD** minor units (the storefront stores a
  USD base and converts per-request), so `formatMoney(price, "USD")` in the
  catalogue is correct, not a bug.
- Multi-currency figures never share one display line — see
  `dashboard/ChannelOverview`: largest holding leads, the rest sit quietly
  beneath.
