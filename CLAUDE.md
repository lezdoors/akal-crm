# Akal CRM — fork of marmelab/atomic-crm

> **📚 Canonical project knowledge lives in [`knowledge/`](./knowledge/README.md)** (OKF — plain markdown, no tooling needed).
> Read it first. **As you work, keep those nodes current in the same change** — don't wait to be asked. Contract: [`knowledge/SCHEMA.md`](./knowledge/SCHEMA.md).

**Design language**: "Le Registre" — see `DESIGN.md` (paper/ink palette, Cormorant Garamond display voice, overline labels, dot-status, photo plates, no boxed cards/pills). Any new UI must follow it; do not reintroduce SaaS chrome.

Back-office CRM for Akal's consumer brands. v1 serves **Maison Tanneurs**; Maison Izem is added at its launch as a second build of this same repo with Izem env vars (no code fork).

Upstream's agent-team harness (`.claude/`, old CLAUDE.md/MEMORY.md) was removed 2026-06-11 — this fork uses Ryan's standard fleet workflow. `AGENTS.md` (upstream dev docs: commands, architecture, schema workflow) remains accurate and useful.

## Architecture & rules

Full detail is in [`knowledge/`](./knowledge/README.md) — read these before touching the matching area:

- [`architecture/backend-and-storefront-boundary`](./knowledge/architecture/backend-and-storefront-boundary.md) — shared Supabase `xbtabpurfavngwmwtawc`; storefront is read-only; webhook jobs the CRM must not duplicate.
- [`architecture/fulfillment-ownership`](./knowledge/architecture/fulfillment-ownership.md) — what the CRM owns; order column-immutability; private attachments bucket.
- [`architecture/auth-and-email`](./knowledge/architecture/auth-and-email.md) — Supabase Auth + Resend SMTP; the two invite-eating gotchas.
- [`architecture/deployment-and-money`](./knowledge/architecture/deployment-and-money.md) — `ship.sh`, hash routing, currency handling.
- [`operations/guardrails`](./knowledge/operations/guardrails.md) — the hard "do not" list (deploys, storefront, upstream, `~/kechken`).
