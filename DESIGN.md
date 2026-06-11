# Maison Tanneurs CRM — Design Direction

"Linear meets luxury operations software." Built by a fashion house, not a CRM vendor.

## Audit vs Linear (2026-06-11)

What we had vs what Linear actually does:

| Surface | Current | Linear | Verdict |
|---|---|---|---|
| Canvas | White everywhere, bordered sidebar | Soft gray canvas, **borderless** sidebar, content floats as a rounded white card | REBUILD — adopt inset-card anatomy |
| Nav | Uppercase tracked eyebrows, serif wordmark, border-r | 13px sans, pill active states, workspace header w/ search+compose | REBUILD — chrome is sans/compact; serif lives in content only |
| Dashboard | KPI band + revenue chart (SaaS cliché) | No dashboards — queues of work | REDESIGN — action queues, not revenue widgets |
| Tables | DataTable w/ visible column chrome | Rows feel like lists: hover, no cell borders, fast scan | RESTYLE |
| Radius | 0 (storefront transplant) | Soft (~6-8px) rounding everywhere | CHANGE — radius 0.45rem; editorial sharpness stays in content typography, not chrome |
| Nav model | Deals/Companies (CRM vendor concepts) | n/a | REMOVE from nav (data kept) |
| Color | Tobacco used broadly | Color almost absent; one accent, rarely | RESTRAIN — leather accent only for action/attention |

**Remove:** KPI tiles, revenue trend chart, deals/companies nav, uppercase chrome labels, border-heavy cards.
**Keep:** command palette (⌘K), product-photo joins, FR/EN, login entrance, order work-order layout.

## Tokens (Ryan's spec)

- Canvas `#F8F7F4` · Content `#FFFFFF` · Text `#1D1B19` · Leather accent `#8A6A43`
- Inter for ALL UI. Cormorant/Bodoni reserved for major section headings + login only.
- Radius 0.45rem. Borders: hairline, minimal. Shadows: one soft shadow on the floating content card, none inside.
- Spacing: 8px scale.

## Navigation

```
[MT] Maison Tanneurs        ⌕ ✎
  Tableau de bord
  Commandes
  Clients
CATALOGUE
  Produits
  Collections      (category-grouped product views)
  Inventaire       (stock states: sold / low / reserved)
STUDIO
  Médiathèque      (product photography DAM, v1 from products.images)
  Campagnes        (deferred — no data surface yet; ships when campaign assets get an API)
  Réglages (footer)
```

Deals & Companies leave the nav. Contacts presented as **Clients**.

## Wireframes

### Dashboard — a work queue, not analytics
```
┌─ À expédier (N) ──────────────────────────────┐ ┌ Activité ────────┐
│ [img] MT-0001  Claire Dubois   3j   680 €  →  │ │ · note ...       │
│ [img] MT-0002  J. Whitford     1j   £540   →  │ │ · commande ...   │
└───────────────────────────────────────────────┘ │ · client ...     │
┌─ Nouveaux clients ────────┐ ┌─ Stock ─────────┐ └──────────────────┘
│ ◯ Claire D.   2 cmd  1.3k │ │ ● épuisé: 3     │
│ ◯ Marcus B.   1 cmd  720  │ │ ● réservé: 1    │
└───────────────────────────┘ └─────────────────┘
```
(Revenue lives in Commandes filters/export — not as dashboard wallpaper.)

### Commandes — product-centric rows
```
[56px photo] Atlas Kilim Duffle        Claire Dubois     ● Payée   suivi —   680 €   2j
             Cuir pleine fleur · Cognac  claire@…
```
One line per order, photo-first, hover reveals row, click → work order.

### Clients — luxury profile
```
◯ Claire Dubois            Paris, FR        2 commandes · 1 360 € à vie
[Commandes] [Notes/timeline] [Préférences produit]
```
Implemented as an order-history + LTV module added to the existing contact profile.

### Produits — catalogue cards
```
┌────────┐ ┌────────┐ ┌────────┐
│ photo  │ │ photo  │ │ photo  │   filters: collection / stock
│ Title  │ │ Title  │ │ Title  │
│ 680 €  │ │ sold   │ │ 540 €  │
└────────┘ └────────┘ └────────┘
```
Read-only (Airtable remains canonical via the sync cron).

### Médiathèque — luxury DAM grid
```
[≣ grid of product photography, hover → product + copy-URL]
v1 source: products.images[] (every published photo). Video/campaign
assets enter when they live somewhere a browser can reach (Supabase
storage listing or a manifest) — Drive isn't browser-accessible.
```

## Interactions

150ms ease transitions on hover/active; pill hovers in nav; ⌘K everywhere;
no entrance animations inside the app (login only).
