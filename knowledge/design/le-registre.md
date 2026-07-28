---
okf: 0.1
type: reference
title: Le Registre — design language (invariants)
status: current
owner: any-agent
updated: 2026-07-28
resource: DESIGN.md
tags: [design, le-registre, ui]
links: [../operations/guardrails]
---

> **Canonical source: [`DESIGN.md`](../../DESIGN.md).** This node is a faithful
> summary of the non-negotiable invariants for fast agent reference. On any
> conflict, `DESIGN.md` wins — and if you change one, change the other.

## Thesis

Not "a CRM that looks nice" — the maison's **working register**: paper, ink,
photographs of the pieces, hairline rules. Every screen answers *what needs my
attention right now?*

## Hard invariants (the rejections)

- Chrome is **paper, not app**. Regions made with whitespace + single hairlines,
  **never boxes**. No cards, no shadows, no tinted chips, no rounded containers.
- **Tobacco (`#8A6A43` / dark `#A8845B`) is the only accent** — money-adjacent
  state + primary actions. Nothing else gets color.
- Status = **6px dot + overline word** (`● PAYÉE`). No pills, no badges.
- Type: **Cormorant Garamond 500** (display only) + **Inter overline** (labels)
  + **Inter 13px** (all data, money always `tabular-nums`, never bold).
- Imagery = **plates**: square, flush crops, hairline frame, zero radius. Real
  product photography only — **never stock / picsum**.
- One entrance per page: 240ms fade + 4px rise. Nothing slides/bounces/glows.

## Where upstream colour still leaks in

Atomic CRM ships pastel palettes that reintroduce accent colour by data rather
than by markup. Both are neutralised, and both can come back through the DB:

- **Client warmth** (`root/defaultConfiguration.ts` `defaultNoteStatuses`) was
  blue/amber/salmon/green. It is now four ink steps with tobacco for
  *in-contract*.
- **Tag colours** are stored per row, so a palette swap alone cannot reach
  existing tags. `tags/colors.ts` exports `registerTagColor()`, which passes
  palette colours through and renders anything else at its own lightness in
  ink. Every tag dot must go through it.

## The register's language for people

The resource is `contacts` in code and the database; it is **"Clients"**
everywhere a human reads it — sidebar, breadcrumb, page title, dialogs, both
catalogues. The breadcrumb root is **"Today"** (`ra.page.dashboard` is
overridden), matching the first sidebar entry, not react-admin's "Dashboard".

## Installed design skills are subordinate here

**Le Registre always wins.** `dashboard`, `brutalism`, `ui-ux-pro-max`
glass/neo/clay packs are **off-register — do not apply**. `minimalist-ui` is a
lens only (borrow macro-whitespace + scroll-entry discipline), **not** its
component kit (its cards/pills/badges/spot-colors all violate the rejections).
Keep Inter despite the skills' "avoid Inter" advice. Full rationale in
`DESIGN.md`.
