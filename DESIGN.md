# BLOC — design language for the Akal operations platform

*Supersedes "Le Registre" (2026-06-12 – 2026-07-28), the paper/ink editorial
system. Ryan moved the CRM onto the **reown.com** design system on 2026-07-28,
following its use on crm.demande-raccordement.fr. Everything Le Registre
mandated — hairline rules, zero radius, Cormorant serif, no boxes — is
**withdrawn**. Do not reintroduce it.*

*Re-coloured 2026-07-29: the structure stays reown's, the palette is now
Maison Tanneurs'. Reown's cool greys and its blue/coral/green/yellow read as
generic SaaS against a catalogue of cognac and saddle-tan leather. Every
material token below is now either a Maison Tanneurs production value (lifted
from `mt-lestanneurs/app/globals.css`, the palette that renders at
maisontanneurs.com) or a warm-register colour derived to hold reown's measured
luminance relationships. **The geometry, type and layout are unchanged** — this
was a colour pass, not a redesign.*

Nothing here is estimated: the structure came from the reown.com screenshots in
`~/Downloads/Reown`, and every contrast figure quoted is produced by
`node scripts/verify-palette.mjs`, which fails the run if a pair regresses.

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
- The ground holds reown's measured *luminance* and drops its cool cast:
  `#a3998c`, a warm taupe, panel/ground 2.31:1 against reown's 2.32:1. An
  earlier lighter `#adadad` was both less faithful and *worse* on contrast
  (1.85:1) — lightening the ground is a solved question, do not revisit it.
- The storefront's own answer — white ground, hairline rules, Cormorant — is
  **not** available to us. That is a shop window read for ninety seconds; this
  is a tool read for eight hours. We take the house's *colour*, not its
  furniture.
- Dark panels are for **figures and focus** (dashboard totals, login), not
  for data lists. Long tables go on the light panel, black on `#e9e9e9`,
  or they cannot be read all day.
- Colour is **state**, never decoration. reown blocks colour by section; we
  block it by meaning.

## Material

`MT` marks a value taken unchanged from the Maison Tanneurs storefront.

| Token | Light | Dark | Use |
|---|---|---|---|
| `ground` | `#a3998c` | `#100d0a` | the page behind everything |
| `panel` | `#ebe9e4` MT | `#211c17` MT | data surfaces — lists, forms, tables |
| `panel-raised` | `#f6f4f1` MT | `#2a241d` MT | nested block inside a panel |
| `panel-strong` | `#211c17` MT | `#0f0d0b` | figures, login, focus blocks |
| `ink` | `#1c1a17` MT | `#ede9e2` | text on light panels |
| `ink-soft` | `#57534c` MT | `#c0b9ae` | secondary type |
| `ink-muted` | `#8d867c` MT | `#8d867c` MT | labels, secondary data |
| `ink-inverse` | `#f7f6f2` | `#f7f6f2` | text on `panel-strong` |
| `ink-muted-inverse` | `#9a9289` | `#9a9289` | muted type on `panel-strong` (5.51:1) |
| `input` | `#d2cbc0` | `#453c31` | the fill of a form control |

Accents — five meanings, all inside the tannery's range:

| Token | Light | Dark | Means |
|---|---|---|---|
| `tobacco` | `#8b5a2b` MT | `#916030` | primary action, links, current nav |
| `tobacco-deep` | `#74491f` | `#7a4f26` | pressed / active |
| `accent-ink` | `#8b5a2b` | `#c9914f` | tobacco doing the work of *type* |
| `rust` | `#db6b42` | ← | needs attention — to ship, overdue, error |
| `sage` | `#7f9d63` | ← | settled — delivered, available |
| `brass` | `#cc9e3d` | ← | waiting — pending, draft |
| `clay` | `#b89073` | ← | in hand — paid, reserved, chased |
| `stone` | `#d5cfc5` | ← | in transit — the one uncoloured status |

`tobacco` is the storefront's single accent and it is the CRM's action colour.
It never states a status, and no status ever uses it — that separation is what
lets a coloured thing on this page mean exactly one thing.

Three rules the palette is built on, each of which will bite you if ignored:

1. **A fill and a piece of coloured type cannot be the same value.** A fill is
   read against the ink on top of it; type is read against the panel behind it.
   Hence the `-ink` pairs: `sage` `#7f9d63` fills a pill, `sage-ink` `#4a5c37`
   writes a word. Using `text-sage` gets you 2.51:1 and an unreadable line.
2. **Status pills keep their light fill in dark mode**, so the type on them is
   `--on-accent`, a fixed dark ink that does *not* follow `--ink` into dark
   mode. Wire a pill to `--ink` and it turns light-on-light after sunset.
3. **`tobacco` is the one accent too dark for dark type** (2.97:1). It carries
   `--on-primary` (ivory, 5.40:1). Every other accent carries `--on-accent`.
   This is the single exception to "accents take dark text" — do not generalise
   it, and do not lighten tobacco to escape it: it is the brand's own value.

## Radius

| Token | Value | On |
|---|---|---|
| `--radius-panel` | 28px | panels, dialogs, cards |
| `--radius-tile` | 16px | photo plates, nested tiles, inputs |
| `--radius-control` | 999px | buttons, chips, status pills, nav items |

Nothing in the interface has a radius between 0 and 16px. Two carve-outs, both
because the rule would destroy the shape rather than style it: the tooltip
arrow (a 10px rotated square) and the checkbox glyph (16px would make it a
radio button). Neither is a panel, a tile or a control surface.

The shadcn scale is remapped onto ours in `@theme` — `rounded-sm` and
`rounded-md` both resolve to 16px — so untouched primitives land on-register by
default. A `rounded-md` in an untouched `ui/` file is **not** a violation.

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

Only full-strength `ink` survives on the ground — measured against `#a3998c`:
`ink` 6.19:1, `ink-muted` **1.28:1**. Muted text therefore belongs on a panel,
never on the ground. Page furniture that must sit on the ground (list headers,
filter labels, the settings section nav) carries the `on-ground` class, which
promotes it to ink. The warm ground is *less* forgiving of muted type than
reown's grey was — check any label you move onto it.

Known and accepted: panel-against-ground is 2.31:1, below the 3:1 that
WCAG 1.4.11 asks of UI component boundaries. reown.com's own is 2.24:1. The
chips are identified by their label and icon, not by their edge.

## Navigation

Navigation is a row of **pill chips across the top**, as on reown.com — not a
rail. The rail version left a tall empty column on every page and took ~260px
from the content. Active chip is solid `tobacco` with `on-primary` text
(5.40:1). The house chip at the left is `panel-strong`, and inverts to `ink` in
dark mode — panel-strong on the dark ground is a black shape on black.

## Status

Le Registre's 6px dot is withdrawn. Status is a **filled pill**: mono 10px,
uppercase, `0.1em`, fully round, solid accent, `on-accent` text. Every status
accent is light enough to take that dark ink; none uses white.

`● PAYÉE` becomes a clay `PAYÉE` pill. One pill per row, never two.

Some surfaces still use a dot + word (carts, stock alerts, catalogue). Those
predate this rule and are **on the list, not the standard** — convert them to
pills when you next touch those files.

## Imagery

Photographs are **tiles**: 16px radius, flush square crop, no border, on
`panel-raised`. The zero-radius hairline "plate" is withdrawn. Real product
photography only — never stock, never placeholder services.

## Motion

Blocks settle; they do not fade in like paper. One entrance per page: 180ms,
`cubic-bezier(0.22, 1, 0.36, 1)`, opacity + 6px rise. Hover on a control
shifts its fill one step, 120ms. Nothing slides, bounces, or glows.

## What is deliberately rejected

- **Hairline rules and 1px borders.** Separation comes from the ground gap and
  from panel fill. If you reach for `border-b`, you have lost the plot. Note
  what this means for form controls: an input cannot be an *outlined* box, so
  it is a **filled** one (`--input`), and it must separate from whatever
  surface it lands on by fill alone. An input styled `bg-panel-raised` sitting
  inside a `panel-raised` tile is invisible — this shipped on the login page
  and is exactly the failure mode to watch for.
- **`border-*` classes pointed at a transparent token.** `--hairline` and
  `--border` resolve to `transparent`, so such a class does not draw a rule —
  it silently draws nothing while telling the next reader a rule exists. Delete
  the class; don't leave it as documentation of an intention.
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

Structure: `~/Downloads/Reown` (reown.com, captured 2026-07-28) — geometry,
proportion and layout sampled directly from those pixels. The sibling
implementation on crm.demande-raccordement.fr sits behind auth and could not be
diffed; if it and this file disagree on structure, **the screenshots win**.

Colour: `/Users/ryanz/mt-lestanneurs/app/globals.css` (2026-07-29), the palette
that renders at maisontanneurs.com. Where a value here is marked MT it is that
file's value verbatim. Where it is not, it was derived to hold a measured
relationship and the figure is quoted. The retired `~/kechken` repo carries an
older and richer MT palette doctrine (cognac `#7a4a2b`, bronze, oxblood); it
disagrees with production on every core value and is **not** authoritative.

Verification: `node scripts/verify-palette.mjs` re-derives every contrast pair
in this document and exits non-zero on a regression. Run it after any token
change — the numbers in this file are its output, not estimates.
