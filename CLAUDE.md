# Akal CRM — fork of marmelab/atomic-crm

> **📚 Canonical project knowledge lives in [`knowledge/`](./knowledge/README.md)** (OKF — plain markdown, no tooling needed).
> Read it first. **As you work, keep those nodes current in the same change** — don't wait to be asked. Contract: [`knowledge/SCHEMA.md`](./knowledge/SCHEMA.md).

**Design language**: "BLOC" — see [`DESIGN.md`](./DESIGN.md), which is the authority and must be read before any UI change. Blocks on a warm ground; 28px panels and fully-round controls (nothing between 0 and 16px); Geist Mono for all interface furniture and Inter for prose only; colour is state, never decoration. The material palette is Maison Tanneurs' clean-white system applied to reown.com's structure; the action colour is fuchsia `#c2188c` (never a status) and statuses use reown's bright quartet (blue/coral/green/yellow). Separation is the ground gap and panel fill — there are no hairlines, and `--border` resolves to `transparent`, so a `border-*` class draws nothing.

*"Le Registre" — the paper/ink, Cormorant Garamond, hairline-rule, dot-status system — was withdrawn 2026-07-28. Do not reintroduce it, and treat any comment or docblock still describing it as stale.*

After changing a design token, run `node scripts/verify-palette.mjs`; it fails on a contrast regression.

Back-office CRM for Akal's consumer brands. v1 serves **Maison Tanneurs**; Maison Izem is added at its launch as a second build of this same repo with Izem env vars (no code fork).

Upstream's agent-team harness (`.claude/`, old CLAUDE.md/MEMORY.md) was removed 2026-06-11 — this fork uses Ryan's standard fleet workflow. `AGENTS.md` (upstream dev docs: commands, architecture, schema workflow) remains accurate and useful.

## Architecture & rules

Full detail is in [`knowledge/`](./knowledge/README.md) — read these before touching the matching area:

- [`architecture/backend-and-storefront-boundary`](./knowledge/architecture/backend-and-storefront-boundary.md) — shared Supabase `xbtabpurfavngwmwtawc`; storefront is read-only; webhook jobs the CRM must not duplicate.
- [`architecture/fulfillment-ownership`](./knowledge/architecture/fulfillment-ownership.md) — what the CRM owns; order column-immutability; private attachments bucket.
- [`architecture/auth-and-email`](./knowledge/architecture/auth-and-email.md) — Supabase Auth + Resend SMTP; the two invite-eating gotchas.
- [`architecture/deployment-and-money`](./knowledge/architecture/deployment-and-money.md) — `ship.sh`, hash routing, currency handling.
- [`operations/guardrails`](./knowledge/operations/guardrails.md) — the hard "do not" list (deploys, storefront, upstream, `~/kechken`).
