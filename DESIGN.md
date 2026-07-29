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
was a colour pass, not a redesign. Later the same day the accents were
re-brightened at Ryan's direction — see the Accents section; the warm-brown
accent pass is history, not doctrine.*

Nothing here is estimated: the structure came from the reown.com screenshots in
`~/Downloads/Reown`, and every contrast figure quoted is produced by
`node scripts/verify-palette.mjs`, which fails the run if a pair regresses.

## Thesis

The page is a **field of blocks floating on a grey ground**. Nothing is a
document; everything is an object with weight, a large radius, and a job.
Reown gets its character from three moves, and so do we:

1. **The ground is grey, never white — the panels are the white.** A panel is
   legible because it sits *on* something, not because it is outlined. Invert
   that (white page, grey cards) and you have the SaaS admin this replaced.
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
- The ground sits near reown's measured luminance at `#979490`, a neutral
  stone. Because the panels on it are white, panel/ground is **3.02:1** —
  above the 3:1 WCAG 1.4.11 asks of component boundaries, which reown.com's
  own 2.24:1 never reached. An earlier lighter `#adadad` was both less
  faithful and worse (1.85:1); lightening the ground is a solved question, do
  not revisit it.
- The storefront's own answer — white ground, hairline rules, Cormorant — is
  **not** available to us. That is a shop window read for ninety seconds; this
  is a tool read for eight hours. We take the house's *colour*, not its
  furniture.
- Dark panels are for **figures and focus** (dashboard totals, login), not
  for data lists. Long tables go on the white panel, ink at 17.36:1, or they
  cannot be read all day.
- Colour is **state**, never decoration. reown blocks colour by section; we
  block it by meaning.

## Material

`MT` marks a value taken unchanged from the Maison Tanneurs storefront.

The storefront calls itself a **clean-white editorial system (Polène
discipline)**: white, one warm off-white, warm charcoal ink, one accent. There
is no cream in it. Panels here are therefore **white**, and the ground is the
neutral stone they sit on — not a warm taupe, which would read the white back
as cream.

| Token | Light | Dark | Use |
|---|---|---|---|
| `ground` | `#979490` | `#100d09` | the page behind everything |
| `panel` | `#ffffff` MT | `#211c17` MT | data surfaces — lists, forms, tables |
| `panel-raised` | `#f6f4f1` MT | `#2a241d` MT | nested block inside a panel |
| `panel-strong` | `#211c17` MT | `#0f0c09` | figures, login, focus blocks |
| `ink` | `#1c1a17` MT | `#ffffff` MT | text on light panels |
| `ink-soft` | `#57534c` MT | `#c8c2b8` | secondary type |
| `ink-muted` | `#8d867c` MT | `#8d867c` MT | labels, secondary data |
| `ink-inverse` | `#ffffff` MT | `#ffffff` MT | text on `panel-strong` |
| `ink-muted-inverse` | `#9a9289` | `#9a9289` | muted type on `panel-strong` (5.51:1) |
| `input` | `#e9e9e7` | `#453c31` | the fill of a form control |

`panel-raised` is the *only* warm tint in the light stack, and it is the
storefront's own `--ground-deep`. If you find yourself reaching for another
off-white, you are reintroducing the cream this build exists to remove.

Accents — the action colour is a decision, the statuses are reown's own.

The first accent pass used the storefront's tobacco brown for action and
warm earth tones for status. Ryan retired it on 2026-07-29 ("change the brown
with a happier color like even fuscia"): warm browns cannot state status in a
UI whose photography is *already* brown leather — a clay `PAID` pill next to a
cognac weekender reads as more leather, not as a state. Colour only means
something here if it is foreign to the material. So: action is **fuchsia**
(Ryan's pick), and the four status accents are reown.com's own bright quartet,
sampled from the `~/Downloads/Reown` screenshots.

| Token | Light | Dark | Means |
|---|---|---|---|
| `action` | `#c2188c` | `#d6219c` | primary action, links, current nav |
| `action-deep` | `#a5127a` | `#c2188c` | pressed / active |
| `accent-ink` | `#b81486` | `#f27cc7` | action doing the work of *type* |
| `coral` | `#e36b53` | ← | needs attention — to ship, overdue, error |
| `green` | `#50a96c` | ← | settled — delivered, available, recovered |
| `yellow` | `#f4bb40` | ← | waiting — pending, draft, chased |
| `blue` | `#559be8` | ← | in hand — paid, reserved, new |
| `stone` | `#c6c0b6` | ← | in transit / inert — the uncoloured status |
| `green-ink` | `#2f7a4d` | `#8fd3a8` | green as type on a panel |
| `coral-ink` | `#c0442a` | `#f0937c` | coral as type on a panel |
| `blue-ink` | `#2b6cb8` | `#85bdf5` | blue as type on a panel |

`action` never states a status, and no status ever uses it — that separation
is what lets a coloured thing on this page mean exactly one thing. The retired
names (`tobacco`, `rust`, `sage`, `brass`, `clay`) are aliased onto the new
tokens in `src/index.css`; do not write them in new code.

Three rules the palette is built on, each of which will bite you if ignored:

1. **A fill and a piece of coloured type cannot be the same value.** A fill is
   read against the ink on top of it; type is read against the panel behind it.
   Hence the `-ink` pairs: `green` `#50a96c` fills a pill, `green-ink`
   `#2f7a4d` writes a word. Using `text-green` gets you 2.90:1 and an
   unreadable line.
2. **Status pills keep their light fill in dark mode**, so the type on them is
   `--on-accent`, a fixed dark ink that does *not* follow `--ink` into dark
   mode. Wire a pill to `--ink` and it turns light-on-light after sunset.
3. **`action` is the one accent too dark for dark type** (2.85:1). It carries
   `--on-primary` (white, 5.52:1). Every other accent carries `--on-accent`.
   This is the single exception to "accents take dark text" — do not
   generalise it.

## Pills are a column, not confetti

Every `.pill` is the same width (`min-width: 6.5rem`, centred label), so a
list of orders shows status as one aligned column. A pill whose width tracks
its label produces a ragged edge that reads as disorder at CRM density.
Status is also **never** a dot + word on this platform — the dot survives only
in tiny inline legends (inventory counts, filter rows), and any remaining
dot-status on a data row is on the convert-when-touched list.

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

Only full-strength `ink` survives on the ground — measured against `#979490`:
`ink` 5.75:1, `ink-muted` **1.31:1**. Muted text therefore belongs on a panel,
never on the ground. Page furniture that must sit on the ground (list headers,
filter labels, the settings section nav) carries the `on-ground` class, which
promotes it to ink. Check any label you move onto the ground; the failure is
silent and looks fine on a bright screen.

Panel-against-ground is **3.02:1**, which clears WCAG 1.4.11 for component
boundaries. This is the one place the build beats its source outright —
reown.com's own panels sit at 2.24:1 — and it is a consequence of the panels
being white. Darkening them gives it straight back.

## Navigation

Navigation is a row of **pill chips across the top**, as on reown.com — not a
rail. The rail version left a tall empty column on every page and took ~260px
from the content. Active chip is solid `action` with `on-primary` text
(5.52:1). The house chip at the left is `panel-strong`, and inverts to `ink` in
dark mode — panel-strong on the dark ground is a black shape on black.

## Status

Le Registre's 6px dot is withdrawn. Status is a **filled pill**: mono 10px,
uppercase, `0.1em`, fully round, solid accent, `on-accent` text. Every status
accent is light enough to take that dark ink; none uses white.

`● PAYÉE` becomes a blue `PAYÉE` pill. One pill per row, never two.

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

Colour, material: `/Users/ryanz/mt-lestanneurs/app/globals.css` — github.com/
lezdoors/mt-lestanneurs, the palette that renders at maisontanneurs.com,
verified level with `origin` on 2026-07-29. Where a value is marked MT it is
that file's value verbatim.

Colour, accents: the status quartet is sampled from the reown.com screenshots
in `~/Downloads/Reown`; the fuchsia action colour is Ryan's directive of
2026-07-29 and belongs to the CRM, not the storefront — do not carry it back
to maisontanneurs.com. Everything else was derived to hold a measured
relationship and the figure is quoted.

**Only that file is authoritative.** The retired `~/kechken` repo carries an
older, richer, more tempting MT palette doctrine — cognac `#7a4a2b`, bronze,
oxblood, and a set of warm stone surfaces (`#ebe9e4` paper-alt, `#f8f7f4`
plate). It disagrees with production on every core value, and its warm stones
are where cream enters this design. The first cut of this build used
`#ebe9e4` for panels for exactly that reason and had to be redone. If a value
is not in `mt-lestanneurs/app/globals.css`, it is not the house palette.

Verification: `node scripts/verify-palette.mjs` re-derives every contrast pair
in this document and exits non-zero on a regression. Run it after any token
change — the numbers in this file are its output, not estimates.
