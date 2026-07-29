# BLOC — design language for the Akal operations platform

*Supersedes "Le Registre" (2026-06-12 – 2026-07-28), the paper/ink editorial
system. Ryan moved the CRM onto the **reown.com** design system on 2026-07-28,
following its use on crm.demande-raccordement.fr. Everything Le Registre
mandated — hairline rules, zero radius, Cormorant serif, tobacco as the only
accent, no boxes — is **withdrawn**. Do not reintroduce it.*

Colours below are sampled from the reown.com screenshots in
`~/Downloads/Reown`, not estimated.

## Thesis

The page is a **field of blocks floating on a grey ground**. Nothing is a
document; everything is an object with weight, a large radius, and a job.
Reown gets its character from three moves, and so do we:

1. **The ground is grey, never white.** Panels are legible because they sit
   *on* something, not because they are outlined.
2. **Radius is enormous and unapologetic.** Panels 28px, controls fully
   round. There are no 4px corners anywhere.
3. **Monospace is the voice of the interface.** Labels, numerals, buttons,
   nav, status — all mono. Sans is only for human prose (names, notes,
   addresses).

## Where we must beat the source

reown.com is a marketing site: six words per screen, panels the size of a
laptop. A CRM is dense, tabular, and read for eight hours a day. Copying the
artifacts gives huge empty boxes with a tiny table inside. Translate the
**principles**, not the proportions:

- Panel radius is 28px, **not** reown's 64–80px stadium. At CRM density a
  stadium eats its own content.
- The ground is reown's measured `#9a9a9a`. An earlier lighter `#adadad`
  was both less faithful and *worse* on contrast (panel/ground 1.85:1 vs
  2.32:1).
- Dark panels are for **figures and focus** (dashboard totals, login), not
  for data lists. Long tables go on the light panel, black on `#e9e9e9`,
  or they cannot be read all day.
- Colour is **state**, never decoration. reown blocks colour by section; we
  block it by meaning.

## Material

| Token | Light | Dark | Use |
|---|---|---|---|
| `ground` | `#9a9a9a` | `#141414` | the page behind everything |
| `panel` | `#e9e9e9` | `#202020` | data surfaces — lists, forms, tables |
| `panel-raised` | `#f4f4f4` | `#2a2a2a` | nested block inside a panel |
| `panel-strong` | `#202020` | `#000000` | figures, login, focus blocks |
| `ink` | `#202020` | `#ededed` | text on light panels |
| `ink-muted` | `#5c5c5c` | `#9a9a9a` | labels, secondary data |
| `ink-inverse` | `#f4f4f4` | `#f4f4f4` | text on `panel-strong` |

Accents — measured, not invented:

| Token | Hex | Means |
|---|---|---|
| `blue` | `#559be8` | primary action, links, current nav |
| `blue-deep` | `#3d86e9` | pressed / active |
| `coral` | `#e36b53` | needs attention — to ship, overdue, error |
| `green` | `#50a96c` | settled — delivered, available, paid |
| `yellow` | `#f4bb40` | waiting — pending, draft |

## Radius

| Token | Value | On |
|---|---|---|
| `--radius-panel` | 28px | panels, dialogs, cards |
| `--radius-tile` | 16px | photo plates, nested tiles, inputs |
| `--radius-control` | 999px | buttons, chips, status pills, nav items |

Nothing in the interface has a radius between 0 and 16px.

## Typography

Two voices only. The serif is gone.

1. **Geist Mono** — every piece of interface furniture: page titles, all
   numerals, money, dates, labels, buttons, nav, status, table headers,
   order numbers. Money and counts get `tabular-nums`.
2. **Inter** — human prose only: customer names, note bodies, addresses,
   product descriptions.

If you cannot decide which a string is, it is mono. The mono is the
register's signature; diluting it is how this becomes generic.

- Page title: mono 28px, `-0.02em`, `ink`.
- Label / overline: mono 10px, uppercase, `0.12em`, `ink-muted`.
- Data: mono 13px.
- Prose: Inter 13px / 1.55.

## Text on the ground

Only full-strength `ink` survives on the grey ground — measured against
`#9a9a9a`: `ink` 5.79:1, `ink-soft` 3.86:1, `ink-muted` **2.38:1**. Muted
text therefore belongs on a panel, never on the ground. Page furniture that
must sit on the ground (list headers, filter labels) carries the `on-ground`
class, which promotes it to ink.

Known and accepted: panel-against-ground is 2.32:1, below the 3:1 that
WCAG 1.4.11 asks of UI component boundaries. reown.com's own is 2.24:1. The
chips are identified by their label and icon (13.4:1), not by their edge.

## Navigation

Navigation is a row of **pill chips across the top**, as on reown.com — not a
rail. The rail version left a tall empty column on every page and took ~260px
from the content. Active chip is solid `blue` with `#10233a` text (5.47:1).

## Status

Le Registre's 6px dot is withdrawn. Status is a **filled pill**: mono 10px,
uppercase, `0.1em`, fully round, solid accent, with `#202020` text — all five
accents are light enough to take dark text and none should use white.

`● PAYÉE` becomes a green `PAYÉE` pill. One pill per row, never two.

## Imagery

Photographs are **tiles**: 16px radius, flush square crop, no border, on
`panel-raised`. The zero-radius hairline "plate" is withdrawn. Real product
photography only — never stock, never placeholder services.

## Motion

Blocks settle; they do not fade in like paper. One entrance per page: 180ms,
`cubic-bezier(0.22, 1, 0.36, 1)`, opacity + 6px rise. Hover on a control
shifts its fill one step, 120ms. Nothing slides, bounces, or glows.

## What is deliberately rejected

- **Hairline rules and 1px borders.** Separation comes from the ground gap
  and from panel fill. If you reach for `border-b`, you have lost the plot.
- **White page backgrounds.** The ground is grey; a white app is the thing
  this replaced.
- **Serif anything.** Cormorant Garamond and Bodoni Moda SC are retired from
  the CRM. (They remain correct for Maison Tanneurs' *storefront* — this is
  the back office, a different surface with a different register.)
- **Small radii.** No 4px, no 6px, no 8px.
- **Colour as decoration** — tinted headers, coloured avatars, chart palettes
  for their own sake. Five accents, each with one meaning.
- **Shadows as separation.** A shadow may sit under a floating overlay
  (dialog, dropdown) and nowhere else.

## Installed design skills are subordinate

`ui-ux-pro-max`, `minimalist-ui`, `dashboard`, `frontend-design` and the
glass/neo/clay/brutalism packs do **not** override this file. In particular:
glassmorphism, gradient chrome, and pastel spot-colour sets are off-register.
Borrow nothing but spacing discipline.

## Provenance

Reference screenshots: `~/Downloads/Reown` (reown.com, captured 2026-07-28).
Palette sampled directly from those pixels. The sibling implementation on
crm.demande-raccordement.fr sits behind auth and could not be diffed; if it
and this file disagree, **the screenshots win**.
