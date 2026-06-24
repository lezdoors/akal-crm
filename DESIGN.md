# Le Registre — design vision for the Maison Tanneurs operations platform

*Supersedes the Linear-replica spec of 2026-06-11. The Linear phase taught the
anatomy (density, hierarchy, speed); this phase replaces its skin and several
of its assumptions with the maison's own language.*

## Thesis

This is not a CRM that looks nice. It is the maison's **working register** —
the software equivalent of the atelier's ledger: paper, ink, photographs of
the pieces, hairline rules. Every screen answers one question: *what needs my
attention right now?* Everything else stays quiet.

## Material

The chrome is **paper, not app**. One warm surface; regions are made with
whitespace and single hairlines, never boxes. No cards, no shadows, no tinted
chips, no rounded containers.

| Token        | Light    | Dark (espresso) |
|--------------|----------|-----------------|
| paper        | #F7F4EE  | #16120D         |
| paper-raised | #FCFAF6  | #1D1812         |
| ink          | #221C14  | #EBE4D8         |
| ink-soft     | #4A4238  | #C9C0B2         |
| ink-muted    | #8A8071  | #877C6C         |
| hairline     | #E6DFD2  | #2D2820         |
| tobacco      | #8A6A43  | #A8845B         |

Tobacco is the only accent. It marks money-adjacent state (paid, reserved)
and primary actions. Nothing else gets color; success/error speak through
ink weight and a small dot.

## Typography

Three voices, never more:

1. **Cormorant Garamond 500** — page titles (26px), editorial figures, the
   date on Today. The voice of the maison.
2. **Inter overline** — 10px, uppercase, tracking 0.14em, ink-muted. Section
   labels, table headers, status words. The voice of the register.
3. **Inter 13px** — all data. Money always `tabular-nums`, never bold.

## Status language

No pills. A 6px dot + an overline word: `● PAYÉE`. Dot colors: tobacco =
paid/reserved · ink = shipped/sold · moss (#5A6B52) = delivered/available ·
muted = pending/draft. Reads at a glance, never shouts.

## Imagery

The pieces are the interface. Photos are **plates**: square, flush crops,
hairline frame, zero radius. Order rows lead with the piece. Today leads
with what must ship. The collection grid is a contact sheet, not a card grid.

## Motion

One entrance per page: 240ms fade + 4px rise, ease-out — the page is *placed*
on the desk. Hovers shift ink or reveal a hairline; nothing slides, bounces,
or glows. 150ms everywhere else.

## Information architecture

- **Aujourd'hui** — the action page. Pieces to ship (photo-first), latest
  orders, new clients, collection pulse, recent activity. No revenue widgets,
  no charts: a register, not a boardroom.
- **Commandes** — photo-first rows; the row IS the work order.
- **Clients** — a client file reads like a maison's client book: who, what
  they own, what was said.
- **Collection** (Pièces / Inventaire) — contact sheet + counts.
- **Studio** — the maison's images.
- Réglages stays in the footer. Deals/companies stay registered but invisible
  (future wholesale pipeline).

## Empty states

Empty is a state of readiness, not failure: an overline, one serif sentence,
one quiet action. The register before the season opens.

## What was deliberately rejected

- Boxed widget dashboards, KPI tiles, charts (no decision they'd inform yet)
- Tinted status pills, colored badges, avatars-as-decoration
- Inset floating content card (Linear's anatomy) — content sits ON the paper
- Blue focus rings, cool grays, pure white — the register is never cold

## Installed design skills — how they bind here

Several design skills are installed globally (`minimalist-ui`, `frontend-design`,
`dashboard`, and `ui-ux-pro-max`'s style packs incl. brutalism). On this repo
**Le Registre always wins**; the skills are subordinate, not a license to relax
the rejections above.

- **`dashboard` and `brutalism` (and `ui-ux-pro-max`'s glass/neo/clay packs) are
  off-register here — do not apply them.** Dark glass panels, modular data
  grids, heavy borders/shadows, mono-brutalist type and gradient chrome are the
  exact SaaS look Le Registre rejects. They belong to other product types, not
  this maison's back office.
- **`minimalist-ui` is the only on-register skill** — and only as a lens, not a
  kit (see below). It confirms the direction we already hold; it does not add to it.

- **minimalist-ui** is *not* permission for its component kit. Its bento cards,
  1px-bordered cards, pill/badge tags, pastel spot-colors, faux-macOS window
  chrome and `<kbd>` chrome all violate "no boxed cards / no pills / no tinted
  chips / tobacco is the only accent." Do not introduce any of them. Borrow only
  its macro-whitespace and `IntersectionObserver` scroll-entry discipline — and
  even then defer to the single 240ms entrance defined under Motion.
- **frontend-design** / **minimalist-ui** both say "avoid Inter, never go
  generic." Here Inter is the register's data and label voice (see Typography) —
  keep it. Cormorant Garamond is the only display face. Ignore the skills' pull
  toward bold or maximalist layouts.
- **Imagery**: both skills suggest stock / `picsum.photos` placeholders. Never.
  Plates come from real product photography (Studio / Higgsfield pipeline),
  never stock, on any screen.
